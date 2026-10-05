import React, { useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FolderTree,
  GripVertical,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Star,
  Trash2,
  Type,
  Upload,
  X,
} from 'lucide-react';
import {
  ASSETS,
  ASSET_LABELS,
  fileToDataUrl,
  formatPrice,
  primaryImage,
  storageUsage,
  useStore,
} from '../store.jsx';
import './admin.css';

const SESSION_KEY = 'chocosite.admin.session';
const CREDENTIALS = { id: 'admin', password: '123456' };
const SITE_URL = `${window.location.origin}${import.meta.env.BASE_URL || '/'}`;

const NAV = [
  { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
  { id: 'products', label: 'Ürünler', icon: Package },
  { id: 'categories', label: 'Kategoriler', icon: FolderTree },
  { id: 'site', label: 'Ana Sayfa Metinleri', icon: Type },
  { id: 'whatsapp', label: 'WhatsApp Şablonları', icon: MessageSquare },
  { id: 'payments', label: 'Ödeme Yöntemleri', icon: CreditCard },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

const PAGE_TITLES = Object.fromEntries(NAV.map((item) => [item.id, item.label]));

function TextField({ label, hint, value, onChange, type = 'text', placeholder, rows, ...rest }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      {rows ? (
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          {...rest}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          {...rest}
        />
      )}
      {hint && <small className="adm-hint">{hint}</small>}
    </label>
  );
}

function Toggle({ checked, onChange, on = 'Aktif', off = 'Pasif' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`adm-toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="adm-toggle-dot" />
      {checked ? on : off}
    </button>
  );
}

function Card({ title, hint, children, actions }) {
  return (
    <section className="adm-card">
      <header className="adm-card-head">
        <div>
          <h2>{title}</h2>
          {hint && <p>{hint}</p>}
        </div>
        {actions}
      </header>
      <div className="adm-card-body">{children}</div>
    </section>
  );
}

function AdminLogin({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (id.trim() === CREDENTIALS.id && password === CREDENTIALS.password) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch (sessionError) {
        /* yoksay */
      }
      onLogin();
      return;
    }
    setError('Kullanıcı adı veya şifre hatalı.');
  };

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <span className="adm-login-mark">C</span>
        <h1>ChocoSite Yönetim</h1>
        <p>Ürünleri, metinleri ve WhatsApp şablonlarını buradan yönetin.</p>
        <label className="adm-field">
          <span className="adm-label">Kullanıcı adı</span>
          <input
            value={id}
            autoComplete="username"
            placeholder="admin"
            onChange={(event) => {
              setId(event.target.value);
              setError('');
            }}
          />
        </label>
        <label className="adm-field">
          <span className="adm-label">Şifre</span>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            placeholder="••••••"
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
          />
        </label>
        {error && <p className="adm-error">{error}</p>}
        <button type="submit" className="adm-btn primary block">
          <Lock size={16} /> Giriş yap
        </button>
        <a className="adm-login-back" href={SITE_URL}>
          Siteye dön
        </a>
      </form>
    </div>
  );
}

function DashboardPage({ go, store }) {
  const { state } = store;
  const active = state.products.filter((product) => product.active).length;
  const stats = [
    { label: 'Toplam ürün', value: state.products.length },
    { label: 'Aktif ürün', value: active },
    { label: 'Pasif ürün', value: state.products.length - active },
    { label: 'Kategori', value: state.categories.length },
  ];

  return (
    <div className="adm-stack">
      <div className="adm-stats">
        {stats.map((stat) => (
          <div className="adm-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <Card title="Hızlı işlemler" hint="En sık kullandığınız yönetimsel işlemler.">
        <div className="adm-quick">
          <button className="adm-btn" onClick={() => go('products')}>
            <Plus size={16} /> Ürün ekle
          </button>
          <button className="adm-btn" onClick={() => go('site')}>
            <Type size={16} /> Ana sayfa metinleri
          </button>
          <button className="adm-btn" onClick={() => go('whatsapp')}>
            <MessageSquare size={16} /> WhatsApp şablonları
          </button>
          <a className="adm-btn" href={SITE_URL} target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Siteyi görüntüle
          </a>
        </div>
      </Card>

      <Card
        title="Son ürünler"
        hint="Sıralamada en üstte yer alan ürünler ana sayfada ilk görünür."
        actions={
          <button className="adm-btn" onClick={() => go('products')}>
            Tümünü aç
          </button>
        }
      >
        <div className="adm-mini-list">
          {state.products.slice(0, 5).map((product) => (
            <div className="adm-mini-row" key={product.id}>
              <img src={primaryImage(product)} alt="" />
              <span>{product.name}</span>
              <strong>{formatPrice(product.price)}</strong>
              <em className={`adm-pill ${product.active ? 'ok' : ''}`}>
                {product.active ? 'Aktif' : 'Pasif'}
              </em>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProductEditor({ product, categories, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(() => ({ ...product }));
  const [urlDraft, setUrlDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const addImage = (value) => {
    const clean = String(value || '').trim();
    if (!clean) return;
    setForm((current) => ({ ...current, images: [...current.images, clean] }));
  };

  const handleFiles = async (files) => {
    setBusy(true);
    try {
      const list = Array.from(files).slice(0, 6);
      const urls = [];
      for (const file of list) {
        urls.push(await fileToDataUrl(file));
      }
      setForm((current) => ({ ...current, images: [...current.images, ...urls] }));
    } catch (error) {
      window.alert('Görsel yüklenemedi. Lütfen başka bir dosya deneyin.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const moveImage = (index, delta) => {
    setForm((current) => {
      const images = [...current.images];
      const target = index + delta;
      if (target < 0 || target >= images.length) return current;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...current, images };
    });
  };

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));
  };

  const toggleCategory = (category) => {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
  };

  const valid = form.name.trim() && Number(form.price) >= 0;

  return (
    <div className="adm-modal-layer" role="dialog" aria-modal="true" aria-label="Ürün düzenle">
      <button className="adm-modal-scrim" onClick={onClose} aria-label="Kapat" />
      <div className="adm-modal">
        <header className="adm-modal-head">
          <div>
            <h2>{product.isNew ? 'Yeni ürün' : 'Ürünü düzenle'}</h2>
            <p>{product.isNew ? 'Bilgileri doldurup kaydedin.' : `#${product.id} · ${product.name}`}</p>
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Kapat">
            <X size={20} />
          </button>
        </header>

        <div className="adm-modal-body">
          <div className="adm-form-grid">
            <TextField
              label="Ürün adı"
              value={form.name}
              onChange={(value) => set('name', value)}
              placeholder="Örn. Venedik"
            />
            <div className="adm-form-row">
              <TextField
                label="Fiyat (₺)"
                type="number"
                min="0"
                value={form.price}
                onChange={(value) => set('price', value === '' ? '' : Number(value))}
              />
              <TextField
                label="Eski fiyat (₺)"
                type="number"
                min="0"
                value={form.oldPrice || ''}
                hint="Boş bırakılırsa üstü çizili fiyat gösterilmez."
                onChange={(value) => set('oldPrice', value === '' ? 0 : Number(value))}
              />
            </div>
            <TextField
              label="Rozet"
              value={form.badge}
              onChange={(value) => set('badge', value)}
              placeholder="Örn. %15 indirim"
            />
            <TextField
              label="Açıklama"
              rows={3}
              value={form.description}
              onChange={(value) => set('description', value)}
              placeholder="Ürün kısa açıklaması"
            />
          </div>

          <section className="adm-sub">
            <div className="adm-sub-head">
              <h3>Kategoriler</h3>
              <span> Birden fazla seçebilirsiniz</span>
            </div>
            <div className="adm-chips">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`adm-chip ${form.categories.includes(category) ? 'on' : ''}`}
                  onClick={() => toggleCategory(category)}
                >
                  {form.categories.includes(category) && <Check size={14} />}
                  {category}
                </button>
              ))}
            </div>
          </section>

          <section className="adm-sub">
            <div className="adm-sub-head">
              <h3>Ürün fotoğrafları</h3>
              <span>İlk görsel ana sayfada kullanılır</span>
            </div>

            <div className="adm-gallery">
              {form.images.length === 0 && (
                <p className="adm-empty">Henüz görsel yok. Aşağıdan ekleyin.</p>
              )}
              {form.images.map((image, index) => (
                <figure className={`adm-thumb ${index === 0 ? 'main' : ''}`} key={`${image}-${index}`}>
                  <img src={image.startsWith('asset:') ? ASSETS[image.slice(6)] : image} alt="" />
                  {index === 0 && (
                    <figcaption>
                      <Star size={12} /> Ana görsel
                    </figcaption>
                  )}
                  <div className="adm-thumb-actions">
                    {index !== 0 && (
                      <button type="button" onClick={() => moveImage(index, -1)} aria-label="Öne al">
                        <ChevronUp size={15} />
                      </button>
                    )}
                    {index !== form.images.length - 1 && (
                      <button type="button" onClick={() => moveImage(index, 1)} aria-label="Arkaya al">
                        <ChevronDown size={15} />
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(index)} aria-label="Görseli sil">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </figure>
              ))}
            </div>

            <div className="adm-upload-row">
              <button type="button" className="adm-btn" onClick={() => fileRef.current && fileRef.current.click()}>
                <Upload size={16} /> {busy ? 'Yükleniyor…' : 'Dosyadan yükle'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(event) => event.target.files && handleFiles(event.target.files)}
              />
              <div className="adm-url-add">
                <input
                  value={urlDraft}
                  placeholder="Görsel adresi (https://…)"
                  onChange={(event) => setUrlDraft(event.target.value)}
                />
                <button
                  type="button"
                  className="adm-btn"
                  onClick={() => {
                    addImage(urlDraft);
                    setUrlDraft('');
                  }}
                >
                  <Plus size={16} /> Ekle
                </button>
              </div>
            </div>

            <p className="adm-hint">
              <ImageIcon size={13} /> Hazır görsellerden seçmek için bir görsele dokunun.
            </p>
            <div className="adm-assets">
              {Object.keys(ASSETS).map((key) => (
                <button
                  type="button"
                  key={key}
                  title={ASSET_LABELS[key] || key}
                  onClick={() => addImage(`asset:${key}`)}
                >
                  <img src={ASSETS[key]} alt={ASSET_LABELS[key] || key} />
                </button>
              ))}
            </div>
          </section>

          <section className="adm-sub adm-sub-row">
            <div>
              <h3>Yayın durumu</h3>
              <p className="adm-hint">Pasif ürünler sitede görünmez.</p>
            </div>
            <Toggle
              checked={form.active}
              onChange={(value) => set('active', value)}
              on="Aktif"
              off="Pasif"
            />
          </section>
        </div>

        <footer className="adm-modal-foot">
          {!product.isNew && (
            <button
              className="adm-btn danger"
              onClick={() => {
                if (window.confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)) {
                  onDelete(product.id);
                }
              }}
            >
              <Trash2 size={16} /> Sil
            </button>
          )}
          <div className="adm-modal-foot-right">
            <button className="adm-btn" onClick={onClose}>
              Vazgeç
            </button>
            <button className="adm-btn primary" disabled={!valid} onClick={() => onSave(form)}>
              <Check size={16} /> Kaydet
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ProductsPage({ store, notify }) {
  const { state, update } = store;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const dragId = useRef(null);

  const filtered = useMemo(() => {
    const needle = query.toLocaleLowerCase('tr-TR');
    return state.products.filter((product) => {
      const matchesQuery = `${product.name} ${product.categories.join(' ')}`
        .toLocaleLowerCase('tr-TR')
        .includes(needle);
      const matchesStatus =
        filter === 'all' || (filter === 'active' ? product.active : !product.active);
      return matchesQuery && matchesStatus;
    });
  }, [state.products, query, filter]);

  const replaceProducts = (updater) =>
    update((current) => ({ ...current, products: updater(current.products) }));

  const move = (fromId, toId) => {
    if (fromId === toId) return;
    replaceProducts((list) => {
      const next = [...list];
      const from = next.findIndex((item) => item.id === fromId);
      const to = next.findIndex((item) => item.id === toId);
      if (from < 0 || to < 0) return next;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const nudge = (id, delta) => {
    replaceProducts((list) => {
      const next = [...list];
      const index = next.findIndex((item) => item.id === id);
      const target = index + delta;
      if (index < 0 || target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const createProduct = () => {
    const nextId = state.products.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    setEditing({
      isNew: true,
      id: nextId,
      name: '',
      categories: state.categories[0] ? [state.categories[0]] : [],
      price: '',
      oldPrice: 0,
      badge: '',
      description: '',
      images: [],
      active: true,
    });
  };

  const saveProduct = (form) => {
    const clean = {
      id: form.id,
      name: form.name.trim(),
      categories: form.categories,
      price: Number(form.price) || 0,
      oldPrice: Number(form.oldPrice) || 0,
      badge: form.badge.trim(),
      description: form.description,
      images: form.images,
      active: form.active,
    };
    replaceProducts((list) => {
      const exists = list.some((item) => item.id === clean.id);
      return exists ? list.map((item) => (item.id === clean.id ? clean : item)) : [...list, clean];
    });
    setEditing(null);
    notify(form.isNew ? 'Ürün eklendi.' : 'Ürün güncellendi.');
  };

  const deleteProduct = (id) => {
    replaceProducts((list) => list.filter((item) => item.id !== id));
    setEditing(null);
    notify('Ürün silindi.');
  };

  return (
    <div className="adm-stack">
      <Card
        title="Ürünler"
        hint="Sürükleyerek ya da ok düğmeleriyle sırayı değiştirin. Sıra, sitedeki görünürlüğü belirler."
        actions={
          <button className="adm-btn primary" onClick={createProduct}>
            <Plus size={16} /> Yeni ürün
          </button>
        }
      >
        <div className="adm-toolbar">
          <label className="adm-search">
            <Search size={16} />
            <input
              value={query}
              placeholder="Ürün ara"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="adm-segments">
            {[
              ['all', 'Tümü'],
              ['active', 'Aktif'],
              ['passive', 'Pasif'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={filter === value ? 'on' : ''}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-product-list">
          <div className="adm-product-head">
            <span>Sıra</span>
            <span>Ürün</span>
            <span>Fiyat</span>
            <span>Durum</span>
            <span>İşlem</span>
          </div>
          {filtered.length === 0 && <p className="adm-empty">Eşleşen ürün bulunamadı.</p>}
          {filtered.map((product) => (
            <div
              className="adm-product-row"
              key={product.id}
              draggable
              onDragStart={(event) => {
                dragId.current = product.id;
                event.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (dragId.current) move(dragId.current, product.id);
                dragId.current = null;
              }}
            >
              <span className="adm-drag" title="Sürükleyip sıralayın">
                <GripVertical size={16} />
              </span>
              <div className="adm-product-info">
                <img src={primaryImage(product)} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.categories.join(' · ') || 'Kategori yok'}</span>
                </div>
              </div>
              <div className="adm-product-price">
                <strong>{formatPrice(product.price)}</strong>
                {product.oldPrice > 0 && <del>{formatPrice(product.oldPrice)}</del>}
              </div>
              <Toggle
                checked={product.active}
                onChange={(value) => {
                  replaceProducts((list) =>
                    list.map((item) => (item.id === product.id ? { ...item, active: value } : item)),
                  );
                  notify(value ? 'Ürün aktif edildi.' : 'Ürün pasife alındı.');
                }}
              />
              <div className="adm-row-actions">
                <button
                  className="adm-icon-btn"
                  onClick={() => nudge(product.id, -1)}
                  aria-label="Yukarı taşı"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  className="adm-icon-btn"
                  onClick={() => nudge(product.id, 1)}
                  aria-label="Aşağı taşı"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  className="adm-icon-btn"
                  onClick={() => setEditing(product)}
                  aria-label="Düzenle"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="adm-icon-btn"
                  aria-label={product.active ? 'Gizle' : 'Göster'}
                  onClick={() => {
                    replaceProducts((list) =>
                      list.map((item) =>
                        item.id === product.id ? { ...item, active: !item.active } : item,
                      ),
                    );
                  }}
                >
                  {product.active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {editing && (
        <ProductEditor
          product={editing}
          categories={state.categories}
          onClose={() => setEditing(null)}
          onSave={saveProduct}
          onDelete={deleteProduct}
        />
      )}
    </div>
  );
}

function CategoriesPage({ store, notify }) {
  const { state, update } = store;
  const [draft, setDraft] = useState('');

  const replace = (categories) => update((current) => ({ ...current, categories }));

  const move = (index, delta) => {
    const list = [...state.categories];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    replace(list);
  };

  const rename = (index, value) => {
    const previous = state.categories[index];
    const list = [...state.categories];
    list[index] = value;
    replace(list);
    if (previous !== value) {
      update((current) => ({
        ...current,
        products: current.products.map((product) => ({
          ...product,
          categories: product.categories.map((item) => (item === previous ? value : item)),
        })),
      }));
    }
  };

  const remove = (index) => {
    const name = state.categories[index];
    if (
      !window.confirm(
        `"${name}" kategorisini silmek istediğinize emin misiniz? Ürünlerden de kaldırılacak.`,
      )
    ) {
      return;
    }
    replace(state.categories.filter((_, i) => i !== index));
    update((current) => ({
      ...current,
      products: current.products.map((product) => ({
        ...product,
        categories: product.categories.filter((item) => item !== name),
      })),
    }));
    notify('Kategori silindi.');
  };

  const add = (event) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    if (state.categories.includes(value)) {
      notify('Bu kategori zaten var.');
      return;
    }
    replace([...state.categories, value]);
    setDraft('');
    notify('Kategori eklendi.');
  };

  return (
    <div className="adm-stack">
      <Card
        title="Kategoriler"
        hint="Soldaki menüde, üst menüde ve filtre çiplerinde görünen kategori listesidir."
      >
        <form className="adm-inline-add" onSubmit={add}>
          <input
            value={draft}
            placeholder="Yeni kategori adı"
            onChange={(event) => setDraft(event.target.value)}
          />
          <button className="adm-btn primary" type="submit">
            <Plus size={16} /> Ekle
          </button>
        </form>

        <div className="adm-cat-list">
          {state.categories.map((category, index) => (
            <div className="adm-cat-row" key={`${category}-${index}`}>
              <span className="adm-index">{index + 1}</span>
              <input
                value={category}
                aria-label={`Kategori ${index + 1}`}
                onChange={(event) => rename(index, event.target.value)}
              />
              <div className="adm-row-actions">
                <button
                  className="adm-icon-btn"
                  onClick={() => move(index, -1)}
                  aria-label="Yukarı taşı"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  className="adm-icon-btn"
                  onClick={() => move(index, 1)}
                  aria-label="Aşağı taşı"
                >
                  <ChevronDown size={16} />
                </button>
                <button className="adm-icon-btn" onClick={() => remove(index)} aria-label="Sil">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SiteTextsPage({ store, notify }) {
  const { state, update } = store;
  const site = state.site;
  const set = (key, value) => update((current) => ({ ...current, site: { ...current.site, [key]: value } }));

  const setCard = (index, key, value) =>
    set(
      'heroCards',
      site.heroCards.map((card, i) => (i === index ? { ...card, [key]: value } : card)),
    );

  const setLink = (index, key, value) =>
    set(
      'footerLinks',
      site.footerLinks.map((link, i) => (i === index ? { ...link, [key]: value } : link)),
    );

  const setBranch = (index, key, value) =>
    set(
      'branches',
      site.branches.map((branch, i) => (i === index ? { ...branch, [key]: value } : branch)),
    );

  return (
    <div className="adm-stack">
      <Card title="Hero bölümü" hint="Ana sayfanın en üstündeki başlık ve öne çıkan kartlar.">
        <div className="adm-form-grid">
          <TextField label="Başlık" value={site.heroTitle} onChange={(value) => set('heroTitle', value)} />
          <TextField
            label="Alt başlık"
            value={site.heroSubtitle}
            onChange={(value) => set('heroSubtitle', value)}
          />
        </div>
        <div className="adm-repeat">
          {site.heroCards.map((card, index) => (
            <div className="adm-repeat-row" key={index}>
              <TextField
                label={`Kart ${index + 1} metni`}
                value={card.label}
                onChange={(value) => setCard(index, 'label', value)}
              />
              <label className="adm-field">
                <span className="adm-label">Görsel</span>
                <select
                  value={card.image.startsWith('asset:') ? card.image.slice(6) : ''}
                  onChange={(event) => setCard(index, 'image', `asset:${event.target.value}`)}
                >
                  <option value="">Özel adres</option>
                  {Object.keys(ASSETS).map((key) => (
                    <option key={key} value={key}>
                      {ASSET_LABELS[key] || key}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                label="Filtre"
                value={card.target}
                hint="Tıklanınca açılacak kategori"
                onChange={(value) => setCard(index, 'target', value)}
              />
            </div>
          ))}
        </div>
        <TextField label="Kaydırma şeridi metni" value={site.marquee} onChange={(value) => set('marquee', value)} />
      </Card>

      <Card title="Ürün bölümü" hint="Ürünlerin üstünde yer alan başlık.">
        <TextField label="Bölüm başlığı" value={site.sectionTitle} onChange={(value) => set('sectionTitle', value)} />
      </Card>

      <Card title="Hakkımızda bölümü">
        <div className="adm-form-grid">
          <TextField
            label="Üst etiket"
            value={site.aboutKicker}
            onChange={(value) => set('aboutKicker', value)}
          />
          <TextField label="Başlık" value={site.aboutTitle} onChange={(value) => set('aboutTitle', value)} />
        </div>
        <TextField label="Açıklama" rows={4} value={site.aboutText} onChange={(value) => set('aboutText', value)} />
        <div className="adm-form-row">
          {site.aboutFeatures.map((feature, index) => (
            <TextField
              key={index}
              label={`Özellik ${index + 1}`}
              value={feature}
              onChange={(value) =>
                set(
                  'aboutFeatures',
                  site.aboutFeatures.map((item, i) => (i === index ? value : item)),
                )
              }
            />
          ))}
        </div>
      </Card>

      <Card title="Alt bilgi" hint="Footer metinleri, bağlantılar ve ilçe WhatsApp bağlantıları.">
        <TextField
          label="Alt bilgi metni"
          rows={2}
          value={site.footerTagline}
          onChange={(value) => set('footerTagline', value)}
        />
        <div className="adm-repeat">
          {site.footerLinks.map((link, index) => (
            <div className="adm-repeat-row" key={index}>
              <TextField
                label="Bağlantı adı"
                value={link.label}
                onChange={(value) => setLink(index, 'label', value)}
              />
              <TextField
                label="Adres"
                value={link.href}
                hint="# ile başlayan iç bağlantı"
                onChange={(value) => setLink(index, 'href', value)}
              />
              <button
                className="adm-btn danger ghost"
                onClick={() =>
                  set(
                    'footerLinks',
                    site.footerLinks.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 size={16} /> Kaldır
              </button>
            </div>
          ))}
        </div>
        <button
          className="adm-btn"
          onClick={() => set('footerLinks', [...site.footerLinks, { label: 'Yeni bağlantı', href: '#products' }])}
        >
          <Plus size={16} /> Bağlantı ekle
        </button>

        <div className="adm-repeat">
          {site.branches.map((branch, index) => (
            <div className="adm-repeat-row" key={index}>
              <TextField
                label="İlçe adı"
                value={branch.name}
                onChange={(value) => setBranch(index, 'name', value)}
              />
              <TextField
                label="WhatsApp mesajı"
                rows={2}
                value={branch.text}
                onChange={(value) => setBranch(index, 'text', value)}
              />
              <button
                className="adm-btn danger ghost"
                onClick={() =>
                  set(
                    'branches',
                    site.branches.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 size={16} /> Kaldır
              </button>
            </div>
          ))}
        </div>
        <button
          className="adm-btn"
          onClick={() => set('branches', [...site.branches, { name: 'Yeni İlçe', text: 'Merhaba, teslimat hakkında bilgi almak istiyorum.' }])}
        >
          <Plus size={16} /> İlçe ekle
        </button>
      </Card>

      <Card title="İletişim ve menü">
        <div className="adm-form-row">
          <TextField label="Telefon" value={site.phone} onChange={(value) => set('phone', value)} />
          <TextField
            label="Menü alt etiketi"
            value={site.menuBranchLine}
            onChange={(value) => set('menuBranchLine', value)}
          />
        </div>
        <div className="adm-form-row">
          <TextField
            label="Menü etiketi"
            value={site.menuTagline}
            onChange={(value) => set('menuTagline', value)}
          />
          <TextField
            label="Menü WhatsApp düğmesi"
            value={site.menuWhatsappLabel}
            onChange={(value) => set('menuWhatsappLabel', value)}
          />
        </div>
      </Card>

      <Card title="Sipariş takibi paneli">
        <TextField
          label="Açıklama metni"
          rows={2}
          value={site.trackHint}
          onChange={(value) => set('trackHint', value)}
        />
        <div className="adm-form-row">
          <TextField
            label="Alt not"
            value={site.trackMeta}
            onChange={(value) => set('trackMeta', value)}
          />
          <TextField
            label="Örnek numara"
            value={site.trackPlaceholder}
            onChange={(value) => set('trackPlaceholder', value)}
          />
          <TextField
            label="Düğme metni"
            value={site.trackButton}
            onChange={(value) => set('trackButton', value)}
          />
        </div>
      </Card>

      <div className="adm-savebar">
        <Check size={16} /> Değişiklikler anında kaydediliyor.
        <button className="adm-btn" onClick={() => notify('Kaydedildi.')}>
          Durumu kontrol et
        </button>
      </div>
    </div>
  );
}

function WhatsAppPage({ store }) {
  const { state, update } = store;
  const wa = state.whatsapp;
  const set = (key, value) =>
    update((current) => ({ ...current, whatsapp: { ...current.whatsapp, [key]: value } }));

  return (
    <div className="adm-stack">
      <Card
        title="WhatsApp şablonları"
        hint="Bu metinler hazır bağlantılar olarak WhatsApp açılırken kullanılır. Yeni satır kullanabilirsiniz."
      >
        <div className="adm-form-grid">
          <TextField
            label="Genel sipariş mesajı"
            rows={3}
            value={wa.order}
            hint="Yüzen buton ve menüdeki sipariş düğmesi"
            onChange={(value) => set('order', value)}
          />
          <TextField
            label="Üyelik ve hesap mesajı"
            rows={3}
            value={wa.account}
            hint="Üst menüdeki üyelik simgesi"
            onChange={(value) => set('account', value)}
          />
          <TextField
            label="Sipariş takibi mesajı"
            rows={3}
            value={wa.tracking}
            hint="{SIPARIS_NO} yer tutucusu sipariş numarasıyla değiştirilir."
            onChange={(value) => set('tracking', value)}
          />
          <TextField
            label="Sepet mesajı girişi"
            rows={3}
            value={wa.cartIntro}
            hint="Sepetteki ürünlerin üstünde yer alır."
            onChange={(value) => set('cartIntro', value)}
          />
          <TextField
            label="Ödeme şekli satırı"
            value={wa.paymentPrefix}
            hint="Ödeme adımındaki seçim bu etiketle eklenir."
            onChange={(value) => set('paymentPrefix', value)}
          />
          <TextField
            label="Yüzen buton etiketi"
            value={wa.fabLabel}
            hint="Ekran okuyucular için görünür metin."
            onChange={(value) => set('fabLabel', value)}
          />
        </div>
      </Card>

      <Card title="Ön izleme" hint="Yüzen butonun açacağı mesaj.">
        <div className="adm-wa-preview">{wa.order}</div>
        <div className="adm-wa-preview">
          {wa.tracking.replace('{SIPARIS_NO}', 'CS-1024')}
        </div>
        <p className="adm-hint">
          İlçe mesajları “Ana Sayfa Metinleri → Alt bilgi” bölümünden düzenlenir.
        </p>
      </Card>
    </div>
  );
}

function PaymentsPage({ store }) {
  const { state, update } = store;
  const payments = state.payments;

  const setField = (index, key, value) =>
    update((current) => ({
      ...current,
      payments: current.payments.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));

  return (
    <div className="adm-stack">
      <Card title="Ödeme yöntemleri" hint="Ödeme adımlarında görünen seçenekler ve bilgilendirme notları.">
        <div className="adm-pay-list">
          {payments.map((method, index) => (
            <section className="adm-pay-card" key={method.id}>
              <header>
                <strong>{method.label}</strong>
                <em>{method.id}</em>
              </header>
              <div className="adm-form-row">
                <TextField
                  label="Seçenek adı"
                  value={method.label}
                  onChange={(value) => setField(index, 'label', value)}
                />
                <TextField
                  label="Rozet"
                  value={method.tag}
                  hint="Boş bırakılırsa rozet gösterilmez."
                  onChange={(value) => setField(index, 'tag', value)}
                />
              </div>
              <TextField
                label="Bilgilendirme notu"
                rows={2}
                value={method.note}
                onChange={(value) => setField(index, 'note', value)}
              />
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SettingsPage({ store, notify }) {
  const { state, commit, reset } = store;
  const fileRef = useRef(null);
  const [usage, setUsage] = useState(() => storageUsage());

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chocosite-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify('Yedek indirildi.');
  };

  const importJson = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!window.confirm('Mevcut tüm içerik bu yedekle değiştirilecek. Devam edilsin mi?')) return;
      commit(parsed);
      setUsage(storageUsage());
      notify('Yedek yüklendi.');
    } catch (error) {
      window.alert('Dosya okunamadı veya geçerli bir JSON değil.');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="adm-stack">
      <Card title="Yedekleme" hint="İçeriği JSON dosyası olarak dışa aktarın veya geri yükleyin.">
        <div className="adm-quick">
          <button className="adm-btn" onClick={exportJson}>
            <Download size={16} /> Yedeği indir
          </button>
          <button className="adm-btn" onClick={() => fileRef.current && fileRef.current.click()}>
            <Upload size={16} /> Yedek yükle
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(event) => importJson(event.target.files && event.target.files[0])}
          />
        </div>
        <p className="adm-hint">
          Depolama kullanımı: <strong>{usage} KB</strong> · Tarayıcı yerel verisinde tutulur.
        </p>
      </Card>

      <Card title="Varsayılana dön" hint="Tüm ürünler, kategoriler ve metinler fabrika ayarlarına döner.">
        <button
          className="adm-btn danger"
          onClick={() => {
            if (window.confirm('Tüm değişiklikler silinecek ve varsayılan içerik yüklenecek. Emin misiniz?')) {
              reset();
              setUsage(storageUsage());
              notify('Varsayılan içerik yüklendi.');
            }
          }}
        >
          <RotateCcw size={16} /> İçeriği sıfırla
        </button>
      </Card>

      <Card title="Giriş bilgileri">
        <p className="adm-hint">
          Kullanıcı adı <strong>admin</strong> · Şifre <strong>123456</strong>. Bu bilgileri
          değiştirmek için projedeki <code>src/admin/AdminApp.jsx</code> dosyasındaki
          <code> CREDENTIALS </code> sabitini düzenleyin.
        </p>
      </Card>
    </div>
  );
}

export default function AdminApp() {
  const store = useStore();
  const [authed, setAuthed] = useState(() => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (error) {
      return false;
    }
  });
  const [page, setPage] = useState('dashboard');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const statusLabel =
    store.status === 'saving' ? 'Kaydediliyor…' : store.status === 'error' ? 'Kaydedilemedi' : 'Kaydedildi';

  const logout = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch (error) {
      /* yoksay */
    }
    setAuthed(false);
    setPage('dashboard');
  };

  const pages = {
    dashboard: <DashboardPage go={setPage} store={store} />,
    products: <ProductsPage store={store} notify={notify} />,
    categories: <CategoriesPage store={store} notify={notify} />,
    site: <SiteTextsPage store={store} notify={notify} />,
    whatsapp: <WhatsAppPage store={store} />,
    payments: <PaymentsPage store={store} />,
    settings: <SettingsPage store={store} notify={notify} />,
  };

  return (
    <div className="adm-shell">
      <aside className="adm-aside">
        <div className="adm-brand">
          <span className="adm-mark">C</span>
          <div>
            <strong>ChocoSite</strong>
            <span>Yönetim paneli</span>
          </div>
        </div>

        <nav className="adm-nav" aria-label="Yönetim menüsü">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={page === item.id ? 'on' : ''}
                onClick={() => setPage(item.id)}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="adm-aside-foot">
          <a className="adm-btn" href={SITE_URL} target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Siteyi görüntüle
          </a>
          <button className="adm-btn ghost" onClick={logout}>
            <LogOut size={16} /> Çıkış yap
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <div>
            <h1>{PAGE_TITLES[page]}</h1>
            <span className={`adm-status ${store.status}`}>
              <Check size={13} /> {statusLabel}
            </span>
          </div>
          <div className="adm-topbar-actions">
            <span className="adm-user">admin</span>
            <button
              className="adm-icon-btn"
              onClick={() => setPage('settings')}
              aria-label="Ayarlar"
            >
              <Settings size={17} />
            </button>
          </div>
        </header>

        <main className="adm-content">{pages[page]}</main>
      </div>

      {toast && (
        <div className="adm-toast" role="status">
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

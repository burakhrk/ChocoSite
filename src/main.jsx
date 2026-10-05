import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Truck,
  User,
  X,
  Minus,
  Plus,
  MapPin,
  Gift,
  Sparkles,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import './styles.css';
import { ASSETS, StoreProvider, formatPrice, primaryImage, useStore } from './store.jsx';
import AdminApp from './admin/AdminApp.jsx';

const WHATSAPP_NUMBER = '905414015262';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const waLink = (text) => `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;

const trackingText = (orderNo, template) =>
  String(template || '{SIPARIS_NO}').replace('{SIPARIS_NO}', orderNo);

const deliveryEntries = (delivery) =>
  [
    ['Teslimat yeri', delivery.place],
    ['Teslimat saati', delivery.time],
    ['Ad Soyad', delivery.name],
    ['Telefon', delivery.phone],
    ['Adres', delivery.address],
    ['Not', delivery.note],
  ].filter(([, value]) => value && value.trim());

const deliveryLines = (delivery) =>
  deliveryEntries(delivery).map(([key, value]) => `${key}: ${value.trim()}`);

const cartOrderText = (cart, total, delivery, intro) => {
  const lines = cart.map(
    (item) => `- ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`,
  );
  const details = deliveryLines(delivery)
    .filter((line) => line.startsWith('Teslimat'))
    .join('\n');
  const tail = details ? `\n\n${details}` : '';
  return `${intro}\n${lines.join('\n')}\n\nAra toplam: ${formatPrice(total)}${tail}`;
};

const checkoutOrderText = (cart, total, delivery, paymentLabel, intro, paymentPrefix) => {
  const lines = cart.map(
    (item) => `- ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`,
  );
  const details = deliveryLines(delivery);
  const blocks = [
    `${intro}\n${lines.join('\n')}\n\nAra toplam: ${formatPrice(total)}`,
    details.join('\n'),
    `${paymentPrefix} ${paymentLabel}`,
  ];
  return blocks.filter(Boolean).join('\n\n');
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Tüm Ürünler');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [delivery, setDelivery] = useState({
    place: '',
    time: '',
    name: '',
    phone: '',
    address: '',
    note: '',
  });

  const setDeliveryField = (field, value) =>
    setDelivery((current) => ({ ...current, [field]: value }));

  const { state } = useStore();
  const site = state.site;
  const whatsapp = state.whatsapp;
  const payments = state.payments;
  const categories = state.categories;

  const products = useMemo(
    () =>
      state.products
        .filter((product) => product.active)
        .map((product) => ({ ...product, image: primaryImage(product) })),
    [state.products],
  );

  const productCategories = [
    'Tüm Ürünler',
    ...new Set(products.map((product) => product.categories[0] || '').filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'Tüm Ürünler' ||
        product.categories.includes(activeCategory) ||
        product.name.includes(activeCategory);
      const matchesQuery = `${product.name} ${product.categories.join(' ')}`.toLocaleLowerCase(
        'tr-TR',
      ).includes(query.toLocaleLowerCase('tr-TR'));
      const matchesFavorites = !favoritesOnly || favoriteIds.includes(product.id);
      return matchesCategory && matchesQuery && matchesFavorites;
    });
  }, [products, activeCategory, query, favoritesOnly, favoriteIds]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    setCart((items) =>
      items
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const toggleFavorite = (productId) => {
    setFavoriteIds((ids) =>
      ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
    );
  };

  const toggleFavoritesOnly = () => setFavoritesOnly((value) => !value);

  const clearFilters = () => {
    setFavoritesOnly(false);
    setActiveCategory('Tüm Ürünler');
    setQuery('');
  };

  return (
    <>
      <header className="site-header">
        <div className="header-main">
          <button className="icon-button menu-button" aria-label="Menü" onClick={() => setMenuOpen(true)}>
            <Menu size={23} />
          </button>
          <label className="search-box desktop-search">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ne aramıştınız?"
            />
            <Search size={18} />
          </label>
          <a href="#" className="brand" aria-label="ChocoSite ana sayfa">
            <span className="brand-mark">C</span>
            <span className="brand-text">Choco<br />Site</span>
          </a>
          <nav className="header-actions" aria-label="Hesap işlemleri">
            <button className="icon-button mobile-search" aria-label="Ara" onClick={() => setSearchOpen(true)}>
              <Search size={21} />
            </button>
            <button
              className="icon-button desktop-only"
              aria-label="Sipariş takibi"
              title="Sipariş takibi"
              onClick={() => setTrackingOpen(true)}
            >
              <Truck size={20} />
            </button>
            <button
              className={`icon-button desktop-only ${favoritesOnly ? 'active' : ''}`}
              aria-label="Favorilerim"
              aria-pressed={favoritesOnly}
              title="Favorilerim"
              onClick={toggleFavoritesOnly}
            >
              <Heart size={21} />
            </button>
            <button
              className="icon-button desktop-only"
              aria-label="Üyelik ve hesap"
              title="Üyelik ve hesap"
              onClick={() => window.open(waLink(whatsapp.account), '_blank', 'noopener,noreferrer')}
            >
              <User size={21} />
            </button>
            <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Sepet">
              <ShoppingBag size={21} />
              <span>{cartCount}</span>
            </button>
          </nav>
        </div>

        <nav className="category-nav desktop-only" aria-label="Kategoriler">
          {categories.slice(0, 10).map((category) => (
            <button key={category} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-stage">
            <div className="hero-copy">
              <h1>{site.heroTitle}</h1>
              <span>{site.heroSubtitle}</span>
            </div>
            <img
              className="hero-illustration"
              src={ASSETS['hero-chocolate']}
              alt="ChocoSite hediye çikolata kutuları"
            />
            <div className="hero-categories" aria-label="Öne çıkan kategoriler">
              {site.heroCards.map((card) => (
                <button key={card.label} onClick={() => setActiveCategory(card.target)}>
                  <img
                    src={card.image.startsWith('asset:') ? ASSETS[card.image.slice(6)] : card.image}
                    alt={card.label}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="marquee" aria-label="Marka mesajı">
          <div>{site.marquee}</div>
          <strong>ChocoSite</strong>
        </section>

        <section className="mobile-category-row mobile-only" aria-label="Mobil kategoriler">
          {categories.slice(0, 8).map((category) => (
            <button key={category} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </section>

        <section className="product-section" id="products">
          <div className="section-heading">
            <div className="section-ribbon">
              <h2>{site.sectionTitle}</h2>
            </div>
            <div className="filter-pills">
              {productCategories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-products">
              <Heart size={34} />
              <p>
                {favoritesOnly && favoriteIds.length === 0
                  ? 'Henüz favori ürününüz yok. Kalp simgesine dokunarak ürün ekleyin.'
                  : 'Bu filtreyle eşleşen ürün bulunamadı.'}
              </p>
              <button onClick={clearFilters}>
                {favoritesOnly && favoriteIds.length === 0 ? 'Tüm ürünleri göster' : 'Filtreleri temizle'}
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-media">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    {product.badge && <span className="badge">{product.badge}</span>}
                    <button
                      className={`favorite-button ${favoriteIds.includes(product.id) ? 'active' : ''}`}
                      aria-label={`${product.name} favorilere ${favoriteIds.includes(product.id) ? 'çıkar' : 'ekle'}`}
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="product-body">
                    <span>{product.categories[0] || ''}</span>
                    <h3>{product.name}</h3>
                    {product.description && <p className="product-desc">{product.description}</p>}
                    <div className="price-row">
                      {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
                      <strong>{formatPrice(product.price)}</strong>
                    </div>
                    <button className="quick-add" onClick={() => addToCart(product)} aria-label={`${product.name} sepete ekle`}>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="content-band" id="about">
          <div className="editorial-image">
            <img
              src={ASSETS.cake}
              alt="Çikolatalı pasta hazırlığı"
              loading="lazy"
            />
          </div>
          <div className="editorial-copy">
            <p>{site.aboutKicker}</p>
            <h2>{site.aboutTitle}</h2>
            <span>{site.aboutText}</span>
            <div className="feature-list">
              {site.aboutFeatures.map((feature, index) => {
                const FeatureIcon = [Gift, Sparkles, Truck][index] || Sparkles;
                return (
                  <span key={index}>
                    <FeatureIcon size={18} /> {feature}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div>
          <strong>ChocoSite</strong>
          <span>{site.footerTagline}</span>
        </div>
        <div className="footer-links">
          {site.footerLinks.map((link, index) => (
            <a key={index} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="branch-actions">
          {site.branches.map((branch, index) => (
            <a key={index} href={waLink(branch.text)} target="_blank" rel="noreferrer">
              <MessageCircle size={17} /> {branch.name}
            </a>
          ))}
        </div>
        <a className="footer-admin" href="#/admin">
          Yönetim paneli
        </a>
      </footer>

      <SideMenu
        open={menuOpen}
        close={() => setMenuOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        favoritesOnly={favoritesOnly}
        toggleFavoritesOnly={toggleFavoritesOnly}
        favoriteCount={favoriteIds.length}
        openTracking={() => setTrackingOpen(true)}
      />
      <CartDrawer
        open={cartOpen}
        close={() => setCartOpen(false)}
        cart={cart}
        total={cartTotal}
        updateQuantity={updateQuantity}
        delivery={delivery}
        setDeliveryField={setDeliveryField}
        openCheckout={() => setCheckoutOpen(true)}
      />
      <TrackingPanel open={trackingOpen} close={() => setTrackingOpen(false)} />
      <CheckoutPanel
        open={checkoutOpen}
        close={() => setCheckoutOpen(false)}
        cart={cart}
        total={cartTotal}
        delivery={delivery}
        setDeliveryField={setDeliveryField}
      />
      <SearchOverlay
        open={searchOpen}
        close={() => setSearchOpen(false)}
        query={query}
        setQuery={setQuery}
        products={filteredProducts}
        addToCart={addToCart}
      />

      <a
        className="whatsapp-fab"
        href={waLink(whatsapp.order)}
        target="_blank"
        rel="noreferrer"
        aria-label={whatsapp.fabLabel}
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}

function SideMenu({
  open,
  close,
  categories,
  activeCategory,
  setActiveCategory,
  favoritesOnly,
  toggleFavoritesOnly,
  favoriteCount,
  openTracking,
}) {
  const { state } = useStore();
  const site = state.site;
  const whatsapp = state.whatsapp;

  return (
    <div className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="scrim" onClick={close} aria-label="Menüyü kapat" />
      <aside className="side-panel left">
        <div className="panel-header">
          <strong>Menü</strong>
          <button className="icon-button" onClick={close} aria-label="Menüyü kapat">
            <X size={21} />
          </button>
        </div>

        <div className="menu-brand">
          <span className="brand-mark">C</span>
          <div>
            <strong>ChocoSite</strong>
            <span>{site.menuTagline}</span>
          </div>
        </div>

        <div className="menu-actions">
          <button
            className={`menu-row ${favoritesOnly ? 'active' : ''}`}
            aria-pressed={favoritesOnly}
            onClick={() => {
              toggleFavoritesOnly();
              close();
            }}
          >
            <Heart size={18} /> Favorilerim
            <span className="menu-count">{favoriteCount}</span>
          </button>
          <button
            className="menu-row"
            onClick={() => {
              close();
              openTracking();
            }}
          >
            <Truck size={18} /> Sipariş Takibi
          </button>
          <a className="menu-row" href={waLink(whatsapp.account)} target="_blank" rel="noreferrer" onClick={close}>
            <User size={18} /> Üyelik &amp; Hesap
          </a>
          <a className="menu-row" href="#about" onClick={close}>
            <Gift size={18} /> Hakkımızda
          </a>
          <a className="menu-row" href="#contact" onClick={close}>
            <MessageCircle size={18} /> İletişim
          </a>
        </div>

        <div className="menu-categories">
          <span>Kategoriler</span>
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? 'current' : ''}
              onClick={() => {
                setActiveCategory(category);
                close();
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-foot">
          <a className="menu-whatsapp" href={waLink(whatsapp.order)} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> {site.menuWhatsappLabel}
          </a>
          <span>{site.phone} · {site.menuBranchLine}</span>
        </div>
      </aside>
    </div>
  );
}

function TrackingPanel({ open, close }) {
  const [orderNo, setOrderNo] = useState('');
  const inputRef = useRef(null);
  const { state } = useStore();
  const site = state.site;
  const whatsapp = state.whatsapp;

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const submit = (event) => {
    event.preventDefault();
    const value = orderNo.trim();
    if (!value) return;
    window.open(waLink(trackingText(value, whatsapp.tracking)), '_blank', 'noopener,noreferrer');
    setOrderNo('');
    close();
  };

  return (
    <div className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="scrim" onClick={close} aria-label="Kapat" />
      <aside className="side-panel right" role="dialog" aria-modal="true" aria-labelledby="tracking-title">
        <div className="panel-header">
          <strong id="tracking-title">Siparişim Nerede?</strong>
          <button className="icon-button" onClick={close} aria-label="Kapat">
            <X size={21} />
          </button>
        </div>
        <p className="track-hint">
          {site.trackHint}
        </p>
        <form className="track-form" onSubmit={submit}>
          <label htmlFor="order-no">Sipariş numaranız</label>
          <input
            id="order-no"
            ref={inputRef}
            value={orderNo}
            onChange={(event) => setOrderNo(event.target.value)}
            placeholder={site.trackPlaceholder}
            autoComplete="off"
          />
          <button type="submit" disabled={!orderNo.trim()}>
            {site.trackButton}
          </button>
        </form>
        <div className="track-meta">
          <MapPin size={16} /> {site.trackMeta}
        </div>
      </aside>
    </div>
  );
}

function CartDrawer({ open, close, cart, total, updateQuantity, delivery, setDeliveryField, openCheckout }) {
  const { state } = useStore();
  const whatsapp = state.whatsapp;

  return (
    <div className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="scrim" onClick={close} aria-label="Sepeti kapat" />
      <aside className="side-panel right">
        <div className="panel-header">
          <strong>Sepet</strong>
          <button className="icon-button" onClick={close} aria-label="Sepeti kapat">
            <X size={21} />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={38} />
            <p>Sepetiniz boş.</p>
            <button onClick={close}>Alışverişe devam et</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price)}</span>
                    <div className="quantity-stepper">
                      <button onClick={() => updateQuantity(item.id, -1)} aria-label="Azalt">
                        <Minus size={15} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} aria-label="Artır">
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-form">
              <span className="cart-form-title">Teslimat bilgileri · opsiyonel</span>
              <div className="cart-form-row">
                <label className="field">
                  <span>Yer</span>
                  <input
                    value={delivery.place}
                    onChange={(event) => setDeliveryField('place', event.target.value)}
                    placeholder="İlçe / mahalle"
                    autoComplete="off"
                  />
                </label>
                <label className="field">
                  <span>Saat</span>
                  <input
                    type="time"
                    value={delivery.time}
                    onChange={(event) => setDeliveryField('time', event.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="cart-summary">
              <span>Ara toplam</span>
              <strong>{formatPrice(total)}</strong>
              <div className="cart-cta">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    openCheckout();
                  }}
                >
                  Ödemeye geç
                </button>
                <a href={waLink(cartOrderText(cart, total, delivery, whatsapp.cartIntro))} target="_blank" rel="noreferrer">
                  <WhatsAppIcon /> WhatsApp ile sipariş ver
                </a>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function CheckoutPanel({ open, close, cart, total, delivery, setDeliveryField }) {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState('card');
  const { state } = useStore();
  const payments = state.payments;
  const whatsapp = state.whatsapp;

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  const method = payments.find((item) => item.id === payment) || payments[0];
  const entries = deliveryEntries(delivery);

  return (
    <div className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="scrim" onClick={close} aria-label="Ödemeyi kapat" />
      <aside className="side-panel right checkout-panel" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <div className="panel-header">
          <strong id="checkout-title">Ödeme</strong>
          <button className="icon-button" onClick={close} aria-label="Ödemeyi kapat">
            <X size={21} />
          </button>
        </div>

        <ol className="checkout-steps">
          {['Teslimat', 'Ödeme', 'Onay'].map((label, index) => (
            <li
              key={label}
              className={step === index + 1 ? 'current' : step > index + 1 ? 'done' : ''}
            >
              <span>{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <form
            className="checkout-form"
            onSubmit={(event) => {
              event.preventDefault();
              setStep(2);
            }}
          >
            <label className="field">
              <span>Ad Soyad</span>
              <input
                required
                value={delivery.name}
                onChange={(event) => setDeliveryField('name', event.target.value)}
                placeholder="Adınız Soyadınız"
                autoComplete="name"
              />
            </label>
            <label className="field">
              <span>Telefon</span>
              <input
                required
                type="tel"
                value={delivery.phone}
                onChange={(event) => setDeliveryField('phone', event.target.value)}
                placeholder="05xx xxx xx xx"
                autoComplete="tel"
              />
            </label>
            <label className="field">
              <span>Adres</span>
              <textarea
                rows={3}
                value={delivery.address}
                onChange={(event) => setDeliveryField('address', event.target.value)}
                placeholder="Açık adres veya tarif"
              />
            </label>
            <div className="checkout-row">
              <label className="field">
                <span>Yer</span>
                <input
                  value={delivery.place}
                  onChange={(event) => setDeliveryField('place', event.target.value)}
                  placeholder="İlçe / mahalle"
                  autoComplete="off"
                />
              </label>
              <label className="field">
                <span>Saat</span>
                <input
                  type="time"
                  value={delivery.time}
                  onChange={(event) => setDeliveryField('time', event.target.value)}
                />
              </label>
            </div>
            <label className="field">
              <span>Not</span>
              <input
                value={delivery.note}
                onChange={(event) => setDeliveryField('note', event.target.value)}
                placeholder="Hediye kartı notu (opsiyonel)"
                autoComplete="off"
              />
            </label>
            <p className="field-hint">Yer ve saat opsiyoneldir; boş bırakılırsa mesaja eklenmez.</p>
            <button type="submit" className="checkout-next">
              Ödeme bilgilerine geç
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="checkout-step">
            <div className="pay-options">
              {payments.map((item) => (
                <label key={item.id} className={`pay-option ${payment === item.id ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={item.id}
                    checked={payment === item.id}
                    onChange={() => setPayment(item.id)}
                  />
                  <span className="pay-label">{item.label}</span>
                  {item.tag && <span className="pay-tag">{item.tag}</span>}
                </label>
              ))}
            </div>

            {payment === 'card' && (
              <div className="card-form">
                <label className="field">
                  <span>Kart numarası</span>
                  <input disabled placeholder="0000 0000 0000 0000" inputMode="numeric" />
                </label>
                <div className="checkout-row">
                  <label className="field">
                    <span>Son kullanma</span>
                    <input disabled placeholder="AA/YY" />
                  </label>
                  <label className="field">
                    <span>CVV</span>
                    <input disabled placeholder="123" />
                  </label>
                </div>
                <label className="field">
                  <span>Kart üzerindeki isim</span>
                  <input disabled placeholder="Ad Soyad" />
                </label>
              </div>
            )}

            <p className="pay-notice">{method.note}</p>

            <div className="checkout-nav">
              <button type="button" className="ghost" onClick={() => setStep(1)}>
                Geri
              </button>
              <button type="button" className="checkout-next" onClick={() => setStep(3)}>
                Siparişi gözden geçir
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-step">
            <div className="checkout-review">
              <div className="review-rows">
                {cart.map((item) => (
                  <div key={item.id}>
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
                <div className="review-total">
                  <span>Ara toplam</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>
              <dl className="review-details">
                {entries.length === 0 ? (
                  <div>
                    <dt>Teslimat</dt>
                    <dd>Belirtilmedi</dd>
                  </div>
                ) : (
                  entries.map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value.trim()}</dd>
                    </div>
                  ))
                )}
                <div>
                  <dt>Ödeme</dt>
                  <dd>{method.label}</dd>
                </div>
              </dl>
            </div>

            <p className="pay-notice">{method.note}</p>

            <a
              className="checkout-submit"
              href={waLink(checkoutOrderText(cart, total, delivery, method.label, whatsapp.cartIntro, whatsapp.paymentPrefix))}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Siparişi WhatsApp ile tamamla
            </a>

            <div className="checkout-nav">
              <button type="button" className="ghost" onClick={() => setStep(2)}>
                Geri
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function SearchOverlay({ open, close, query, setQuery, products, addToCart }) {
  return (
    <div className={`search-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="search-panel">
        <div className="panel-header">
          <label className="search-box">
            <Search size={18} />
            <input
              autoFocus={open}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ara"
            />
          </label>
          <button className="icon-button" onClick={close} aria-label="Aramayı kapat">
            <X size={21} />
          </button>
        </div>
        <div className="search-results">
          <h3>Ürünler</h3>
          {products.slice(0, 5).map((product) => (
            <button
              key={product.id}
              onClick={() => {
                addToCart(product);
                close();
              }}
            >
              <img src={product.image} alt="" />
              <span>{product.name}</span>
              <strong>{formatPrice(product.price)}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const SHOP_TITLE = document.title;

const isAdminRoute = () => {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path.endsWith('/admin')) return true;
  return window.location.hash.startsWith('#/admin');
};

function Root() {
  const [admin, setAdmin] = useState(isAdminRoute);

  useEffect(() => {
    const sync = () => setAdmin(isAdminRoute());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  useEffect(() => {
    document.title = admin ? 'ChocoSite Yönetim' : SHOP_TITLE;
    if (admin) window.scrollTo(0, 0);
  }, [admin]);

  return <StoreProvider>{admin ? <AdminApp /> : <App />}</StoreProvider>;
}

createRoot(document.getElementById('root')).render(<Root />);

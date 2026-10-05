import React, { useEffect, useMemo, useState } from 'react';
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
  RotateCcw,
} from 'lucide-react';
import './styles.css';
import chocolateBox from './assets/chocolate-box.svg';
import cake from './assets/cake.svg';
import flowers from './assets/flowers.svg';
import balloons from './assets/balloons.svg';
import teddyGift from './assets/teddy-gift.svg';
import cheesecake from './assets/cheesecake.svg';
import heroChocolate from './assets/hero-chocolate.svg';

const categories = [
  'Sevgiliye Özel',
  'Teşekkürler',
  'İçimden Geldi',
  'Yeni İş, Tebrik',
  'Doğum Günü',
  'Yıl Dönümü',
  'Özür Dilerim',
  'Tebrikler!',
  'Geçmiş Olsun',
  'Çocuğa Hediyeler',
  'Hoş Geldin Bebek',
  'Çiçekler',
  'Uçan Balon',
  'Peluş Oyuncak',
  'Kurumsal',
  'Mesleklere Özel',
];

const products = [
  {
    id: 1,
    name: 'Venedik',
    category: 'Çikolata Kutuları',
    price: 1749,
    oldPrice: 1799,
    badge: '%3 indirim',
    image: chocolateBox,
  },
  {
    id: 2,
    name: 'Venedik Mini',
    category: 'Hediye Çikolata',
    price: 1049,
    oldPrice: 1299,
    badge: '%19 indirim',
    image: chocolateBox,
  },
  {
    id: 3,
    name: 'Your Majesty',
    category: 'Çikolata Kutuları',
    price: 2299,
    image: chocolateBox,
  },
  {
    id: 4,
    name: 'HOLA',
    category: 'Doğum Günü',
    price: 2745,
    image: cake,
  },
  {
    id: 5,
    name: 'JOY Ayıcıklı Kutlama Paketi',
    category: 'Çocuğa Hediyeler',
    price: 5490,
    image: teddyGift,
  },
  {
    id: 6,
    name: 'Öğretmene Hediye - Chambre',
    category: 'Mesleklere Özel',
    price: 1699,
    oldPrice: 1999,
    badge: '%15 indirim',
    image: chocolateBox,
  },
  {
    id: 7,
    name: 'Mini Venedik Brownie',
    category: 'Pasta',
    price: 1049,
    image: cake,
  },
  {
    id: 8,
    name: 'Sirene Tiramisu + Çiçek',
    category: 'Çiçekler',
    price: 2698,
    image: flowers,
  },
  {
    id: 9,
    name: '6 Cakes',
    category: 'Doğum Günü',
    price: 1799,
    image: cake,
  },
  {
    id: 10,
    name: 'Venüs, Kalp Balon',
    category: 'Uçan Balon',
    price: 2399,
    image: balloons,
  },
  {
    id: 11,
    name: 'New York Cheesecake',
    category: 'Pasta',
    price: 1899,
    image: cheesecake,
  },
  {
    id: 12,
    name: 'Love Bombing',
    category: 'Sevgiliye Özel',
    price: 3298,
    oldPrice: 3699,
    badge: '%11 indirim',
    image: chocolateBox,
  },
];

const PALETTES = [
  { id: 'cocoa-butter', label: 'Cocoa Butter', swatch: ['#7a4632', '#e0465c', '#ffc24a'] },
  { id: 'marigold-picnic', label: 'Marigold Picnic', swatch: ['#b8451f', '#ffbe3d', '#c02e5c'] },
  { id: 'jam-jar', label: 'Jam Jar', swatch: ['#a8324f', '#ffd166', '#ffb3c1'] },
  { id: 'caramel-crunch', label: 'Caramel Crunch', swatch: ['#3f2a1e', '#d98324', '#ffd66b'] },
];

const readPalette = () => {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('palette');
    if (fromUrl) return fromUrl;
    return localStorage.getItem('chocosite-palette') || 'cocoa-butter';
  } catch {
    return 'cocoa-butter';
  }
};

const formatPrice = (value) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [activeCategory, setActiveCategory] = useState('Tüm Ürünler');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [palette, setPalette] = useState(readPalette);

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    try {
      localStorage.setItem('chocosite-palette', palette);
    } catch {
      /* storage unavailable */
    }
  }, [palette]);

  const productCategories = ['Tüm Ürünler', ...new Set(products.map((product) => product.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'Tüm Ürünler' || product.category === activeCategory || product.name.includes(activeCategory);
      const matchesQuery = `${product.name} ${product.category}`.toLocaleLowerCase('tr-TR').includes(
        query.toLocaleLowerCase('tr-TR'),
      );
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

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
            <button className="icon-button desktop-only" aria-label="Sipariş takip" onClick={() => setTrackingOpen(true)}>
              <Truck size={20} />
            </button>
            <button className="icon-button desktop-only" aria-label="Favoriler">
              <Heart size={21} />
            </button>
            <button className="icon-button desktop-only" aria-label="Üyelik">
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
              <h1>Çikolata, pasta ve kutlama hediyeleri</h1>
              <span>18:00&apos;a kadar verdiğiniz siparişler aynı gün teslim edilir.</span>
            </div>
            <img
              className="hero-illustration"
              src={heroChocolate}
              alt="ChocoSite hediye çikolata kutuları"
            />
            <div className="hero-categories" aria-label="Öne çıkan kategoriler">
              {[
                ['Doğum Günü Hediyeleri', cake, 'Doğum Günü'],
                ['Yeni İş Hediyeleri', chocolateBox, 'Mesleklere Özel'],
                ['Kurumsal Hediyeler', flowers, 'Tüm Ürünler'],
              ].map(([label, image, target]) => (
                <button key={label} onClick={() => setActiveCategory(target)}>
                  <img src={image} alt="" />
                  <strong>{label}</strong>
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="marquee" aria-label="Marka mesajı">
          <div>Özenle sevenler ChocoSite gönderiyor</div>
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
              <h2>En Çok Satanlar!</h2>
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

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-media">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  {product.badge && <span className="badge">{product.badge}</span>}
                  <button
                    className={`favorite-button ${favoriteIds.includes(product.id) ? 'active' : ''}`}
                    aria-label={`${product.name} favorilere ekle`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart size={18} />
                  </button>
                </div>
                <div className="product-body">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
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
        </section>

        <section className="content-band">
          <div className="editorial-image">
            <img
              src={cake}
              alt="Çikolatalı pasta hazırlığı"
              loading="lazy"
            />
          </div>
          <div className="editorial-copy">
            <p>Doğum günü pastası</p>
            <h2>Kutlamayı kişisel ve lezzetli yapan detaylar</h2>
            <span>
              Özel günlerde pasta, çikolata, çiçek ve balon seçeneklerini birlikte planlayarak
              unutulmaz bir kutlama hazırlayabilirsiniz. Filtreler ve hızlı sepet akışı mobilde de
              tek elle kullanılacak şekilde tasarlandı.
            </span>
            <div className="feature-list">
              <span>
                <Gift size={18} /> Hediye paketleri
              </span>
              <span>
                <Sparkles size={18} /> Kişiye özel not
              </span>
              <span>
                <Truck size={18} /> Aynı gün teslimat
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <strong>ChocoSite</strong>
          <span>Çikolata, pasta ve kutlama hediyeleri.</span>
        </div>
        <div className="footer-links">
          <a href="#products">Kategoriler</a>
          <a href="#products">Kurumsal</a>
          <a href="#products">Güvenli Alışveriş</a>
          <a href="#products">İletişim</a>
        </div>
        <div className="branch-actions">
          <a href="https://wa.me/" target="_blank" rel="noreferrer">
            <MessageCircle size={17} /> İstanbul
          </a>
          <a href="https://wa.me/" target="_blank" rel="noreferrer">
            <MessageCircle size={17} /> Ankara
          </a>
        </div>
      </footer>

      <SideMenu
        open={menuOpen}
        close={() => setMenuOpen(false)}
        categories={categories}
        setActiveCategory={setActiveCategory}
        openTracking={() => setTrackingOpen(true)}
      />
      <CartDrawer
        open={cartOpen}
        close={() => setCartOpen(false)}
        cart={cart}
        total={cartTotal}
        updateQuantity={updateQuantity}
      />
      <TrackingModal open={trackingOpen} close={() => setTrackingOpen(false)} />
      <SearchOverlay
        open={searchOpen}
        close={() => setSearchOpen(false)}
        query={query}
        setQuery={setQuery}
        products={filteredProducts}
        addToCart={addToCart}
      />

      <div className="palette-dock">
        <button className="palette-toggle" onClick={() => setPaletteOpen((open) => !open)}>
          <Sparkles size={15} />
          {paletteOpen ? 'Palet' : 'Renk paleti'}
        </button>
        {paletteOpen && (
          <div className="palette-menu" role="radiogroup" aria-label="Renk paleti">
            {PALETTES.map((option) => (
              <button
                key={option.id}
                role="radio"
                aria-checked={palette === option.id}
                className={palette === option.id ? 'active' : ''}
                onClick={() => setPalette(option.id)}
              >
                <span className="palette-swatches">
                  {option.swatch.map((color) => (
                    <i key={color} style={{ background: color }} />
                  ))}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SideMenu({ open, close, categories, setActiveCategory, openTracking }) {
  return (
    <div className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <aside className="side-panel left">
        <div className="panel-header">
          <strong>Menü</strong>
          <button className="icon-button" onClick={close} aria-label="Menüyü kapat">
            <X size={21} />
          </button>
        </div>
        <button className="menu-row">
          <User size={18} /> Üyelik
        </button>
        <button className="menu-row">
          <Heart size={18} /> Favorilerim
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
        <div className="menu-categories">
          <span>Kategoriler</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                close();
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </aside>
      <button className="scrim" onClick={close} aria-label="Kapat" />
    </div>
  );
}

function CartDrawer({ open, close, cart, total, updateQuantity }) {
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
            <div className="cart-summary">
              <span>Ara toplam</span>
              <strong>{formatPrice(total)}</strong>
              <button>Sepeti Gör</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function TrackingModal({ open, close }) {
  const [answer, setAnswer] = useState('');
  const [captcha, setCaptcha] = useState('7 + 4');
  const [message, setMessage] = useState('');

  const refreshCaptcha = () => {
    const left = Math.ceil(Math.random() * 8);
    const right = Math.ceil(Math.random() * 8);
    setCaptcha(`${left} + ${right}`);
    setAnswer('');
  };

  const submit = (event) => {
    event.preventDefault();
    setMessage('Demo sipariş takibi hazır. Gerçek mağaza API bağlantısı eklendiğinde sonuç burada görünür.');
  };

  return (
    <div className={`modal-layer ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="modal-scrim" onClick={close} aria-label="Kapat" />
      <section className="tracking-modal" role="dialog" aria-modal="true" aria-labelledby="tracking-title">
        <div className="panel-header">
          <strong id="tracking-title">Siparişim Nerede?</strong>
          <button className="icon-button" onClick={close} aria-label="Kapat">
            <X size={21} />
          </button>
        </div>
        <p>Vermiş olduğunuz siparişi aşağıdaki kısa formu doldurarak takip edebilirsiniz.</p>
        <form onSubmit={submit}>
          <input required placeholder="Sipariş Numaranız" />
          <input required type="email" placeholder="E-posta Adresiniz" />
          <div className="captcha-row">
            <span>{captcha}</span>
            <button type="button" onClick={refreshCaptcha} aria-label="Güvenlik sorusunu yenile">
              <RotateCcw size={17} />
            </button>
            <input required value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Cevap" />
          </div>
          <small>Güvenlik için 15 dakikada en fazla 5 sipariş sorgulayabilirsiniz.</small>
          <button type="submit">Sorgula</button>
        </form>
        {message && <div className="form-message">{message}</div>}
      </section>
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

createRoot(document.getElementById('root')).render(<App />);

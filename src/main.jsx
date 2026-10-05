import React, { useMemo, useState } from 'react';
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
import chocolateBox from './assets/chocolate-box.svg';
import cake from './assets/cake.svg';
import flowers from './assets/flowers.svg';
import balloons from './assets/balloons.svg';
import teddyGift from './assets/teddy-gift.svg';
import cheesecake from './assets/cheesecake.svg';
import heroChocolate from './assets/hero-chocolate.svg';
import venedikPhoto from './assets/Images/hd-venedik-01.webp';
import venedikMiniPhoto from './assets/Images/hd-venedik-mini-01.webp';
import venedikBirthdayPhoto from './assets/Images/hd-venedik-02.webp';
import badgeBirthday from './assets/Images/bn-rakun-dogum-gunu-hediyeleri.svg';
import badgeWorkplace from './assets/Images/bn-rakun-yeni-is-hediyeleri.svg';
import badgeCorporate from './assets/Images/bn-rakun-kurumsal-hediyeler.svg';

const WHATSAPP_NUMBER = '905414015262';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
const waLink = (text) => `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;

const TRACKING_TEXT = 'Merhaba, siparişim nerede? Sipariş numaram: ';
const ORDER_TEXT = 'Merhaba, ChocoSite\'den sipariş vermek istiyorum.';

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
    image: venedikPhoto,
  },
  {
    id: 2,
    name: 'Venedik Mini',
    category: 'Hediye Çikolata',
    price: 1049,
    oldPrice: 1299,
    badge: '%19 indirim',
    image: venedikMiniPhoto,
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
    image: venedikBirthdayPhoto,
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

const formatPrice = (value) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);

const cartOrderText = (cart, total) => {
  const lines = cart.map(
    (item) => `- ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`,
  );
  return `Merhaba, sipariş vermek istiyorum:\n${lines.join('\n')}\n\nAra toplam: ${formatPrice(total)}`;
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
            <a
              className="icon-button desktop-only"
              aria-label="Sipariş takibi - WhatsApp"
              href={waLink(TRACKING_TEXT)}
              target="_blank"
              rel="noreferrer"
            >
              <Truck size={20} />
            </a>
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
              <h1>Denizli&apos;ye çikolata, pasta ve kutlama hediyeleri</h1>
              <span>Siparişler Denizli içi aynı gün teslim edilir.</span>
            </div>
            <img
              className="hero-illustration"
              src={heroChocolate}
              alt="ChocoSite hediye çikolata kutuları"
            />
            <div className="hero-categories" aria-label="Öne çıkan kategoriler">
              {[
                ['Doğum Günü Hediyeleri', badgeBirthday, 'Doğum Günü'],
                ['Yeni İş Hediyeleri', badgeWorkplace, 'Mesleklere Özel'],
                ['Kurumsal Hediyeler', badgeCorporate, 'Tüm Ürünler'],
              ].map(([label, image, target]) => (
                <button key={label} onClick={() => setActiveCategory(target)}>
                  <img src={image} alt={label} />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="marquee" aria-label="Marka mesajı">
          <div>Denizli&apos;ye özenle ChocoSite gönderiyor</div>
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
              unutulmaz bir kutlama hazırlayabilirsiniz. Siparişler yalnızca Denizli içine özel
              teslimatla adresinize ulaşır; sepet akışı mobilde de tek elle kullanılacak şekilde
              tasarlandı.
            </span>
            <div className="feature-list">
              <span>
                <Gift size={18} /> Hediye paketleri
              </span>
              <span>
                <Sparkles size={18} /> Kişiye özel not
              </span>
              <span>
                <Truck size={18} /> Denizli içi teslimat
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <strong>ChocoSite</strong>
          <span>Çikolata, pasta ve kutlama hediyeleri. Denizli içi özel teslimat.</span>
        </div>
        <div className="footer-links">
          <a href="#products">Kategoriler</a>
          <a href="#products">Kurumsal</a>
          <a href="#products">Güvenli Alışveriş</a>
          <a href="#products">İletişim</a>
        </div>
        <div className="branch-actions">
          <a
            href={waLink('Merhaba, Merkezefendi ilçesine teslimat hakkında bilgi almak istiyorum.')}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> Merkezefendi
          </a>
          <a
            href={waLink('Merhaba, Pamukkale ilçesine teslimat hakkında bilgi almak istiyorum.')}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> Pamukkale
          </a>
        </div>
      </footer>

      <SideMenu
        open={menuOpen}
        close={() => setMenuOpen(false)}
        categories={categories}
        setActiveCategory={setActiveCategory}
      />
      <CartDrawer
        open={cartOpen}
        close={() => setCartOpen(false)}
        cart={cart}
        total={cartTotal}
        updateQuantity={updateQuantity}
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
        href={waLink(ORDER_TEXT)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp ile Denizli siparişi ver"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}

function SideMenu({ open, close, categories, setActiveCategory }) {
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
        <a
          className="menu-row"
          href={waLink(TRACKING_TEXT)}
          target="_blank"
          rel="noreferrer"
          onClick={close}
        >
          <Truck size={18} /> Sipariş Takibi
        </a>
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

import { createContext, useContext, useEffect, useRef, useState } from 'react';

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

export const ASSETS = {
  'chocolate-box': chocolateBox,
  cake,
  flowers,
  balloons,
  'teddy-gift': teddyGift,
  cheesecake,
  'hero-chocolate': heroChocolate,
  'venedik-01': venedikPhoto,
  'venedik-mini-01': venedikMiniPhoto,
  'venedik-02': venedikBirthdayPhoto,
  'badge-birthday': badgeBirthday,
  'badge-workplace': badgeWorkplace,
  'badge-corporate': badgeCorporate,
};

export const ASSET_LABELS = {
  'chocolate-box': 'Çikolata kutusu (illostrasyon)',
  cake: 'Pasta (illostrasyon)',
  flowers: 'Çiçek buketi (illostrasyon)',
  balloons: 'Balon (illostrasyon)',
  'teddy-gift': 'Ayıcıklı hediye (illostrasyon)',
  cheesecake: 'Cheesecake (illostrasyon)',
  'hero-chocolate': 'Hero çikolata illüstrasyonu',
  'venedik-01': 'Venedik fotoğrafı',
  'venedik-mini-01': 'Venedik Mini fotoğrafı',
  'venedik-02': 'Mini Venedik Brownie fotoğrafı',
  'badge-birthday': 'Doğum günü rozeti',
  'badge-workplace': 'Yeni iş rozeti',
  'badge-corporate': 'Kurumsal rozet',
};

const STORAGE_KEY = 'chocosite.content.v1';

export const resolveImage = (value) => {
  if (!value) return '';
  if (value.startsWith('asset:')) return ASSETS[value.slice(6)] || '';
  return value;
};

export const primaryImage = (product) => resolveImage((product && product.images && product.images[0]) || '');

export const formatPrice = (value) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const DEFAULT_CATEGORIES = [
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
  'Çikolata Kutuları',
  'Hediye Çikolata',
  'Pasta',
];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Venedik',
    categories: ['Çikolata Kutuları', 'Sevgiliye Özel'],
    price: 1749,
    oldPrice: 1799,
    badge: '%3 indirim',
    description: 'Fındık dolgulu sütlü çikolata kutusu, el yapımı kaplama.',
    images: ['asset:venedik-01'],
    active: true,
  },
  {
    id: 2,
    name: 'Venedik Mini',
    categories: ['Hediye Çikolata', 'Sevgiliye Özel'],
    price: 1049,
    oldPrice: 1299,
    badge: '%19 indirim',
    description: 'Küçük boy hediye kutusu, tek kişilik kutlama sürprizi.',
    images: ['asset:venedik-mini-01'],
    active: true,
  },
  {
    id: 3,
    name: 'Your Majesty',
    categories: ['Çikolata Kutuları', 'Kurumsal'],
    price: 2299,
    image: 'asset:chocolate-box',
    images: ['asset:chocolate-box'],
    description: 'Kurumsal hediyeler için zarif çikolata kutusu.',
    active: true,
  },
  {
    id: 4,
    name: 'HOLA',
    categories: ['Doğum Günü'],
    price: 2745,
    image: 'asset:cake',
    images: ['asset:cake'],
    description: 'Doğum günü pastası ve kutlama seti.',
    active: true,
  },
  {
    id: 5,
    name: 'JOY Ayıcıklı Kutlama Paketi',
    categories: ['Çocuğa Hediyeler', 'Peluş Oyuncak'],
    price: 5490,
    image: 'asset:teddy-gift',
    images: ['asset:teddy-gift'],
    description: 'Pelüş ayıcık, çikolata ve balon birlikteliği.',
    active: true,
  },
  {
    id: 6,
    name: 'Öğretmene Hediye - Chambre',
    categories: ['Mesleklere Özel', 'Teşekkürler'],
    price: 1699,
    oldPrice: 1999,
    badge: '%15 indirim',
    image: 'asset:chocolate-box',
    images: ['asset:chocolate-box'],
    description: 'Öğretmenler Günü için teşekkür hediyesi.',
    active: true,
  },
  {
    id: 7,
    name: 'Mini Venedik Brownie',
    categories: ['Pasta', 'Doğum Günü'],
    price: 1049,
    image: 'asset:venedik-02',
    images: ['asset:venedik-02'],
    description: 'Brownie dokulu mini pasta.',
    active: true,
  },
  {
    id: 8,
    name: 'Sirene Tiramisu + Çiçek',
    categories: ['Çiçekler', 'Teşekkürler'],
    price: 2698,
    image: 'asset:flowers',
    images: ['asset:flowers'],
    description: 'Tiramisu ve taze çiçek birlikteliği.',
    active: true,
  },
  {
    id: 9,
    name: '6 Cakes',
    categories: ['Doğum Günü'],
    price: 1799,
    image: 'asset:cake',
    images: ['asset:cake'],
    description: 'Altı dilim kutlama pastası.',
    active: true,
  },
  {
    id: 10,
    name: 'Venüs, Kalp Balon',
    categories: ['Uçan Balon', 'Sevgiliye Özel'],
    price: 2399,
    image: 'asset:balloons',
    images: ['asset:balloons'],
    description: 'Helyumlu kalp balon seti.',
    active: true,
  },
  {
    id: 11,
    name: 'New York Cheesecake',
    categories: ['Pasta'],
    price: 1899,
    image: 'asset:cheesecake',
    images: ['asset:cheesecake'],
    description: 'Klasik New York usulü cheesecake.',
    active: true,
  },
  {
    id: 12,
    name: 'Love Bombing',
    categories: ['Sevgiliye Özel'],
    price: 3298,
    oldPrice: 3699,
    badge: '%11 indirim',
    image: 'asset:chocolate-box',
    images: ['asset:chocolate-box'],
    description: 'Sevgiliye özel kalpli çikolata kutusu.',
    active: true,
  },
];

const DEFAULT_SITE = {
  heroTitle: "Denizli'ye çikolata, pasta ve kutlama hediyeleri",
  heroSubtitle: 'Siparişler Denizli içi aynı gün teslim edilir.',
  heroCards: [
    { label: 'Doğum Günü Hediyeleri', image: 'asset:badge-birthday', target: 'Doğum Günü' },
    { label: 'Yeni İş Hediyeleri', image: 'asset:badge-workplace', target: 'Mesleklere Özel' },
    { label: 'Kurumsal Hediyeler', image: 'asset:badge-corporate', target: 'Tüm Ürünler' },
  ],
  marquee: "Denizli'ye özenle ChocoSite gönderiyor",
  sectionTitle: 'En Çok Satanlar!',
  aboutKicker: 'Doğum günü pastası',
  aboutTitle: 'Kutlamayı kişisel ve lezzetli yapan detaylar',
  aboutText:
    'Özel günlerde pasta, çikolata, çiçek ve balon seçeneklerini birlikte planlayarak unutulmaz bir kutlama hazırlayabilirsiniz. Siparişler yalnızca Denizli içine özel teslimatla adresinize ulaşır; sepet akışı mobilde de tek elle kullanılacak şekilde tasarlandı.',
  aboutFeatures: ['Hediye paketleri', 'Kişiye özel not', "Denizli içi teslimat"],
  footerTagline:
    'Çikolata, pasta ve kutlama hediyeleri. Denizli içi özel teslimat.',
  footerLinks: [
    { label: 'Kategoriler', href: '#products' },
    { label: 'Kurumsal', href: '#products' },
    { label: 'Güvenli Alışveriş', href: '#products' },
    { label: 'İletişim', href: '#contact' },
  ],
  branches: [
    {
      name: 'Merkezefendi',
      text: 'Merhaba, Merkezefendi ilçesine teslimat hakkında bilgi almak istiyorum.',
    },
    {
      name: 'Pamukkale',
      text: 'Merhaba, Pamukkale ilçesine teslimat hakkında bilgi almak istiyorum.',
    },
  ],
  phone: '0541 401 52 62',
  menuTagline: 'Denizli içi aynı gün teslimat',
  menuWhatsappLabel: "WhatsApp'tan sipariş ver",
  menuBranchLine: 'Merkezefendi & Pamukkale',
  trackHint:
    "Durumu öğrenmek için sipariş numaranızı girin. Mesajınız WhatsApp'ta hazır şekilde açılacak.",
  trackMeta: "Denizli içi aynı gün teslimat",
  trackPlaceholder: 'Örn. CS-1024',
  trackButton: "WhatsApp'tan sorgula",
};

const DEFAULT_WHATSAPP = {
  order: "Merhaba, ChocoSite'den sipariş vermek istiyorum.",
  account: 'Merhaba, üyelik ve hesap işlemleri hakkında bilgi almak istiyorum.',
  tracking: 'Merhaba, siparişim nerede? Sipariş numaram: {SIPARIS_NO}',
  cartIntro: 'Merhaba, sipariş vermek istiyorum:',
  paymentPrefix: 'Ödeme şekli:',
  fabLabel: 'WhatsApp ile Denizli siparişi ver',
};

const DEFAULT_PAYMENTS = [
  {
    id: 'card',
    label: 'Kredi / Banka Kartı',
    tag: 'Yakında',
    note: 'Online ödeme altyapısı hazırlanıyor. Bu aşamada siparişiniz WhatsApp üzerinden tamamlanır.',
  },
  {
    id: 'transfer',
    label: 'Havale / EFT',
    tag: '',
    note: 'Havale bilgileri sipariş onayında WhatsApp üzerinden paylaşılır.',
  },
  {
    id: 'cod',
    label: 'Kapıda Ödeme',
    tag: '',
    note: 'Kapıda ödeme yalnızca Denizli içi teslimatlarda geçerlidir.',
  },
];

export const DEFAULT_STATE = {
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS,
  site: DEFAULT_SITE,
  whatsapp: DEFAULT_WHATSAPP,
  payments: DEFAULT_PAYMENTS,
};

const asArray = (value, fallback) =>
  Array.isArray(value) && value.length ? value : fallback;

const normalizeProduct = (product, index) => {
  const images = asArray(product.images, asArray(product.image ? [product.image] : [], []));
  const categories = asArray(product.categories, product.category ? [product.category] : []);
  return {
    id: Number.isFinite(Number(product.id)) ? Number(product.id) : index + 1,
    name: String(product.name || 'İsimsiz ürün'),
    categories: categories.map(String),
    price: Number(product.price) || 0,
    oldPrice: Number(product.oldPrice) || 0,
    badge: String(product.badge || ''),
    description: String(product.description || ''),
    images: images.map(String),
    active: product.active !== false,
  };
};

export const normalize = (input) => {
  const raw = input && typeof input === 'object' ? input : {};
  return {
    categories: asArray(raw.categories, DEFAULT_CATEGORIES).map(String),
    products: asArray(raw.products, DEFAULT_PRODUCTS).map(normalizeProduct),
    site: { ...DEFAULT_SITE, ...(raw.site || {}) },
    whatsapp: { ...DEFAULT_WHATSAPP, ...(raw.whatsapp || {}) },
    payments: asArray(raw.payments, DEFAULT_PAYMENTS),
  };
};

const readStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalize(JSON.parse(raw));
  } catch (error) {
    return null;
  }
};

export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => readStorage() || DEFAULT_STATE);
  const [status, setStatus] = useState('saved');
  const timerRef = useRef(null);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        setState(normalize(JSON.parse(event.newValue)));
      } catch (error) {
        /* yoksay */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const persist = (next) => {
    setStatus('saving');
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setStatus('saved');
      } catch (error) {
        setStatus('error');
      }
    }, 350);
  };

  const commit = (next) => {
    const normalized = normalize(next);
    setState(normalized);
    persist(normalized);
    return normalized;
  };

  const update = (updater) => {
    setState((current) => {
      const next = updater(current);
      persist(next);
      return next;
    });
  };

  const reset = () => {
    window.clearTimeout(timerRef.current);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* yoksay */
    }
    setState(DEFAULT_STATE);
    setStatus('saved');
  };

  const value = { state, update, commit, reset, status };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);

export const storageUsage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) || '';
    return Math.round((new Blob([raw]).size / 1024) * 10) / 10;
  } catch (error) {
    return 0;
  }
};

export const fileToDataUrl = (file, maxSize = 1000) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.onload = () => {
      const original = reader.result;
      const image = new Image();
      image.onerror = () => resolve(original);
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height);
        try {
          const webp = canvas.toDataURL('image/webp', 0.82);
          resolve(webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.82));
        } catch (error) {
          resolve(original);
        }
      };
      image.src = original;
    };
    reader.readAsDataURL(file);
  });

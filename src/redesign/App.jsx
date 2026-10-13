import { useEffect, useMemo, useState } from 'react';
import './redesign.css';
import { useStore } from '../store.jsx';
import RedesignHome from './Home.jsx';
import ProductPage from './Product.jsx';
import CartPage from './Cart.jsx';
import ConsentBanner from './ConsentBanner.jsx';
import LegalPage from './LegalPage.jsx';
import { configurePixel, trackAddToCart, trackCheckoutStart, trackPageView, trackViewProduct } from '../analytics.js';

const CART_KEY = 'chocosite.cart.v2';

const readCart = () => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(CART_KEY) || '{}');
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  } catch (error) {
    return {};
  }
};

const parseRoute = () => {
  const hash = window.location.hash;
  const product = hash.match(/^#\/urun\/(\d+)/);
  if (product) return { page: 'product', id: Number(product[1]) };
  if (hash.startsWith('#/sepet')) return { page: 'cart' };
  const legal = hash.match(/^#\/sayfa\/([a-z-]+)/);
  if (legal) return { page: 'legal', id: legal[1] };
  return { page: 'home' };
};

export default function RedesignApp() {
  const { state } = useStore();
  const [route, setRoute] = useState(parseRoute);
  const [cart, setCart] = useState(readCart);
  const [bumpKey, setBumpKey] = useState(0);
  const [delivery, setDeliveryState] = useState(() => ({
    day: 0,
    time: '',
    note: '',
  }));

  useEffect(() => {
    const sync = () => setRoute(parseRoute());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.page, route.id]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      /* yoksay */
    }
  }, [cart]);

  const products = useMemo(() => state.products.filter((product) => product.active), [state.products]);
  const lines = products
    .filter((product) => cart[product.id] > 0)
    .map((product) => ({ product, qty: cart[product.id] }));

  const pixelId = state.site.metaPixelId;
  useEffect(() => {
    configurePixel(pixelId);
  }, [pixelId]);

  // Her sayfa geçişinde görüntüleme, ürün ve sepet sayfalarında ilgili olay gönderilir.
  useEffect(() => {
    trackPageView();
    if (route.page === 'product') {
      const viewed = products.find((product) => product.id === route.id);
      if (viewed) trackViewProduct(viewed);
    }
    if (route.page === 'cart' && lines.length) {
      trackCheckoutStart(lines, lines.reduce((sum, line) => sum + line.product.price * line.qty, 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.page, route.id]);

  const shop = {
    products,
    lines,
    count: lines.reduce((sum, line) => sum + line.qty, 0),
    total: lines.reduce((sum, line) => sum + line.product.price * line.qty, 0),
    bumpKey,
    delivery,
    setDelivery: (patch) => setDeliveryState((current) => ({ ...current, ...patch })),
    add: (product, qty = 1) => {
      setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + qty }));
      setBumpKey((key) => key + 1);
      trackAddToCart(product, qty);
    },
    setQty: (id, qty) => setCart((current) => ({ ...current, [id]: Math.max(0, qty) })),
    clear: () => setCart({}),
  };

  return (
    <div className="cs-page">
      {route.page === 'product' && <ProductPage key={route.id} id={route.id} shop={shop} />}
      {route.page === 'cart' && <CartPage shop={shop} />}
      {route.page === 'legal' && <LegalPage key={route.id} slug={route.id} />}
      {route.page === 'home' && <RedesignHome shop={shop} />}
      {pixelId && <ConsentBanner />}
    </div>
  );
}

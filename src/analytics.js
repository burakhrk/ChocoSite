// Meta Pixel: kimlik yönetim panelinden gelir, ziyaretçi onay vermeden hiçbir şey yüklenmez.
const CONSENT_KEY = 'chocosite.consent';
const CURRENCY = 'TRY';
const MAX_PENDING = 20;

let pixelId = '';
let started = false;
const pending = [];

export const readConsent = () => {
  try {
    return window.localStorage.getItem(CONSENT_KEY) || '';
  } catch (error) {
    return '';
  }
};

const loadPixelScript = () => {
  if (window.fbq) return;
  const fbq = function fbq(...args) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
};

const startPixel = () => {
  if (started || !pixelId || readConsent() !== 'granted') return;
  loadPixelScript();
  window.fbq('init', pixelId);
  started = true;
  pending.splice(0).forEach(([event, params]) => window.fbq('track', event, params));
};

export const configurePixel = (id) => {
  pixelId = String(id || '').replace(/\D/g, '');
  startPixel();
};

export const saveConsent = (granted) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch (error) {
    /* yoksay */
  }
  if (granted) startPixel();
  else pending.length = 0;
};

// Piksel henüz başlamadıysa olaylar bekletilir; onay reddedildiyse hiç tutulmaz.
const track = (event, params) => {
  if (started) {
    window.fbq('track', event, params);
    return;
  }
  if (readConsent() === 'denied') return;
  pending.push([event, params]);
  if (pending.length > MAX_PENDING) pending.shift();
};

const productParams = (product, qty = 1) => ({
  content_ids: [String(product.id)],
  content_name: product.name,
  content_type: 'product',
  value: product.price * qty,
  currency: CURRENCY,
});

const cartParams = (lines, total) => ({
  content_ids: lines.map((line) => String(line.product.id)),
  content_type: 'product',
  num_items: lines.reduce((sum, line) => sum + line.qty, 0),
  value: total,
  currency: CURRENCY,
});

export const trackPageView = () => track('PageView');
export const trackViewProduct = (product) => track('ViewContent', productParams(product));
export const trackAddToCart = (product, qty) => track('AddToCart', productParams(product, qty));
export const trackCheckoutStart = (lines, total) => track('InitiateCheckout', cartParams(lines, total));
// Sipariş WhatsApp'ta tamamlandığı için satın alma yerine "Lead" gönderilir.
export const trackOrderSent = (lines, total) => track('Lead', cartParams(lines, total));
export const trackContact = () => track('Contact');

import { useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { formatPrice, primaryImage, resolveImage } from '../store.jsx';
import { CART_HREF, CartBadge, DeliveryPicker, Drip, HOME_HREF, NoteCard, SubHeader, isIllustration, useScrollMotion } from './shared.jsx';

const EXTRA_LIMIT = 4;

export default function ProductPage({ id, shop }) {
  const rootRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [extras, setExtras] = useState({});

  const product = shop.products.find((item) => item.id === id);
  useScrollMotion(rootRef, [id]);

  if (!product) {
    return (
      <div className="cs-root" ref={rootRef} style={{ minHeight: '100vh' }}>
        <SubHeader title="ChocoSite" color="#FFD0E0" />
        <div style={{ padding: '60px var(--gutter)', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
          <p className="cs-hand" style={{ fontSize: 30 }}>Bu ürünü bulamadık</p>
          <a className="cs-cta" href={HOME_HREF}>Hediyelere göz at</a>
        </div>
      </div>
    );
  }

  const images = product.images.map(resolveImage).filter(Boolean);
  const mainImage = images[imageIndex] || primaryImage(product);
  const extraProducts = shop.products
    .filter((item) => item.id !== product.id && !item.categories.some((name) => product.categories.includes(name)))
    .slice(0, EXTRA_LIMIT);
  const picked = extraProducts.filter((item) => extras[item.id]);
  const total = product.price * qty + picked.reduce((sum, item) => sum + item.price, 0);

  const addAll = () => {
    shop.add(product, qty);
    picked.forEach((item) => shop.add(item, 1));
    window.location.hash = CART_HREF;
  };

  return (
    <div className="cs-root" ref={rootRef}>
      <SubHeader title="ChocoSite" color="#FFD0E0">
        <CartBadge count={shop.count} bumpKey={shop.bumpKey} />
      </SubHeader>

      <div className="cs-product-layout">
      <section className="cs-product-gallery" style={{ position: 'relative', background: '#FFD0E0', padding: '16px var(--gutter) 40px' }}>
        <div style={{ position: 'relative', height: 372 }}>
          <div className="cs-hero-back cs-scallop" aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 10, width: 308, height: 352, marginLeft: -154, background: '#FFD45C' }} />
          <div className="cs-product-pic" style={{ position: 'absolute', left: '50%', top: 6, width: 308, height: 352, marginLeft: -154 }}>
            <div className="cs-rv cs-scallop" style={{ '--r': '-10deg', width: 308, height: 352, background: '#FFF6E0' }}>
              <img src={mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', mixBlendMode: isIllustration(mainImage) ? 'multiply' : 'normal' }} />
            </div>
          </div>
          {product.badge && (
            <div className="cs-stampspin" style={{ position: 'absolute', right: -6, top: -6 }}>
              <div className="cs-stamp" style={{ width: 76, height: 76, background: '#D8323C', color: '#fff', display: 'grid', placeItems: 'center', textAlign: 'center', fontWeight: 700, fontSize: 16, lineHeight: 1.05, padding: 8 }}>
                {product.badge}
              </div>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14 }}>
            {images.map((image, index) => (
              <button key={image} type="button" className={`cs-thumb${imageIndex === index ? ' cs-active' : ''}`} aria-label={`Görsel ${index + 1}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}>
                <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="cs-product-info">
      <section style={{ padding: '0 var(--gutter) 28px' }}>
        <Drip color="#FFD0E0" />
        <p className="cs-rv cs-hand" style={{ marginTop: 22, fontSize: 22, color: '#D8323C' }}>{product.categories.join(' · ')}</p>
        <h1 className="cs-rv cs-display" style={{ fontSize: 42, lineHeight: 1.02 }}>{product.name}</h1>
        <div className="cs-rv" style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
          <span className="cs-display" style={{ fontSize: 30 }}>{formatPrice(product.price)}</span>
          {product.oldPrice > 0 && <span style={{ color: '#6B4A40', textDecoration: 'line-through' }}>{formatPrice(product.oldPrice)}</span>}
        </div>
        {product.description && <p className="cs-rv" style={{ marginTop: 12, color: '#6B4A40' }}>{product.description}</p>}
      </section>

      <section style={{ padding: '0 var(--gutter) 30px' }}>
        <h2 className="cs-rv" style={{ fontSize: 18, fontWeight: 700 }}>Ne zaman gelsin?</h2>
        <DeliveryPicker delivery={shop.delivery} setDelivery={shop.setDelivery} />
      </section>

      <section style={{ background: '#FFF3C9', padding: '0 var(--gutter) 34px' }}>
        <Drip color="#FFFDF8" />
        <div className="cs-rv" style={{ '--r': '-5deg', marginTop: 24 }}>
          <NoteCard note={shop.delivery.note} setNote={(value) => shop.setDelivery({ note: value })} />
        </div>
      </section>

      {extraProducts.length > 0 && (
        <section style={{ padding: '30px 0 34px' }}>
          <h2 className="cs-rv" style={{ padding: '0 var(--gutter)', fontSize: 18, fontWeight: 700 }}>Yanına ekle</h2>
          <div className="cs-hs" style={{ gap: 12, padding: '16px var(--gutter) 8px' }}>
            {extraProducts.map((item) => {
              const image = primaryImage(item);
              const active = Boolean(extras[item.id]);
              return (
                <button key={item.id} type="button" className={`cs-extra${active ? ' cs-active' : ''}`} aria-pressed={active} onClick={() => setExtras((current) => ({ ...current, [item.id]: !current[item.id] }))}>
                  <span style={{ display: 'block', height: 110, borderRadius: 16, overflow: 'hidden', background: '#FFE1EC' }}>
                    <img src={image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', mixBlendMode: isIllustration(image) ? 'multiply' : 'normal' }} />
                  </span>
                  <span style={{ fontWeight: 600, lineHeight: 1.2, minHeight: 34 }}>{item.name}</span>
                  <span className="cs-display" style={{ fontSize: 17 }}>+ {formatPrice(item.price)}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      </div>
      </div>

      <div className="cs-bottombar">
        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #3B1A12', borderRadius: 999 }}>
          <button type="button" className="cs-qty" aria-label="Azalt" onClick={() => setQty((value) => Math.max(1, value - 1))}>
            <Minus size={18} strokeWidth={3} aria-hidden="true" />
          </button>
          <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
          <button type="button" className="cs-qty" aria-label="Artır" onClick={() => setQty((value) => value + 1)}>
            <Plus size={18} strokeWidth={3} aria-hidden="true" />
          </button>
        </div>
        <button type="button" className="cs-cta" onClick={addAll} style={{ flex: 1 }}>
          <span>Sepete ekle</span>
          <span className="cs-display" style={{ fontSize: 19 }}>{formatPrice(total)}</span>
        </button>
      </div>
    </div>
  );
}

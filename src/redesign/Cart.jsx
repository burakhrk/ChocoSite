import { useRef, useState } from 'react';
import { MessageCircle, Minus, Plus } from 'lucide-react';
import { formatPrice, primaryImage, useStore } from '../store.jsx';
import { DeliveryPicker, Drip, HOME_HREF, NoteCard, SubHeader, isIllustration, orderText, productHref, useScrollMotion, waLink } from './shared.jsx';

const LINE_TONES = ['#FFF3C9', '#EDF7FC', '#F1FAE8', '#F6ECFD'];
const STEPS = ['Sepet', 'Teslimat', 'Onay'];

const FIELDS = [
  { key: 'name', label: 'Adınız soyadınız', autoComplete: 'name' },
  { key: 'recipient', label: 'Teslim edilecek kişi', autoComplete: 'off' },
  { key: 'phone', label: 'Telefon', autoComplete: 'tel', type: 'tel', placeholder: '05__ ___ __ __' },
];

export default function CartPage({ shop }) {
  const { state } = useStore();
  const { whatsapp, payments } = state;
  const rootRef = useRef(null);
  const [form, setForm] = useState({ name: '', recipient: '', phone: '', address: '' });
  const [paymentId, setPaymentId] = useState(payments[0] ? payments[0].id : '');

  const { lines, total, delivery } = shop;
  const empty = lines.length === 0;
  const payment = payments.find((method) => method.id === paymentId) || payments[0];
  useScrollMotion(rootRef, [lines.length]);

  const setField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const orderLink = waLink(
    orderText({ lines, total, delivery, form, paymentLabel: payment ? payment.label : '', whatsapp }),
  );

  return (
    <div className="cs-root cs-cart" ref={rootRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SubHeader title="Sepetim" color="#BFE3A2" backLabel="Alışverişe dön" />

      <section style={{ background: '#BFE3A2', padding: '10px var(--gutter) 34px' }}>
        <h1 className="cs-rv cs-display" style={{ fontSize: 40, lineHeight: 1.02 }}>
          {empty ? 'Sepetin şimdilik boş' : 'Kutun neredeyse hazır'}
        </h1>
        <ol aria-label="Sipariş adımları" style={{ listStyle: 'none', margin: '20px 0 0', padding: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
          {STEPS.map((step, index) => (
            <li key={step} style={{ display: 'contents' }}>
              {index > 0 && <span aria-hidden="true" style={{ flex: 1, height: 0, borderTop: '3px dotted #3B1A12' }} />}
              <span className="cs-rv" style={{ '--d': `${index * 120}ms`, padding: '8px 14px', borderRadius: 999, background: index === 0 ? '#3B1A12' : '#FFFDF8', color: index === 0 ? '#FFD45C' : '#3B1A12', rotate: index === 0 ? '-3deg' : '0deg' }}>
                {index + 1} · {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section style={{ padding: '0 var(--gutter) 30px' }}>
        <Drip color="#BFE3A2" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
          {lines.map(({ product, qty }, index) => {
            const image = primaryImage(product);
            return (
              <article key={product.id} className="cs-rv" style={{ '--r': index % 2 ? '3deg' : '-3deg', display: 'flex', gap: 14, alignItems: 'center', padding: 10, borderRadius: 24, background: LINE_TONES[index % LINE_TONES.length] }}>
                <a href={productHref(product)} className="cs-stamp" style={{ flex: 'none', width: 96, height: 96, overflow: 'hidden', background: '#fff', display: 'block' }}>
                  <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', mixBlendMode: isIllustration(image) ? 'multiply' : 'normal' }} />
                </a>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>{product.name}</h2>
                  <span className="cs-display" style={{ fontSize: 19 }}>{formatPrice(product.price * qty)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#FFFDF8', borderRadius: 999 }}>
                      <button type="button" className="cs-qty" aria-label={`${product.name} azalt`} onClick={() => shop.setQty(product.id, qty - 1)}>
                        <Minus size={16} strokeWidth={3} aria-hidden="true" />
                      </button>
                      <span style={{ minWidth: 18, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                      <button type="button" className="cs-qty" aria-label={`${product.name} artır`} onClick={() => shop.setQty(product.id, qty + 1)}>
                        <Plus size={16} strokeWidth={3} aria-hidden="true" />
                      </button>
                    </div>
                    <button type="button" onClick={() => shop.setQty(product.id, 0)} style={{ minHeight: 44, padding: '0 10px', border: 0, background: 'transparent', color: '#3B1A12', fontWeight: 600, fontSize: 14, textDecoration: 'underline' }}>
                      Kaldır
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
          {empty && (
            <div style={{ padding: '30px 20px', borderRadius: 24, border: '2px dashed #3B1A12', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <span className="cs-hand" style={{ fontSize: 28 }}>İçine güzel bir şeyler koyalım</span>
              <a className="cs-cta" href={HOME_HREF}>Hediyelere göz at</a>
            </div>
          )}
        </div>
      </section>

      {!empty && (
        <>
          <section style={{ background: '#FFE1EC', padding: '0 var(--gutter) 34px' }}>
            <Drip color="#FFFDF8" />
            <h2 className="cs-rv cs-display cs-h2" style={{ marginTop: 26, }}>Kime gidiyor?</h2>
            <div className="cs-rv" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
              {FIELDS.map((field) => (
                <label key={field.key} className="cs-label" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {field.label}
                  <input className="cs-field" type={field.type || 'text'} autoComplete={field.autoComplete} placeholder={field.placeholder} value={form[field.key]} onChange={setField(field.key)} />
                </label>
              ))}
              <label className="cs-label" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                Teslimat adresi
                <textarea className="cs-field" rows={3} autoComplete="street-address" value={form.address} onChange={setField('address')} style={{ resize: 'none' }} />
              </label>
            </div>
            <h2 className="cs-rv cs-display cs-h2" style={{ marginTop: 28, }}>Ne zaman gelsin?</h2>
            <DeliveryPicker delivery={delivery} setDelivery={shop.setDelivery} />
          </section>

          <section style={{ background: '#FFF3C9', padding: '0 var(--gutter) 34px' }}>
            <Drip color="#FFE1EC" />
            <div className="cs-rv" style={{ '--r': '-5deg', marginTop: 24 }}>
              <NoteCard note={delivery.note} setNote={(value) => shop.setDelivery({ note: value })} id="cs-cart-note" />
            </div>
          </section>

          <section style={{ padding: '0 var(--gutter) 30px' }}>
            <Drip color="#FFF3C9" />
            <h2 className="cs-rv cs-display cs-h2" style={{ marginTop: 26, }}>Ödeme</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {payments.map((method) => {
                const active = payment && payment.id === method.id;
                return (
                  <button key={method.id} type="button" className="cs-rv" aria-pressed={active} onClick={() => setPaymentId(method.id)} style={{ padding: 16, borderRadius: 20, border: '2px solid #3B1A12', background: active ? '#FFFDF8' : 'transparent', color: '#3B1A12', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{method.label}</span>
                      {method.tag && <span style={{ padding: '4px 12px', borderRadius: 999, background: '#FFD45C', fontSize: 13, fontWeight: 700, rotate: '3deg' }}>{method.tag}</span>}
                    </span>
                    {method.note && <span style={{ fontSize: 14, color: '#6B4A40' }}>{method.note}</span>}
                  </button>
                );
              })}
            </div>
            <div className="cs-rv" style={{ marginTop: 22, paddingTop: 12, borderTop: '2px dotted #3B1A12', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Ara toplam</span>
              <span className="cs-display" style={{ fontSize: 28 }}>{formatPrice(total)}</span>
            </div>
          </section>

          <div className="cs-bottombar" style={{ marginTop: 'auto' }}>
            <a className="cs-cta" href={orderLink} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <MessageCircle size={24} aria-hidden="true" />
                WhatsApp ile tamamla
              </span>
              <span className="cs-display" style={{ fontSize: 19 }}>{formatPrice(total)}</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}

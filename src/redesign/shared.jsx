import { useEffect, useRef } from 'react';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../store.jsx';

const WHATSAPP_LINK = 'https://wa.me/905414015262';
export const waLink = (text) => `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;

export const NOTE_MAX = 90;
export const NOTE_PRESETS = ['İyi ki doğdun!', 'Teşekkür ederim', 'Seni çok seviyorum', 'Geçmiş olsun'];

export const checker = (color, ground) =>
  `conic-gradient(from 45deg, ${color} 25%, #0000 0 50%, ${color} 0 75%, #0000 0) 0 0/30px 30px, ${ground}`;

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const isIllustration = (src) => /svg/i.test(src);

export const productHref = (product) => `#/urun/${product.id}`;
export const CART_HREF = '#/sepet';
export const HOME_HREF = '#/';

export const Drip = ({ color }) => (
  <div className="cs-drip" aria-hidden="true" style={{ '--c': color, margin: '0 calc(var(--gutter) * -1)' }} />
);

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// Bugünden başlayarak bir haftalık teslimat günleri.
export const deliveryDays = () => {
  const now = new Date();
  return [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const short = offset === 0 ? 'Bugün' : offset === 1 ? 'Yarın' : DAY_NAMES[date.getDay()];
    return {
      offset,
      short,
      number: date.getDate(),
      label: `${short}, ${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`,
    };
  });
};

export const orderText = ({ lines, total, delivery, form, paymentLabel, whatsapp }) => {
  const items = lines.map(
    ({ product, qty }) => `- ${product.name} x${qty} - ${formatPrice(product.price * qty)}`,
  );
  const day = deliveryDays()[delivery.day] || deliveryDays()[0];
  const details = [
    ['Teslimat yeri', delivery.zone],
    ['Teslimat günü', day.label],
    ['Teslimat saati', delivery.time],
    ['Ad Soyad', form.name],
    ['Teslim edilecek kişi', form.recipient],
    ['Telefon', form.phone],
    ['Adres', form.address],
    ['Not', delivery.note],
  ]
    .filter(([, value]) => value && value.trim())
    .map(([key, value]) => `${key}: ${value.trim()}`);
  return [
    `${whatsapp.cartIntro}\n${items.join('\n')}\n\nAra toplam: ${formatPrice(total)}`,
    details.join('\n'),
    paymentLabel ? `${whatsapp.paymentPrefix} ${paymentLabel}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
};

// Görünürlük ve kaydırma animasyonlarını kök öğeye bağlar.
export const useScrollMotion = (rootRef, deps) => {
  const tickRef = useRef(() => {});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    root.classList.add('cs-on');

    let frame = 0;
    const tick = () => {
      frame = 0;
      const height = window.innerHeight || 800;
      const viewport = Math.min(height, 900);
      root.style.setProperty('--sy', clamp(window.scrollY, 0, 700).toFixed(1));
      root.querySelectorAll('[data-sp]').forEach((element) => {
        const box = element.getBoundingClientRect();
        const progress = clamp((viewport - box.top) / (viewport + box.height), 0, 1);
        element.style.setProperty('--p', progress.toFixed(3));
      });
      root.querySelectorAll('.cs-rv:not(.cs-in), .cs-pop:not(.cs-in)').forEach((element) => {
        const box = element.getBoundingClientRect();
        if (box.top < height * 0.94 && box.bottom > 0) element.classList.add('cs-in');
      });
    };
    tickRef.current = tick;
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(frame);
      root.classList.remove('cs-on');
    };
  }, [rootRef]);

  useEffect(() => {
    tickRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export function CartBadge({ count, bumpKey }) {
  return (
    <a
      href={CART_HREF}
      aria-label={`Sepet, ${count} ürün`}
      style={{ position: 'relative', width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#3B1A12', color: '#FFD45C' }}
    >
      <ShoppingBag size={22} strokeWidth={2.2} aria-hidden="true" />
      <span
        key={bumpKey}
        className={count ? 'cs-bump' : ''}
        style={{ position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, padding: '0 4px', borderRadius: 10, background: '#D8323C', color: '#fff', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center' }}
      >
        {count}
      </span>
    </a>
  );
}

export function SubHeader({ title, color, backHref = HOME_HREF, backLabel = 'Geri', children }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', gap: 6, padding: '8px var(--gutter-tight)', background: color }}>
      <a href={backHref} aria-label={backLabel} style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#FFFDF8' }}>
        <ChevronLeft size={24} strokeWidth={2.6} aria-hidden="true" />
      </a>
      <span className="cs-display" style={{ flex: 1, textAlign: 'center', fontSize: 22 }}>{title}</span>
      {children || <span style={{ width: 44 }} />}
    </header>
  );
}

export function ZonePicker({ zones, zone, onChange, ground = '#FFE1EC' }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: ground }}>
      {zones.map((name) => (
        <button key={name} type="button" className={`cs-seg${zone === name ? ' cs-active' : ''}`} aria-pressed={zone === name} onClick={() => onChange(name)}>
          {name}
        </button>
      ))}
    </div>
  );
}

export function DeliveryPicker({ delivery, setDelivery }) {
  const days = deliveryDays();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="cs-hs" style={{ gap: 10, margin: '0 calc(var(--gutter) * -1)', padding: '10px var(--gutter) 4px' }}>
        {days.map((day) => (
          <button key={day.offset} type="button" className={`cs-day${delivery.day === day.offset ? ' cs-active' : ''}`} aria-pressed={delivery.day === day.offset} aria-label={day.label} onClick={() => setDelivery({ day: day.offset })}>
            <span>{day.short}</span>
            <span className="cs-display" style={{ fontSize: 22, lineHeight: 1 }}>{day.number}</span>
          </button>
        ))}
      </div>
      <label htmlFor="cs-time" className="cs-label">Teslimat saati</label>
      <input id="cs-time" className="cs-field" type="time" value={delivery.time} onChange={(event) => setDelivery({ time: event.target.value })} />
    </div>
  );
}

export function NoteCard({ note, setNote, id = 'cs-note' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label htmlFor={id} className="cs-label" style={{ fontSize: 18 }}>Kart notun</label>
      <div style={{ position: 'relative', rotate: '-1.5deg', margin: '10px 4px 14px', background: '#FFFDF8', borderRadius: 10, padding: '22px 18px 12px', boxShadow: '0 16px 0 -8px #F0B93A' }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: -14, left: '50%', width: 84, height: 26, marginLeft: -42, rotate: '3deg', background: '#FF9EC0', opacity: 0.85 }} />
        <textarea id={id} rows={3} maxLength={NOTE_MAX} placeholder="İçinden geleni yaz…" value={note} onChange={(event) => setNote(event.target.value)} className="cs-hand" style={{ width: '100%', border: 0, outlineOffset: 6, background: 'transparent', color: '#3B1A12', fontSize: 28, lineHeight: 1.1, resize: 'none' }} />
        <div style={{ textAlign: 'right', fontSize: 13, color: '#6B4A40' }}>{NOTE_MAX - note.length} karakter kaldı</div>
      </div>
      <div className="cs-hs" style={{ gap: 8, margin: '0 calc(var(--gutter) * -1)', padding: '4px var(--gutter)' }}>
        {NOTE_PRESETS.map((preset) => (
          <button key={preset} type="button" className="cs-chip" onClick={() => setNote(preset)}>
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

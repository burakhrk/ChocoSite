import { useMemo, useRef, useState } from 'react';
import { Home as HomeIcon, LayoutGrid, MapPin, Menu, MessageCircle, Plus, Search, ShoppingBag, Truck } from 'lucide-react';
import { ASSETS, formatPrice, primaryImage, useStore } from '../store.jsx';
import heroPhoto from '../assets/Images/chocopack.png';
import { CART_HREF, CartBadge, Drip, NOTE_MAX, NOTE_PRESETS, ZonePicker, checker, isIllustration, productHref, useScrollMotion, waLink } from './shared.jsx';

const ALL = 'Tümü';
const CATEGORY_TILES = [
  { label: 'Doğum Günü', image: ASSETS.cake, bg: checker('#FFE08A', '#FFF6D6') },
  { label: 'Sevgiliye Özel', image: ASSETS.balloons, bg: checker('#FFC2D8', '#FFEEF4') },
  { label: 'Teşekkürler', image: ASSETS.flowers, bg: checker('#CDEBB5', '#F1FAE8') },
  { label: 'Çocuğa Hediyeler', image: ASSETS['teddy-gift'], bg: checker('#BFE0F2', '#EDF7FC') },
  { label: 'Kurumsal', image: ASSETS['chocolate-box'], bg: checker('#E3CDF4', '#F6ECFD') },
  { label: 'Pasta', image: ASSETS.cheesecake, bg: checker('#FFE08A', '#FFF6D6') },
];

const CARD_TONES = ['#FFE9A8', '#FFD0E0', '#D5EEC2', '#CFE8F5', '#EAD9F7'];

const STEPS = [
  { title: 'Kutunu seç', text: 'Çikolata, pasta, çiçek ya da balon; istersen hepsi bir arada.', color: '#FFD45C' },
  { title: 'Notunu yaz', text: 'İçinden geleni söyle, kutuya kişiye özel bir kart ekleyelim.', color: '#FF9EC0' },
  { title: 'Aynı gün kapıda', text: 'Denizli içi siparişler özenle paketlenip aynı gün teslim edilir.', color: '#BFE3A2' },
];

const FEATURE_TONES = ['#BFE3A2', '#FF9EC0', '#BFE0F2'];

export default function RedesignHome({ shop }) {
  const { state } = useStore();
  const { site, whatsapp } = state;
  const rootRef = useRef(null);
  const productsRef = useRef(null);
  const catsRef = useRef(null);
  const trackRef = useRef(null);

  const { products, count, total, bumpKey } = shop;
  const zones = site.branches.map((branch) => branch.name);
  const { zone, note } = shop.delivery;
  const setNote = (value) => shop.setDelivery({ note: value });
  const [category, setCategory] = useState(ALL);
  const [orderNo, setOrderNo] = useState('');

  const chips = useMemo(() => {
    const used = state.categories.filter((name) => products.some((product) => product.categories.includes(name)));
    return [ALL, ...used];
  }, [state.categories, products]);
  const shown = category === ALL ? products : products.filter((product) => product.categories.includes(category));

  useScrollMotion(rootRef, [category, shown.length]);

  const scrollTo = (ref) => () => ref.current && ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const pickCategory = (name) => {
    setCategory(chips.includes(name) ? name : ALL);
    scrollTo(productsRef)();
  };

  const trackOrder = (event) => {
    event.preventDefault();
    const value = orderNo.trim();
    if (!value) return;
    window.open(waLink(whatsapp.tracking.replace('{SIPARIS_NO}', value)), '_blank', 'noopener,noreferrer');
  };

  const tickerItems = [site.heroSubtitle, site.menuBranchLine, 'Kişiye özel not kartı'];
  const band = `${site.marquee} ✦ `.repeat(6);

  return (
    <div className="cs-page">
      <div className="cs-root" ref={rootRef}>
        <div style={{ background: '#3B1A12', color: '#FFD45C', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 500, letterSpacing: '.04em' }}>
          <div className="cs-tick" style={{ display: 'inline-flex', gap: 28, padding: '9px 0' }}>
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={index} aria-hidden={index >= tickerItems.length} style={{ display: 'inline-flex', gap: 28 }}>
                {item}
                <span aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        </div>

        <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', gap: 6, padding: '8px var(--gutter-tight)', background: '#FFD45C' }}>
          <button type="button" className="cs-iconbtn cs-mobile-only" aria-label="Kategoriler" onClick={scrollTo(catsRef)}>
            <Menu size={26} strokeWidth={2.4} aria-hidden="true" />
          </button>
          <button type="button" className="cs-display" onClick={toTop} style={{ flex: 1, textAlign: 'left', border: 0, background: 'transparent', color: '#3B1A12', fontSize: 26, padding: 0 }}>
            ChocoSite
          </button>
          <nav className="cs-desktop-nav" aria-label="Üst gezinme">
            <button type="button" onClick={scrollTo(catsRef)}>Kategoriler</button>
            <button type="button" onClick={scrollTo(productsRef)}>Ürünler</button>
            <button type="button" onClick={scrollTo(trackRef)}>Sipariş takibi</button>
            <a href={waLink(whatsapp.order)} target="_blank" rel="noreferrer">WhatsApp</a>
          </nav>
          <button type="button" className="cs-iconbtn cs-mobile-only" aria-label="Ürünlere git" onClick={scrollTo(productsRef)}>
            <Search size={24} strokeWidth={2.4} aria-hidden="true" />
          </button>
          <CartBadge count={count} bumpKey={bumpKey} />
        </header>

        <section className="cs-hero" style={{ position: 'relative', background: '#FFD45C', padding: '18px var(--gutter) 56px' }}>
          <div className="cs-rv" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: '#FFFDF8', fontSize: 13, fontWeight: 600 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: '#D8323C' }} />
            {site.menuTagline}
          </div>
          <h1 className="cs-rv cs-display cs-hero-title" style={{ '--d': '80ms', marginTop: 14, lineHeight: 1.02, letterSpacing: '-.01em' }}>
            Küçük anlar, hayatı{' '}
            <span style={{ position: 'relative', display: 'inline-block', color: '#D8323C' }}>
              tatlandırır.
              <svg aria-hidden="true" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom: -8, width: '100%', height: 12 }}>
                <path d="M2 8c20-8 30 6 50 0s30-8 50 0 30 6 50 0 30-6 46-2" fill="none" stroke="#3B1A12" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="cs-rv cs-hero-lead" style={{ '--d': '160ms', marginTop: 20, color: '#5A2E22' }}>
            {site.heroTitle}
          </p>

          <div className="cs-hero-art" style={{ position: 'relative', height: 350, marginTop: 26 }}>
            <div className="cs-hero-back cs-scallop" aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 14, width: 308, height: 308, marginLeft: -154, background: '#FF9EC0' }} />
            <div className="cs-hero-pic" style={{ position: 'absolute', left: '50%', top: 10, width: 308, height: 308, marginLeft: -154 }}>
              <div className="cs-rv cs-scallop" style={{ '--r': '-14deg', width: 308, height: 308, background: '#FFE1EC' }}>
                <img src={heroPhoto} alt="Balonlu, pastalı ve çikolatalı ChocoSite hediye kutusu" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
            <div className="cs-float-a" style={{ position: 'absolute', right: -4, top: -34, width: 116, height: 116 }}>
              <div className="cs-pop" style={{ '--d': '350ms' }}>
                <div className="cs-hero-ring">
                  <svg className="cs-spin" role="img" aria-label="Aynı gün teslimat, Denizli" width="116" height="116" viewBox="0 0 120 120" style={{ display: 'block' }}>
                    <circle cx="60" cy="60" r="60" fill="#3B1A12" />
                    <path id="cs-ring" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" fill="none" />
                    <text fontFamily="Outfit, sans-serif" fontSize="11.5" fontWeight="700" letterSpacing="2.3" fill="#FFD45C">
                      <textPath href="#cs-ring">AYNI GÜN TESLİMAT ✦ DENİZLİ ✦</textPath>
                    </text>
                    <path d="M60 76s-15-9.500-19-18c-3-6.500 1-13 7.500-13 4 0 8 2 11.500 6 3.500-4 7.500-6 11.500-6 6.500 0 10.500 6.500 7.500 13-4 8.500-19 18-19 18z" fill="#FF9EC0" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="cs-float-b" aria-hidden="true" style={{ position: 'absolute', left: -2, bottom: 26 }}>
              <svg className="cs-bob" width="54" height="54" viewBox="0 0 24 24">
                <path d="M12 1c1 6 5 10 11 11-6 1-10 5-11 11-1-6-5-10-11-11 6-1 10-5 11-11z" fill="#FFFDF8" stroke="#3B1A12" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="cs-float-a" aria-hidden="true" style={{ position: 'absolute', right: 8, bottom: 6 }}>
              <svg className="cs-bob2" width="46" height="46" viewBox="0 0 24 24">
                <path d="M12 21s-7-4.600-9.500-9C.7 8.600 2.600 4.500 6.500 4.500c2 0 3.600 1 5.500 3 1.900-2 3.500-3 5.500-3 3.900 0 5.800 4.100 4 7.500-2.500 4.400-9.500 9-9.500 9z" fill="#D8323C" stroke="#3B1A12" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="cs-rv cs-hero-cta" style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button type="button" onClick={scrollTo(productsRef)} style={{ flex: 1, minHeight: 56, border: 0, borderRadius: 999, background: '#3B1A12', color: '#FFD45C', fontWeight: 700, fontSize: 17 }}>
              Hediyeni seç
            </button>
            <a href={waLink(whatsapp.order)} target="_blank" rel="noreferrer" aria-label={site.menuWhatsappLabel} style={{ width: 56, height: 56, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#FFFDF8', border: '2px solid #3B1A12' }}>
              <MessageCircle size={26} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section style={{ position: 'relative', padding: '0 var(--gutter) 34px' }}>
          <Drip color="#FFD45C" />
          <div className="cs-rv cs-delivery-card" style={{ '--r': '3deg', marginTop: -44, position: 'relative', zIndex: 2, padding: 16, borderRadius: 26, background: '#FFFDF8', border: '2px solid #3B1A12', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontWeight: 700 }}>Nereye gönderelim?</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#2F6B2A' }}>
                <Truck size={18} aria-hidden="true" />
                Bugün teslim
              </span>
            </div>
            <ZonePicker zones={zones} zone={zone} onChange={(name) => shop.setDelivery({ zone: name })} />
          </div>
        </section>

        <section ref={catsRef} style={{ padding: '6px 0 40px', scrollMarginTop: 60 }}>
          <div style={{ padding: '0 var(--gutter)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <h2 className="cs-rv cs-display cs-h2" style={{ lineHeight: 1.05 }}>Kime, ne için?</h2>
            <span className="cs-rv cs-hand cs-mobile-only" aria-hidden="true" style={{ '--d': '120ms', fontSize: 22, color: '#D8323C', rotate: '-6deg', whiteSpace: 'nowrap' }}>
              kaydır →
            </span>
          </div>
          <div className="cs-hs cs-cats" style={{ gap: 14, scrollSnapType: 'x mandatory', padding: '20px var(--gutter) 6px', scrollPaddingLeft: 20 }}>
            {CATEGORY_TILES.map((tile, index) => (
              <button key={tile.label} type="button" className="cs-rv cs-cat-tile" onClick={() => pickCategory(tile.label)} style={{ '--d': `${index * 90}ms`, '--r': index % 2 ? '6deg' : '-6deg', scrollSnapAlign: 'start', border: 0, padding: 0, background: 'transparent', color: '#3B1A12', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ height: 216, borderRadius: 22, display: 'grid', placeItems: 'center', background: tile.bg }}>
                  <span className={index % 2 ? 'cs-arch' : 'cs-scallop'} style={{ width: 132, height: 154, overflow: 'hidden', background: '#fff', display: 'block' }}>
                    <img src={tile.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </span>
                </span>
                <span style={{ fontWeight: 600, fontSize: 17, textAlign: 'center' }}>{tile.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div data-sp="1" aria-hidden="true" className="cs-display" style={{ padding: '14px 0 26px', overflow: 'clip', fontSize: 34, whiteSpace: 'nowrap', lineHeight: 1 }}>
          <div style={{ rotate: '-3deg', background: '#3B1A12', color: '#FFD45C', padding: '12px 0', margin: '0 -30px' }}>
            <div className="cs-band-a">{band}</div>
          </div>
          <div style={{ rotate: '2deg', background: '#FF9EC0', color: '#3B1A12', padding: '12px 0', margin: '-6px -30px 0' }}>
            <div className="cs-band-b">{'çikolata ♥ pasta ♥ çiçek ♥ balon ♥ '.repeat(8)}</div>
          </div>
        </div>

        <section ref={productsRef} style={{ background: '#FFE1EC', padding: '0 var(--gutter) 56px', scrollMarginTop: 60 }}>
          <Drip color="#FFFDF8" />
          <div style={{ position: 'relative', paddingTop: 30 }}>
            <h2 className="cs-rv cs-display cs-h2" style={{ lineHeight: 1.02, maxWidth: 240 }}>{site.sectionTitle}</h2>
            <div className="cs-pop" aria-hidden="true" style={{ '--d': '200ms', position: 'absolute', right: 0, top: 16 }}>
              <div className="cs-stamp cs-hand" style={{ width: 84, height: 84, rotate: '12deg', background: '#FFD45C', display: 'grid', placeItems: 'center', textAlign: 'center', fontSize: 21, lineHeight: 0.95 }}>
                çok<br />sevilen
              </div>
            </div>
          </div>
          <div className="cs-hs" style={{ gap: 8, margin: '22px calc(var(--gutter) * -1) 0', padding: '6px var(--gutter) 10px' }}>
            {chips.map((name) => (
              <button key={name} type="button" className={`cs-chip${category === name ? ' cs-active' : ''}`} aria-pressed={category === name} onClick={() => setCategory(name)}>
                {name}
              </button>
            ))}
          </div>
          <div className="cs-grid" style={{ marginTop: 16 }}>
            {shown.map((product, index) => {
              const image = primaryImage(product);
              return (
                <article key={product.id} className="cs-rv" style={{ '--d': `${(index % 2) * 110}ms`, '--r': index % 2 ? '5deg' : '-5deg', marginTop: index % 2 ? 26 : 0, position: 'relative', background: '#FFFDF8', borderRadius: 26, padding: '10px 10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href={productHref(product)} className={index % 3 === 1 ? 'cs-scallop' : 'cs-arch'} style={{ display: 'block', aspectRatio: '1 / 1.15', overflow: 'hidden', background: CARD_TONES[index % CARD_TONES.length] }}>
                    <img src={image} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', mixBlendMode: isIllustration(image) ? 'multiply' : 'normal' }} />
                  </a>
                  {product.badge && (
                    <span className="cs-stamp" style={{ position: 'absolute', top: 2, left: 2, width: 52, height: 52, rotate: '-12deg', background: '#D8323C', color: '#fff', fontWeight: 700, fontSize: 14, display: 'grid', placeItems: 'center' }}>
                      {product.badge.split(' ')[0]}
                    </span>
                  )}
                  <h3 style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.25, minHeight: 38, padding: '0 4px' }}>
                    <a href={productHref(product)}>{product.name}</a>
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, paddingLeft: 4 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                      {product.oldPrice > 0 && <span style={{ fontSize: 13, color: '#6B4A40', textDecoration: 'line-through' }}>{formatPrice(product.oldPrice)}</span>}
                      <span className="cs-display" style={{ fontSize: 20 }}>{formatPrice(product.price)}</span>
                    </div>
                    <button type="button" className="cs-add" aria-label={`${product.name} sepete ekle`} onClick={() => shop.add(product)}>
                      <Plus size={20} strokeWidth={3} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section data-sp="1" style={{ position: 'relative', background: '#3B1A12', color: '#FFF6E0', padding: '0 var(--gutter) 60px' }}>
          <Drip color="#FFE1EC" />
          <h2 className="cs-rv cs-display cs-h2" style={{ marginTop: 40, lineHeight: 1.02, color: '#FFD45C' }}>
            Üç adımda<br />mutluluk
          </h2>
          <div className="cs-narrow" style={{ position: 'relative', marginTop: 30, display: 'flex', flexDirection: 'column', gap: 46 }}>
            <svg aria-hidden="true" viewBox="0 0 340 470" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path className="cs-draw" pathLength="1" d="M40 30C300 30 320 150 250 190S20 220 60 330s200 60 240 110" fill="none" stroke="#FF9EC0" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            {STEPS.map((step, index) => {
              const flipped = index % 2 === 1;
              return (
                <div key={step.title} className="cs-rv" style={{ '--r': flipped ? '8deg' : '-8deg', position: 'relative', display: 'flex', flexDirection: flipped ? 'row-reverse' : 'row', gap: 16, alignItems: 'center', maxWidth: 290, alignSelf: flipped ? 'flex-end' : 'flex-start', textAlign: flipped ? 'right' : 'left' }}>
                  <span className="cs-stamp cs-display" style={{ flex: 'none', width: 72, height: 72, background: step.color, color: '#3B1A12', display: 'grid', placeItems: 'center', fontSize: 32 }}>
                    {index + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: 21, fontWeight: 700 }}>{step.title}</h3>
                    <p style={{ marginTop: 4, color: '#EBD9C6' }}>{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section data-sp="1" style={{ background: '#FFD45C', padding: '0 var(--gutter) 56px', position: 'relative' }}>
          <Drip color="#3B1A12" />
          <h2 className="cs-rv cs-display cs-h2" style={{ marginTop: 40, lineHeight: 1.02 }}>İçinden geleni yaz</h2>
          <p className="cs-rv" style={{ '--d': '80ms', marginTop: 10, color: '#5A2E22' }}>Notun WhatsApp siparişine eklenir, kutunun içinde gider.</p>
          <div className="cs-split">
          <div style={{ padding: '34px 14px 30px' }}>
            <div className="cs-tilt">
              <div className="cs-rv" style={{ '--r': '-12deg', position: 'relative', background: '#FFFDF8', borderRadius: 10, padding: '26px 22px 20px', minHeight: 190, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18, boxShadow: '0 18px 0 -8px #F0B93A' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: -16, left: '50%', width: 92, height: 30, marginLeft: -46, rotate: '-3deg', background: '#FF9EC0', opacity: 0.85 }} />
                <p className="cs-hand" style={{ fontSize: 32, lineHeight: 1.1, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>
                  {note || 'İyi ki varsın.\nKüçük anlar, hayatı tatlandırır.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#6B4A40' }}>
                  <span className="cs-display" style={{ fontSize: 16, color: '#3B1A12' }}>ChocoSite</span>
                  <span>{NOTE_MAX - note.length} karakter kaldı</span>
                </div>
              </div>
            </div>
          </div>
          <div className="cs-rv" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label htmlFor="cs-note" style={{ fontWeight: 700, fontSize: 15 }}>Kart notun</label>
            <textarea id="cs-note" rows={2} maxLength={NOTE_MAX} placeholder="Örn. İyi ki doğdun canım!" value={note} onChange={(event) => setNote(event.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: 18, border: '2px solid #3B1A12', background: '#FFFDF8', color: '#3B1A12', font: '500 16px Outfit, sans-serif', resize: 'none' }} />
            <div className="cs-hs" style={{ gap: 8, margin: '0 calc(var(--gutter) * -1)', padding: '4px var(--gutter)' }}>
              {NOTE_PRESETS.map((preset) => (
                <button key={preset} type="button" className="cs-chip" onClick={() => setNote(preset)}>
                  {preset}
                </button>
              ))}
            </div>
          </div>
          </div>
        </section>

        <section data-sp="1" style={{ padding: '0 var(--gutter) 50px' }}>
          <Drip color="#FFD45C" />
          <div className="cs-split">
          <div className="cs-rv cs-arch cs-about-pic" style={{ '--r': '4deg', marginTop: 40, height: 360, overflow: 'hidden', background: '#FFE1EC' }}>
            <img className="cs-plx" src={heroPhoto} alt="ChocoSite kutusunun içindeki pasta, çikolata ve makaronlar" loading="lazy" style={{ width: '100%', height: '125%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
          <p className="cs-rv cs-hand" style={{ marginTop: 26, fontSize: 24, color: '#D8323C' }}>{site.aboutKicker}</p>
          <h2 className="cs-rv cs-display cs-h2" style={{ marginTop: 2, lineHeight: 1.05 }}>{site.aboutTitle}</h2>
          <p className="cs-rv" style={{ marginTop: 14, color: '#6B4A40' }}>{site.aboutText}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
            {site.aboutFeatures.map((feature, index) => (
              <span key={feature} className="cs-pop" style={{ '--d': `${index * 120}ms`, padding: '10px 16px', borderRadius: 999, background: FEATURE_TONES[index % FEATURE_TONES.length], fontWeight: 600, rotate: index % 2 ? '2deg' : '-3deg' }}>
                {feature}
              </span>
            ))}
          </div>
          </div>
          </div>
        </section>

        <section ref={trackRef} style={{ padding: '0 var(--gutter) 56px', scrollMarginTop: 70 }}>
          <div className="cs-rv cs-narrow" style={{ '--r': '-3deg', padding: '26px 20px', borderRadius: 30, background: checker('#E3CDF4', '#F6ECFD') }}>
            <form onSubmit={trackOrder} style={{ background: '#FFFDF8', borderRadius: 22, padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 className="cs-display cs-h2" style={{ lineHeight: 1.05 }}>Siparişim nerede?</h2>
              <p style={{ fontSize: 15, color: '#6B4A40' }}>{site.trackHint}</p>
              <label htmlFor="cs-track" style={{ fontWeight: 700, fontSize: 14 }}>Sipariş numarası</label>
              <input id="cs-track" type="text" value={orderNo} onChange={(event) => setOrderNo(event.target.value)} placeholder={site.trackPlaceholder} style={{ width: '100%', height: 52, padding: '0 16px', borderRadius: 16, border: '2px solid #3B1A12', background: '#fff', color: '#3B1A12', font: '600 16px Outfit, sans-serif' }} />
              <button type="submit" style={{ minHeight: 52, border: 0, borderRadius: 999, background: '#3B1A12', color: '#FFD45C', fontWeight: 700, fontSize: 16 }}>
                {site.trackButton}
              </button>
            </form>
          </div>
        </section>

        <footer style={{ background: '#3B1A12', color: '#FFF6E0', padding: '0 var(--gutter) 40px' }}>
          <Drip color="#FFFDF8" />
          <div className="cs-rv cs-display" style={{ marginTop: 36, fontSize: 68, lineHeight: 0.9, color: '#FFD45C', letterSpacing: '-.02em' }}>
            Choco<br />Site
          </div>
          <p style={{ marginTop: 18, color: '#EBD9C6', maxWidth: 300 }}>{site.footerTagline}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
            {site.branches.map((branch) => (
              <a key={branch.name} href={waLink(branch.text)} target="_blank" rel="noreferrer" style={{ minHeight: 44, padding: '0 16px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: '2px solid #FF9EC0', color: '#FF9EC0', fontWeight: 600 }}>
                {branch.name}
              </a>
            ))}
          </div>
          <a className="cs-display" href={`tel:+9${site.phone.replace(/\D/g, '')}`} style={{ display: 'block', marginTop: 22, fontSize: 30, color: '#FFF6E0' }}>
            {site.phone}
          </a>
          <a href="#/admin" style={{ display: 'inline-block', marginTop: 18, padding: '12px 0', color: '#EBD9C6', textDecoration: 'underline' }}>
            Yönetim
          </a>
        </footer>

        <div style={{ position: 'sticky', bottom: 0, zIndex: 40, display: 'flex', flexDirection: 'column' }}>
          {count > 0 && (
            <a href={CART_HREF} className="cs-slideup cs-minicart" style={{ margin: '0 12px 8px', minHeight: 54, padding: '0 8px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderRadius: 999, background: '#D8323C', color: '#fff', fontWeight: 700 }}>
              <span>{count} ürün · {formatPrice(total)}</span>
              <span style={{ height: 40, padding: '0 16px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: '#fff', color: '#3B1A12' }}>Sepete git</span>
            </a>
          )}
          <nav className="cs-tabbar" aria-label="Ana gezinme" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', alignItems: 'end', padding: '6px 8px 10px', background: '#FFFDF8', borderTop: '2px solid #3B1A12', borderRadius: '24px 24px 0 0' }}>
            <button type="button" className="cs-tab" onClick={toTop}>
              <HomeIcon size={24} aria-hidden="true" />
              Ana sayfa
            </button>
            <button type="button" className="cs-tab" onClick={scrollTo(catsRef)}>
              <LayoutGrid size={24} aria-hidden="true" />
              Kategoriler
            </button>
            <a className="cs-tab" href={waLink(whatsapp.order)} target="_blank" rel="noreferrer" style={{ justifyContent: 'flex-end' }}>
              <span style={{ width: 58, height: 58, marginTop: -30, borderRadius: '50%', background: '#FFD45C', border: '2px solid #3B1A12', display: 'grid', placeItems: 'center' }}>
                <MessageCircle size={28} aria-hidden="true" />
              </span>
              WhatsApp
            </a>
            <button type="button" className="cs-tab" onClick={scrollTo(trackRef)}>
              <MapPin size={24} aria-hidden="true" />
              Takip
            </button>
            <a className="cs-tab" href={CART_HREF}>
              <ShoppingBag size={24} aria-hidden="true" />
              Sepet
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}

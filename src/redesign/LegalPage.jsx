import { useRef } from 'react';
import { useStore } from '../store.jsx';
import { Drip, HOME_HREF, SubHeader, useScrollMotion } from './shared.jsx';
import { legalHref, legalLinks, legalPage } from './legalPages.js';

export default function LegalPage({ slug }) {
  const { state } = useStore();
  const rootRef = useRef(null);
  const page = legalPage(slug, state.legal, state.site);
  useScrollMotion(rootRef, [slug]);

  if (!page) {
    return (
      <div className="cs-root cs-legal" ref={rootRef} style={{ minHeight: '100vh' }}>
        <SubHeader title="ChocoSite" color="#E3CDF4" />
        <div style={{ padding: '60px var(--gutter)', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
          <p className="cs-hand" style={{ fontSize: 30 }}>Bu sayfayı bulamadık</p>
          <a className="cs-cta" href={HOME_HREF}>Ana sayfaya dön</a>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-root cs-legal" ref={rootRef} style={{ minHeight: '100vh' }}>
      <SubHeader title="ChocoSite" color="#E3CDF4" />

      <section style={{ background: '#E3CDF4', padding: '14px var(--gutter) 36px' }}>
        <h1 className="cs-rv cs-display" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.05 }}>{page.title}</h1>
      </section>

      <article style={{ padding: '0 var(--gutter) 40px' }}>
        <Drip color="#E3CDF4" />
        {page.sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="cs-legal-section">
            {section.heading && <h2>{section.heading}</h2>}
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>

      <nav aria-label="Diğer bilgilendirme sayfaları" className="cs-legal-nav" style={{ padding: '0 var(--gutter) 56px' }}>
        {legalLinks(state.legal).filter((item) => item.slug !== slug).map((item) => (
          <a key={item.slug} href={legalHref(item.slug)}>{item.title}</a>
        ))}
      </nav>
    </div>
  );
}

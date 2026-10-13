import { useState } from 'react';
import { readConsent, saveConsent } from '../analytics.js';
import { legalHref } from './legalPages.js';

export default function ConsentBanner() {
  const [open, setOpen] = useState(() => readConsent() === '');
  if (!open) return null;

  const choose = (granted) => () => {
    saveConsent(granted);
    setOpen(false);
  };

  return (
    <div className="cs-root cs-consent" role="dialog" aria-label="Çerez tercihi">
      <p>Siteyi ölçmek ve reklamlarımızı iyileştirmek için çerez kullanmak istiyoruz. Onay vermezseniz bu çerezler yüklenmez. <a href={legalHref('gizlilik')}>Ayrıntılar</a></p>
      <div className="cs-consent-actions">
        <button type="button" className="cs-chip" onClick={choose(false)}>Reddet</button>
        <button type="button" className="cs-chip cs-active" onClick={choose(true)}>Kabul et</button>
      </div>
    </div>
  );
}

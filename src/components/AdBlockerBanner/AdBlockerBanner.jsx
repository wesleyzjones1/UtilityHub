import { useState } from 'react';
import { useAdPreference } from '../../context/AdPreferenceContext';
import { useSupport } from '../../context/SupportContext';
import { useAdBlocker } from '../../hooks/useAdBlocker';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AdBlockerBanner.module.css';

export default function AdBlockerBanner() {
  const { adsHidden } = useAdPreference();
  const { openSupport } = useSupport();
  const adBlockerDetected = useAdBlocker();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('uh-adb-dismissed') === 'true'
  );

  function dismiss() {
    setDismissed(true);
    localStorage.setItem('uh-adb-dismissed', 'true');
  }

  if (adsHidden || !adBlockerDetected || dismissed) return null;

  return (
    <div className={styles.banner} role="alert" aria-live="polite">
      <p className={styles.text}>
        {t('adBlockerText')}{' '}
        <button className={styles.upgradeBtn} onClick={openSupport}>
          {t('adBlockerLinkText')}
        </button>
        {' '}{t('adBlockerSuffix')}
      </p>
      <button className={styles.dismiss} onClick={dismiss} aria-label={t('dismissAdBlockerNotice')}>
        ✕
      </button>
    </div>
  );
}

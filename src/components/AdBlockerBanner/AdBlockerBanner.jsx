import { useState } from 'react';
import { usePro } from '../../context/ProContext';
import { useAdBlocker } from '../../hooks/useAdBlocker';
import styles from './AdBlockerBanner.module.css';

export default function AdBlockerBanner({ onOpenSupport }) {
  const { isPro } = usePro();
  const adBlockerDetected = useAdBlocker();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('uh-adb-dismissed') === 'true'
  );

  function dismiss() {
    setDismissed(true);
    localStorage.setItem('uh-adb-dismissed', 'true');
  }

  if (isPro || !adBlockerDetected || dismissed) return null;

  return (
    <div className={styles.banner} role="alert" aria-live="polite">
      <p className={styles.text}>
        We noticed you're using an ad blocker. Ads keep UtilityHub free and running.
        Please consider{' '}
        <button className={styles.upgradeBtn} onClick={onOpenSupport}>
          going ad-free for $5/mo
        </button>
        {' '}to support us instead.
      </p>
      <button className={styles.dismiss} onClick={dismiss} aria-label="Dismiss ad blocker notice">
        ✕
      </button>
    </div>
  );
}

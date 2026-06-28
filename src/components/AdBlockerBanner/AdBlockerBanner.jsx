import { useState } from 'react';
import { useAdPreference } from '../../context/AdPreferenceContext';
import { useSupport } from '../../context/SupportContext';
import { useAdBlocker } from '../../hooks/useAdBlocker';
import styles from './AdBlockerBanner.module.css';

export default function AdBlockerBanner() {
  const { adsHidden } = useAdPreference();
  const { openSupport } = useSupport();
  const adBlockerDetected = useAdBlocker();
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
        Looks like you're using an ad blocker — that's completely fine. If these tools are useful,
        consider{' '}
        <button className={styles.upgradeBtn} onClick={openSupport}>
          supporting UtilityHub
        </button>
        {' '}instead.
      </p>
      <button className={styles.dismiss} onClick={dismiss} aria-label="Dismiss ad blocker notice">
        ✕
      </button>
    </div>
  );
}

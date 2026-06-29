import { useCallback, useEffect, useRef } from 'react';
import { useAdPreference } from '../../context/AdPreferenceContext';
import styles from './SupportModal.module.css';

const REPO_URL = import.meta.env.VITE_REPO_URL ?? 'https://github.com/wesleyzjones1/UtilityHub';
const SPONSORS_URL = import.meta.env.VITE_SPONSORS_URL ?? '';
const KOFI_URL = import.meta.env.VITE_KOFI_URL ?? '';
const BMAC_URL = import.meta.env.VITE_BMAC_URL ?? '';

// Only the donation links that are actually configured are shown.
const DONATIONS = [
  { key: 'sponsors', url: SPONSORS_URL, label: 'GitHub Sponsors', emoji: '💜' },
  { key: 'kofi', url: KOFI_URL, label: 'Ko-fi', emoji: '☕' },
  { key: 'bmac', url: BMAC_URL, label: 'Buy Me a Coffee', emoji: '🧋' },
].filter(d => d.url);

export default function SupportModal({ open, onClose }) {
  const { adsHidden, hideAds } = useAdPreference();
  const dialogRef = useRef(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const hasDonations = DONATIONS.length > 0;

  return (
    <div className={styles.backdrop} onClick={close} role="dialog" aria-modal="true" aria-label="Support UtilityHub">
      <div className={styles.dialog} onClick={e => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
        <button className={styles.closeX} onClick={close} aria-label="Close">✕</button>

        <div className={styles.header}>
          <span className={styles.emoji}>♥</span>
          <h2 className={styles.title}>Support UtilityHub</h2>
          <p className={styles.subtitle}>These tools are free. If they save you time, here's how you can help.</p>
        </div>

        <div className={styles.donations}>
          {hasDonations
            ? DONATIONS.map(d => (
                <a
                  key={d.key}
                  className={styles.donateBtn}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.donateEmoji} aria-hidden="true">{d.emoji}</span>
                  {d.label}
                </a>
              ))
            : (
                <a className={styles.donateBtn} href={REPO_URL} target="_blank" rel="noopener noreferrer">
                  <span className={styles.donateEmoji} aria-hidden="true">⭐</span>
                  Star on GitHub
                </a>
              )}
        </div>

        {!adsHidden && (
          <button className={styles.alreadyPaid} onClick={hideAds}>
            Already paid? Remove ads
          </button>
        )}
      </div>
    </div>
  );
}

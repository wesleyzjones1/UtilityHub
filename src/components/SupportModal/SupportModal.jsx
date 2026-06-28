import { useCallback, useEffect, useRef } from 'react';
import { useAdPreference } from '../../context/AdPreferenceContext';
import CopyButton from '../ui/CopyButton/CopyButton';
import styles from './SupportModal.module.css';

const REPO_URL = import.meta.env.VITE_REPO_URL ?? 'https://github.com/wesleyzjones1/UtilityHub';
const SPONSORS_URL = import.meta.env.VITE_SPONSORS_URL ?? '';
const KOFI_URL = import.meta.env.VITE_KOFI_URL ?? '';
const BMAC_URL = import.meta.env.VITE_BMAC_URL ?? '';

const SITE_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://utilityhub.app';

const SHARE_TEXT = 'UtilityHub — free, private, no-signup online tools that run entirely in your browser.';

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

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SITE_URL)}`;

  return (
    <div className={styles.backdrop} onClick={close} role="dialog" aria-modal="true" aria-label="Support UtilityHub">
      <div className={styles.dialog} onClick={e => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
        <button className={styles.closeX} onClick={close} aria-label="Close">✕</button>

        <div className={styles.header}>
          <span className={styles.emoji}>♥</span>
          <h2 className={styles.title}>Support UtilityHub</h2>
          <p className={styles.subtitle}>
            Every tool here is free and runs entirely in your browser — no accounts, no tracking,
            nothing uploaded. If they save you time, here are a few ways to help.
          </p>
        </div>

        {DONATIONS.length > 0 && (
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Chip in</p>
            <div className={styles.donations}>
              {DONATIONS.map(d => (
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
              ))}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Spread the word</p>
          <p className={styles.sectionHint}>Sharing is free and helps just as much.</p>
          <div className={styles.shareRow}>
            <CopyButton value={SITE_URL} label="Copy link" />
            <a className={styles.shareBtn} href={twitterUrl} target="_blank" rel="noopener noreferrer">
              Share on X
            </a>
            <a className={styles.shareBtn} href={REPO_URL} target="_blank" rel="noopener noreferrer">
              ⭐ Star on GitHub
            </a>
          </div>
        </div>

        {!adsHidden && (
          <div className={styles.adNote}>
            <p className={styles.adNoteText}>
              Prefer no ads? They're optional — you can hide them for free, no strings attached.
            </p>
            <button className={styles.hideAdsBtn} onClick={hideAds}>
              Hide ads
            </button>
          </div>
        )}

        <p className={styles.fine}>
          No account, no email, no tracking. Thank you for using UtilityHub.
        </p>
      </div>
    </div>
  );
}

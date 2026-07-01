import { useCallback, useEffect, useRef } from 'react';
import { useAdPreference } from '../../context/AdPreferenceContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './SupportModal.module.css';

const REPO_URL = import.meta.env.VITE_REPO_URL ?? 'https://github.com/wesleyzjones1/UtilityHub';
const SPONSORS_URL = import.meta.env.VITE_SPONSORS_URL ?? '';
const KOFI_URL = import.meta.env.VITE_KOFI_URL ?? 'https://ko-fi.com/wesleyzjones1';
const BMAC_URL = import.meta.env.VITE_BMAC_URL ?? '';

// Only the donation links that are actually configured are shown.
const DONATIONS = [
  { key: 'sponsors', url: SPONSORS_URL, label: 'GitHub Sponsors', emoji: '💜' },
  { key: 'kofi', url: KOFI_URL, label: 'Ko-fi', emoji: '☕' },
  { key: 'bmac', url: BMAC_URL, label: 'Buy Me a Coffee', emoji: '🧋' },
].filter(d => d.url);

export default function SupportModal({ open, onClose }) {
  const { adsHidden, hideAds } = useAdPreference();
  const { t } = useLanguage();
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
    <div className={styles.backdrop} onClick={close} role="dialog" aria-modal="true" aria-label={t('supportUtilityHub')}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
        <button className={styles.closeX} onClick={close} aria-label={t('close')}>✕</button>

        <div className={styles.header}>
          <span className={styles.emoji}>♥</span>
          <h2 className={styles.title}>{t('supportUtilityHub')}</h2>
          <p className={styles.subtitle}>{t('supportModalSubtitle')}</p>
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
                  {t('starOnGithub')}
                </a>
              )}
        </div>

        {!adsHidden && (
          <button className={styles.alreadyPaid} onClick={hideAds}>
            {t('alreadyPaidRemoveAds')}
          </button>
        )}
      </div>
    </div>
  );
}

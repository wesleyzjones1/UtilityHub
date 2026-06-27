import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './LanguageSelector.module.css';

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 3.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LanguageSelector() {
  const { currentLanguage, languages, changeLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, close]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${t('languageLabel')}: ${currentLanguage.label}`}
      >
        <span className={styles.flag} aria-hidden="true">{currentLanguage.flag}</span>
        <span className={styles.short}>{currentLanguage.short}</span>
        <ChevronIcon />
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox" aria-label={t('selectLanguage')}>
          {languages.map(lang => (
            <li key={lang.code} role="option" aria-selected={lang.code === currentLanguage.code}>
              <button
                className={`${styles.option} ${lang.code === currentLanguage.code ? styles.optionSelected : ''}`}
                onClick={() => { changeLanguage(lang.code); close(); }}
              >
                <span className={styles.optionFlag} aria-hidden="true">{lang.flag}</span>
                <span className={styles.optionLabel}>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

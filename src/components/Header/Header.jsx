import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CategoryNav from '../CategoryNav/CategoryNav';
import SearchBar from '../SearchBar/SearchBar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import FavoritesMenu from '../FavoritesMenu/FavoritesMenu';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import MobileMenu from './MobileMenu';
import { useSupport } from '../../context/SupportContext';
import { useCountdown } from '../../context/CountdownContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Header.module.css';

function HamburgerIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {open ? (
        <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      ) : (
        <>
          <line x1="2" y1="5" x2="18" y2="5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="2" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function formatTime(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function Header({ onOpenPalette }) {
  const { openSupport } = useSupport();
  const { timerState } = useCountdown();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className={styles.header} ref={headerRef}>
        <div className={styles.inner}>
          {/* Brand */}
          <Link to="/" className={styles.brand} aria-label={t('brandHomeAria')}>
            <LogoIcon />
            <span className={styles.brandName}>UtilityHub</span>
          </Link>

          {/* Countdown badge */}
          {timerState && (
            <div
              className={`${styles.timerBadge} ${timerState.phase === 'done' ? styles.timerBadgeDone : timerState.phase === 'paused' ? styles.timerBadgePaused : ''}`}
              aria-live="polite"
              aria-label={timerState.phase === 'done' ? t('timerDone') : `Timer: ${formatTime(timerState.secondsLeft)}`}
            >
              {timerState.phase === 'done' ? t('timerDone') : formatTime(timerState.secondsLeft)}
            </div>
          )}

          {/* Category tabs (desktop) */}
          <CategoryNav />

          {/* Right controls */}
          <div className={styles.controls}>
            <div className={styles.searchWrap}>
              <SearchBar onClose={closeMobile} />
            </div>
            {onOpenPalette && (
              <button
                className={styles.paletteBtn}
                onClick={onOpenPalette}
                aria-label={t('openCommandPaletteAria')}
                title={t('searchToolsShortcutTitle')}
              >
                <SearchGlyph />
                <kbd className={styles.paletteKbd}>⌘K</kbd>
              </button>
            )}
            <FavoritesMenu />
            <LanguageSelector />
            <button
              className={styles.supportBtn}
              onClick={openSupport}
              aria-label={t('supportUtilityHub')}
            >
              <span className={styles.supportHeart} aria-hidden="true">♥</span>
              <span className={styles.supportLabel}>{t('support')}</span>
            </button>
            <ThemeToggle />
            <button
              className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerActive : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu id="mobile-menu" open={mobileOpen} onClose={closeMobile} />
    </>
  );
}

function SearchGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
      <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 24C16 24 10 21 10 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.5" fill="white" />
    </svg>
  );
}

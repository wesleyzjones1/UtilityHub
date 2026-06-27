import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CategoryNav from '../CategoryNav/CategoryNav';
import SearchBar from '../SearchBar/SearchBar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import MobileMenu from './MobileMenu';
import { usePro } from '../../context/ProContext';
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

export default function Header({ onOpenSupport }) {
  const { isPro } = usePro();
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
          <Link to="/" className={styles.brand} aria-label="UtilityHub home">
            <LogoIcon />
            <span className={styles.brandName}>UtilityHub</span>
          </Link>

          {/* Category tabs (desktop) */}
          <CategoryNav />

          {/* Right controls */}
          <div className={styles.controls}>
            <div className={styles.searchWrap}>
              <SearchBar onClose={closeMobile} />
            </div>
            <LanguageSelector />
            {!isPro && (
              <button
                className={styles.removeAdsBtn}
                onClick={onOpenSupport}
                aria-label="Remove ads — support us for $5/mo"
              >
                Remove ads
              </button>
            )}
            <ThemeToggle />
            <button
              className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerActive : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
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

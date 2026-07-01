import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AdBlockerBanner from '../AdBlockerBanner/AdBlockerBanner';
import AdBanner from '../AdBanner/AdBanner';
import SupportModal from '../SupportModal/SupportModal';
import CommandPalette from '../CommandPalette/CommandPalette';
import { useSupport } from '../../context/SupportContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { pathname } = useLocation();
  const { open, closeSupport } = useSupport();
  const { t } = useLanguage();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Global Cmd/Ctrl+K toggles the command palette.
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={styles.root}>
      <a href="#main-content" className={styles.skipLink}>{t('skipToMainContent')}</a>
      <Header onOpenPalette={() => setPaletteOpen(true)} />
      <AdBlockerBanner />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
      <AdBanner />
      <Footer />
      <SupportModal open={open} onClose={closeSupport} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

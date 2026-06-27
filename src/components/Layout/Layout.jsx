import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AdBanner from '../AdBanner/AdBanner';
import AdBlockerBanner from '../AdBlockerBanner/AdBlockerBanner';
import SupportModal from '../SupportModal/SupportModal';
import styles from './Layout.module.css';

export default function Layout() {
  const { pathname } = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  function openSupport() { setSupportOpen(true); }
  function closeSupport() { setSupportOpen(false); }

  return (
    <div className={styles.root}>
      <Header onOpenSupport={openSupport} />
      <AdBlockerBanner onOpenSupport={openSupport} />
      <main className={styles.main}>
        <AdBanner />
        <Outlet />
      </main>
      <Footer />
      <SupportModal open={supportOpen} onClose={closeSupport} />
    </div>
  );
}

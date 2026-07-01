import { useSupport } from '../../context/SupportContext';
import { useLanguage } from '../../context/LanguageContext';
import InstallButton from '../InstallButton/InstallButton';
import styles from './Footer.module.css';

const REPO_URL = import.meta.env.VITE_REPO_URL ?? 'https://github.com/wesleyzjones1/UtilityHub';

export default function Footer() {
  const { openSupport } = useSupport();
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          &copy; {new Date().getFullYear()} UtilityHub
        </span>
        <div className={styles.supportGroup}>
          <span className={styles.supportText}>
            {t('footerSupportText')}
          </span>
          <button className={styles.supportBtn} onClick={openSupport} aria-label={t('supportUtilityHub')}>
            <span className={styles.supportHeart} aria-hidden="true">♥</span>
            <span>{t('support')}</span>
          </button>
        </div>
        <div className={styles.links}>
          <InstallButton />
        </div>
      </div>
    </footer>
  );
}

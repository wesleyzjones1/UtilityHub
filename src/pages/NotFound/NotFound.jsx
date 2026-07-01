import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './NotFound.module.css';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>{t('notFoundTitle')}</h1>
        <p className={styles.sub}>{t('notFoundSub')}</p>
        <Link to="/" className={styles.homeLink}>{t('notFoundGoHome')}</Link>
      </div>
    </div>
  );
}

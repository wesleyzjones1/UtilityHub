import { useAdPreference } from '../../context/AdPreferenceContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AdBanner.module.css';

export default function AdBanner() {
  const { adsHidden } = useAdPreference();
  const { t } = useLanguage();
  if (adsHidden) return null;

  return (
    <div className={styles.wrap} aria-label={t('advertisement')} role="complementary">
      <div className={styles.slot}>
        {/* Replace the inner div with real ad network code in production */}
        <div className={styles.placeholder}>{t('advertisement')}</div>
      </div>
    </div>
  );
}

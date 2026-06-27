import { usePro } from '../../context/ProContext';
import styles from './AdBanner.module.css';

export default function AdBanner() {
  const { isPro } = usePro();
  if (isPro) return null;

  return (
    <div className={styles.wrap} aria-label="Advertisement" role="complementary">
      <div className={styles.slot}>
        {/* Replace the inner div with real ad network code in production */}
        <div className={styles.placeholder}>Advertisement</div>
      </div>
    </div>
  );
}

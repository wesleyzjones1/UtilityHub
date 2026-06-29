import { useSupport } from '../../context/SupportContext';
import styles from './SupportCard.module.css';

/**
 * Subtle, honest nudge shown below a tool — a single voluntary "Support" action.
 */
export default function SupportCard() {
  const { openSupport } = useSupport();

  return (
    <aside className={styles.card}>
      <p className={styles.text}>
        <span className={styles.lead}>Free to use.</span>{' '}
        If this tool saved you time, you can support the project.
      </p>
      <button className={styles.button} onClick={openSupport} aria-label="Support UtilityHub">
        <span className={styles.heart} aria-hidden="true">♥</span> Support
      </button>
    </aside>
  );
}

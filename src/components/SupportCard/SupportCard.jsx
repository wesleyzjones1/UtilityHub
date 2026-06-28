import { useSupport } from '../../context/SupportContext';
import styles from './SupportCard.module.css';

/**
 * Subtle, honest nudge shown below a tool. No dark patterns — it states that
 * the tools are free and private, and offers a single voluntary "Support" action.
 */
export default function SupportCard() {
  const { openSupport } = useSupport();

  return (
    <aside className={styles.card}>
      <p className={styles.text}>
        <span className={styles.lead}>Free &amp; private.</span>{' '}
        This tool runs entirely in your browser — nothing is uploaded. If it helped, you can
        support the project.
      </p>
      <button className={styles.button} onClick={openSupport} aria-label="Support UtilityHub">
        <span className={styles.heart} aria-hidden="true">♥</span> Support
      </button>
    </aside>
  );
}

import PageShell from '../PageShell/PageShell';
import styles from './SinglePanelTemplate.module.css';

/**
 * Centered single-panel layout for simple input-only or output-only tools.
 * Used by: Number Base Converter, Hash Generator, Unit Converter, etc.
 */
export default function SinglePanelTemplate({
  page,
  topControls,
  actions,
  children,
}) {
  return (
    <PageShell page={page}>
      {topControls && (
        <div className={styles.topBar}>
          {topControls}
        </div>
      )}

      <div className={styles.panel}>
        {children}
      </div>

      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </PageShell>
  );
}

import styles from './previewOverrides.module.css';

/**
 * Some tools don't show their real experience on their landing screen — they
 * launch a full-screen view on submit (e.g. the countdown timer). For those we
 * render a representative snapshot of the destination instead of the launcher.
 *
 * Map of tool id → preview node. Tools not listed use their live component.
 */

function CountdownPreview() {
  const R = 52;
  const C = 2 * Math.PI * R;
  const progress = 0.68; // arbitrary "in progress" arc
  return (
    <div className={styles.countdown}>
      <div className={styles.ringWrap}>
        <svg viewBox="0 0 140 140" className={styles.ringSvg} aria-hidden="true">
          <circle cx="70" cy="70" r={R} className={styles.ringTrack} />
          <circle
            cx="70"
            cy="70"
            r={R}
            className={styles.ringProgress}
            style={{
              strokeDasharray: `${C * progress} ${C}`,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <span className={styles.time}>04:32</span>
      </div>
    </div>
  );
}

export const PREVIEW_OVERRIDES = {
  'countdown-timer': <CountdownPreview />,
};

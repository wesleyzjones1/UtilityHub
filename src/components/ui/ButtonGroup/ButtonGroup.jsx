import styles from './ButtonGroup.module.css';

/**
 * Segmented button control for picking a single value from a small set.
 * A clearer, more tactile alternative to a <select> when there are only a
 * handful of options.
 *
 * options: array of strings or { value, label, title }.
 */
export default function ButtonGroup({ label, hideLabel = false, options = [], value, onChange, className }) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {label && !hideLabel && <span className={styles.label}>{label}</span>}
      <div className={styles.buttons} role="group" aria-label={label}>
        {options.map(opt => {
          const v = typeof opt === 'string' ? opt : opt.value;
          const l = typeof opt === 'string' ? opt : opt.label;
          const title = typeof opt === 'object' ? opt.title : undefined;
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              className={`${styles.btn} ${active ? styles.btnActive : ''}`}
              onClick={() => onChange?.(v)}
              aria-pressed={active}
              title={title}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

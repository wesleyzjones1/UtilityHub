import { useId } from 'react';
import styles from './Toggle.module.css';

export default function Toggle({
  checked = false,
  onChange,
  label,
  labelPosition = 'right',
  size = 'md',
  disabled = false,
  id: externalId,
}) {
  const genId = useId();
  const id = externalId ?? genId;

  return (
    <div className={[styles.wrapper, styles[`label-${labelPosition}`]].join(' ')}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={!label ? 'Toggle' : undefined}
        disabled={disabled}
        className={[
          styles.track,
          styles[size],
          checked && styles.checked,
          disabled && styles.disabled,
        ].filter(Boolean).join(' ')}
        onClick={() => !disabled && onChange?.(!checked)}
      >
        <span className={styles.thumb} />
      </button>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
}

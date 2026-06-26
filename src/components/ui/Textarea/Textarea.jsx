import { useId } from 'react';
import styles from './Textarea.module.css';

export default function Textarea({
  label,
  value = '',
  onChange,
  placeholder,
  readOnly = false,
  mono = false,
  rows = 8,
  maxLength,
  resize = 'vertical',
  className,
  id: externalId,
  ...props
}) {
  const genId = useId();
  const id = externalId ?? genId;
  const charCount = value.length;
  const overLimit = maxLength != null && charCount > maxLength;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {label && (
        <div className={styles.header}>
          <label className={styles.label} htmlFor={id}>{label}</label>
          {maxLength != null && (
            <span className={[styles.count, overLimit && styles.countOver].filter(Boolean).join(' ')}>
              {charCount.toLocaleString()} / {maxLength.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <textarea
        id={id}
        className={[styles.textarea, mono && styles.mono].filter(Boolean).join(' ')}
        value={value}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        style={{ resize }}
        aria-label={label ? undefined : props['aria-label']}
        {...props}
      />
    </div>
  );
}

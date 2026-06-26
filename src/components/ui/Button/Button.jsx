import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  type = 'button',
  className,
  children,
  ...props
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <SpinnerIcon className={styles.spinner} />}
      {!loading && iconLeft && <span className={styles.iconLeft} aria-hidden="true">{iconLeft}</span>}
      <span>{children}</span>
      {!loading && iconRight && <span className={styles.iconRight} aria-hidden="true">{iconRight}</span>}
    </button>
  );
}

function SpinnerIcon({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeDasharray="22" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  );
}

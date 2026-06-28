import styles from './PrivacyBadge.module.css';

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Compact trust signal: reinforces that tools run client-side and upload nothing.
 */
export default function PrivacyBadge({ className = '' }) {
  return (
    <span className={`${styles.badge} ${className}`}>
      <LockIcon />
      Runs entirely in your browser — nothing is uploaded.
    </span>
  );
}

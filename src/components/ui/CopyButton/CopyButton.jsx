import { useClipboard } from '../../../hooks/useClipboard';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './CopyButton.module.css';

export default function CopyButton({ value = '', size = 'md', label, className }) {
  const { copied, copy } = useClipboard();
  const { t } = useLanguage();
  const copyLabel = label ?? t('copy');
  const copiedLabel = t('copied');

  return (
    <button
      type="button"
      className={[styles.btn, styles[size], copied && styles.copied, className].filter(Boolean).join(' ')}
      onClick={() => copy(value)}
      aria-label={copied ? copiedLabel : copyLabel}
      title={copied ? copiedLabel : copyLabel}
      disabled={!value}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{copied ? copiedLabel : copyLabel}</span>
    </button>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4.5" y="1.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2.5 4.5H2A1.5 1.5 0 0 0 .5 6v6A1.5 1.5 0 0 0 2 13.5h6A1.5 1.5 0 0 0 9.5 12v-.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePro } from '../../context/ProContext';
import styles from './SupportModal.module.css';

const PAYMENT_LINK = import.meta.env.VITE_PAYMENT_LINK ?? 'https://buy.stripe.com/your_link_here';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SupportModal({ open, onClose }) {
  const { isPro, activatePro } = usePro();
  const [paymentStarted, setPaymentStarted] = useState(false);
  const dialogRef = useRef(null);

  const close = useCallback(() => {
    setPaymentStarted(false);
    onClose();
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Trap focus inside modal
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  if (isPro) {
    return (
      <div className={styles.backdrop} onClick={close} role="dialog" aria-modal="true" aria-label="Support modal">
        <div className={styles.dialog} onClick={e => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
          <div className={styles.proState}>
            <span className={styles.proIcon}>🎉</span>
            <h2 className={styles.proTitle}>You're ad-free!</h2>
            <p className={styles.proSub}>Thank you for supporting UtilityHub.</p>
            <button className={styles.closeBtn} onClick={close}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  function handlePayment() {
    setPaymentStarted(true);
    window.open(PAYMENT_LINK, '_blank', 'noopener,noreferrer');
  }

  function handleActivate() {
    activatePro();
    close();
  }

  return (
    <div className={styles.backdrop} onClick={close} role="dialog" aria-modal="true" aria-label="Support modal">
      <div className={styles.dialog} onClick={e => e.stopPropagation()} ref={dialogRef} tabIndex={-1}>
        <button className={styles.closeX} onClick={close} aria-label="Close">✕</button>

        <div className={styles.header}>
          <span className={styles.emoji}>✨</span>
          <h2 className={styles.title}>Go ad-free for $5/mo</h2>
          <p className={styles.subtitle}>Support UtilityHub and browse without any ads.</p>
        </div>

        <ul className={styles.benefits}>
          <li><CheckIcon /> No ads anywhere on the site</li>
          <li><CheckIcon /> Cancel anytime</li>
          <li><CheckIcon /> No account required</li>
          <li><CheckIcon /> Helps keep all tools free</li>
        </ul>

        {!paymentStarted ? (
          <button className={styles.payBtn} onClick={handlePayment}>
            Continue to payment →
          </button>
        ) : (
          <div className={styles.postPayment}>
            <p className={styles.postPaymentText}>
              Complete the payment in the tab that opened, then click below.
            </p>
            <button className={styles.activateBtn} onClick={handleActivate}>
              I've paid — activate ad-free
            </button>
            <button className={styles.retryLink} onClick={handlePayment}>
              Open payment page again
            </button>
          </div>
        )}

        <p className={styles.fine}>
          Your ad-free status is stored in this browser. No account or email needed.
        </p>
      </div>
    </div>
  );
}

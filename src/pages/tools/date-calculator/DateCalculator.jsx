import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './DateCalculator.module.css';

const HOW_TO_USE = [
  'Select a start date and an end date.',
  'The difference is calculated instantly in days, weeks, months, and years.',
  'Dates work in either order — the absolute difference is always shown.',
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function calcDiff(start, end) {
  const a = new Date(start);
  const b = new Date(end);
  const msPerDay = 86400000;
  return Math.abs(Math.round((b - a) / msPerDay));
}

function humanSummary(days) {
  const weeks = Math.floor(days / 7);
  const remDays = days % 7;
  if (weeks === 0) return `${days} day${days !== 1 ? 's' : ''}`;
  return `${days} day${days !== 1 ? 's' : ''} (${weeks} week${weeks !== 1 ? 's' : ''}, ${remDays} day${remDays !== 1 ? 's' : ''})`;
}

export default function DateCalculator({ page }) {
  const today = todayStr();
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(addDays(today, 30));

  const days = start && end ? calcDiff(start, end) : null;
  const weeks = days !== null ? (days / 7).toFixed(2) : null;
  const months = days !== null ? (days / 30.44).toFixed(2) : null;
  const years = days !== null ? (days / 365.25).toFixed(4) : null;

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.inputs}>
          <label className={styles.fieldLabel}>
            Start date
            <input
              type="date"
              className={styles.dateInput}
              value={start}
              onChange={e => setStart(e.target.value)}
              aria-label="Start date"
            />
          </label>
          <span className={styles.arrow} aria-hidden="true">→</span>
          <label className={styles.fieldLabel}>
            End date
            <input
              type="date"
              className={styles.dateInput}
              value={end}
              onChange={e => setEnd(e.target.value)}
              aria-label="End date"
            />
          </label>
        </div>

        {days !== null && (
          <div className={styles.card}>
            <div className={styles.mainResult}>
              <span className={styles.daysNumber}>{days}</span>
              <span className={styles.daysLabel}>days</span>
              <CopyButton value={String(days)} label="Copy days" />
            </div>
            <p className={styles.summary}>{humanSummary(days)}</p>
            <div className={styles.breakdown}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{weeks}</span>
                <span className={styles.statLabel}>weeks</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{months}</span>
                <span className={styles.statLabel}>months</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{years}</span>
                <span className={styles.statLabel}>years</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

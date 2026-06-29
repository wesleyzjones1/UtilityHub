import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './UnixTimestamp.module.css';

const HOW_TO_USE = [
  'Enter a Unix timestamp (seconds since 1970-01-01 UTC) to see the human-readable date.',
  'Or pick a date and time to get the corresponding Unix timestamp.',
  'Click "Current timestamp" to load the current epoch second.',
];

function toLocalDatetimeValue(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function nowEpoch() {
  return Math.floor(Date.now() / 1000);
}

export default function UnixTimestamp({ page }) {
  const [epoch, setEpoch] = useState(String(nowEpoch()));
  const [datetime, setDatetime] = useState(toLocalDatetimeValue(new Date()));

  const epochNum = parseInt(epoch, 10);
  const epochDate = !isNaN(epochNum) ? new Date(epochNum * 1000) : null;
  const utcString = epochDate ? epochDate.toUTCString() : '';
  const localString = epochDate ? epochDate.toLocaleString() : '';

  const datetimeEpochMs = datetime ? new Date(datetime).getTime() : NaN;
  const datetimeEpochSec = !isNaN(datetimeEpochMs) ? Math.floor(datetimeEpochMs / 1000) : null;
  const datetimeEpochMs2 = !isNaN(datetimeEpochMs) ? datetimeEpochMs : null;

  function handleCurrentTimestamp() {
    setEpoch(String(nowEpoch()));
  }

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Epoch to Date</h2>
          <div className={styles.inputRow}>
            <input
              type="number"
              className={styles.input}
              value={epoch}
              onChange={e => setEpoch(e.target.value)}
              aria-label="Unix timestamp"
              placeholder="1700000000"
            />
            <button
              type="button"
              className={styles.nowBtn}
              onClick={handleCurrentTimestamp}
            >
              Current timestamp
            </button>
          </div>
          {epochDate && (
            <div className={styles.results}>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>UTC</span>
                <span className={styles.resultValue}>{utcString}</span>
                <CopyButton value={utcString} label="Copy UTC" />
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Local</span>
                <span className={styles.resultValue}>{localString}</span>
                <CopyButton value={localString} label="Copy local" />
              </div>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Date to Epoch</h2>
          <input
            type="datetime-local"
            className={styles.input}
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
            aria-label="Date and time"
          />
          {datetimeEpochSec !== null && (
            <div className={styles.results}>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Seconds</span>
                <span className={styles.resultValue}>{datetimeEpochSec}</span>
                <CopyButton value={String(datetimeEpochSec)} label="Copy seconds" />
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Milliseconds</span>
                <span className={styles.resultValue}>{datetimeEpochMs2}</span>
                <CopyButton value={String(datetimeEpochMs2)} label="Copy milliseconds" />
              </div>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

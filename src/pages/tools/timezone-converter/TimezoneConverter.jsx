import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './TimezoneConverter.module.css';

const HOW_TO_USE = [
  'Pick a date and time to convert.',
  'Select the source timezone ("From") and the target timezone ("To").',
  'The converted time updates instantly.',
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Pacific/Honolulu',
];

function toLocalDatetimeValue(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function convertTimezone(datetimeLocal, fromTz, toTz) {
  if (!datetimeLocal) return '';
  try {
    // Parse the datetime-local value as if it's in the "from" timezone
    const [datePart, timePart] = datetimeLocal.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    // Create a formatter that gives us the UTC offset for the "from" timezone at the given wall-clock time
    const fmtFrom = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });

    // Binary-search the UTC instant whose wall-clock time in fromTz matches the input.
    // Start with a naive UTC estimate.
    let utcMs = Date.UTC(year, month - 1, day, hour, minute, 0);

    for (let i = 0; i < 3; i++) {
      const parts = fmtFrom.formatToParts(new Date(utcMs));
      const get = t => Number(parts.find(p => p.type === t)?.value ?? 0);
      const wallHour = get('hour') === 24 ? 0 : get('hour');
      const diffMs =
        (hour - wallHour) * 3600000 +
        (minute - get('minute')) * 60000;
      utcMs += diffMs;
    }

    return new Intl.DateTimeFormat('en-US', {
      timeZone: toTz,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      hour12: true,
    }).format(new Date(utcMs));
  } catch {
    return '';
  }
}

export default function TimezoneConverter({ page }) {
  const [datetime, setDatetime] = useState(toLocalDatetimeValue(new Date()));
  const [fromTz, setFromTz] = useState('UTC');
  const [toTz, setToTz] = useState('America/New_York');

  const result = convertTimezone(datetime, fromTz, toTz);

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.fields}>
          <label className={styles.fieldLabel}>
            Date and time
            <input
              type="datetime-local"
              className={styles.input}
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
              aria-label="Date and time"
            />
          </label>

          <div className={styles.tzRow}>
            <label className={styles.fieldLabel}>
              From timezone
              <select
                className={styles.select}
                value={fromTz}
                onChange={e => setFromTz(e.target.value)}
                aria-label="From timezone"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </label>

            <span className={styles.arrow} aria-hidden="true">→</span>

            <label className={styles.fieldLabel}>
              To timezone
              <select
                className={styles.select}
                value={toTz}
                onChange={e => setToTz(e.target.value)}
                aria-label="To timezone"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {result && (
          <div className={styles.resultCard}>
            <span className={styles.resultValue}>{result}</span>
            <CopyButton value={result} label="Copy result" />
          </div>
        )}
      </div>
    </PageShell>
  );
}

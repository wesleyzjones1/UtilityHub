import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './UnixTimestamp.module.css';

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
  const { t } = useLanguage();

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
    <PageShell page={page}>
      <div className={styles.layout}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('tsEpochToDate')}</h2>
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
              {t('tsCurrentTimestamp')}
            </button>
          </div>
          {epochDate && (
            <div className={styles.results}>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>{t('tsUTC')}</span>
                <span className={styles.resultValue}>{utcString}</span>
                <CopyButton value={utcString} label={t('tsCopyUTC')} />
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>{t('tsLocal')}</span>
                <span className={styles.resultValue}>{localString}</span>
                <CopyButton value={localString} label={t('tsCopyLocal')} />
              </div>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('tsDateToEpoch')}</h2>
          <input
            type="datetime-local"
            className={styles.input}
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
            aria-label={t('tzDateAndTime')}
          />
          {datetimeEpochSec !== null && (
            <div className={styles.results}>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>{t('tsSeconds')}</span>
                <span className={styles.resultValue}>{datetimeEpochSec}</span>
                <CopyButton value={String(datetimeEpochSec)} label={t('tsCopySeconds')} />
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>{t('tsMilliseconds')}</span>
                <span className={styles.resultValue}>{datetimeEpochMs2}</span>
                <CopyButton value={String(datetimeEpochMs2)} label={t('tsCopyMilliseconds')} />
              </div>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

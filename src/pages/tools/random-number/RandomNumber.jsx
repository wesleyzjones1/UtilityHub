import { useRef, useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './RandomNumber.module.css';

export default function RandomNumber({ page }) {
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const countRef = useRef(null);
  const typeRef = useRef(null);
  const [result, setResult] = useState('');
  const { t } = useLanguage();

  function generate() {
    const min = parseFloat(minRef.current.value);
    const max = parseFloat(maxRef.current.value);
    const count = Math.min(100, Math.max(1, parseInt(countRef.current.value, 10) || 1));
    const type = typeRef.current.value;

    const nums = Array.from({ length: count }, () => {
      if (type === 'integer') {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    });

    setResult(nums.join('\n'));
  }

  return (
    <PageShell page={page}>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <div className={styles.controlGrid}>
            <label className={styles.fieldLabel}>
              <span>{t('randomMin')}</span>
              <input
                ref={minRef}
                type="number"
                className={styles.input}
                aria-label={t('randomMin')}
                defaultValue="1"
              />
            </label>
            <label className={styles.fieldLabel}>
              <span>{t('randomMax')}</span>
              <input
                ref={maxRef}
                type="number"
                className={styles.input}
                aria-label={t('randomMax')}
                defaultValue="100"
              />
            </label>
            <label className={styles.fieldLabel}>
              <span>{t('count')}</span>
              <input
                ref={countRef}
                type="number"
                className={styles.input}
                aria-label={t('count')}
                min="1"
                max="100"
                defaultValue="1"
              />
            </label>
            <label className={styles.fieldLabel}>
              <span>{t('type')}</span>
              <select ref={typeRef} className={styles.select} aria-label={t('type')}>
                <option value="integer">{t('randomInteger')}</option>
                <option value="decimal">{t('randomDecimal')}</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            className={styles.generateBtn}
            aria-label={t('generate')}
            onClick={generate}
          >
            {t('generate')}
          </button>
        </div>

        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <span className={styles.resultLabel}>{t('result')}</span>
            {result && <CopyButton value={result} size="sm" />}
          </div>
          {result ? (
            <pre className={styles.resultText}>{result}</pre>
          ) : (
            <p className={styles.placeholder}>{t('randomClickGenerate')}</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}

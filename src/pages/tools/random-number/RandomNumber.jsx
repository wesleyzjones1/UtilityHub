import { useRef, useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './RandomNumber.module.css';

const HOW_TO_USE = [
  'Set a minimum and maximum value for the range.',
  'Choose how many numbers to generate (up to 100).',
  'Select integer or decimal output, then click Generate.',
];

export default function RandomNumber({ page }) {
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const countRef = useRef(null);
  const typeRef = useRef(null);
  const [result, setResult] = useState('');

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
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <div className={styles.controlGrid}>
            <label className={styles.fieldLabel}>
              <span>Min</span>
              <input
                ref={minRef}
                type="number"
                className={styles.input}
                aria-label="Minimum"
                defaultValue="1"
              />
            </label>
            <label className={styles.fieldLabel}>
              <span>Max</span>
              <input
                ref={maxRef}
                type="number"
                className={styles.input}
                aria-label="Maximum"
                defaultValue="100"
              />
            </label>
            <label className={styles.fieldLabel}>
              <span>Count</span>
              <input
                ref={countRef}
                type="number"
                className={styles.input}
                aria-label="Count"
                min="1"
                max="100"
                defaultValue="1"
              />
            </label>
            <label className={styles.fieldLabel}>
              <span>Type</span>
              <select ref={typeRef} className={styles.select} aria-label="Type">
                <option value="integer">Integer</option>
                <option value="decimal">Decimal (2 places)</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            className={styles.generateBtn}
            aria-label="Generate numbers"
            onClick={generate}
          >
            Generate
          </button>
        </div>

        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <span className={styles.resultLabel}>Result</span>
            {result && <CopyButton value={result} size="sm" />}
          </div>
          {result ? (
            <pre className={styles.resultText}>{result}</pre>
          ) : (
            <p className={styles.placeholder}>Click Generate to get numbers</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}

import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import { percentOf, formatNumber } from './percentageUtils';
import styles from './PercentageCalc.module.css';

const HINT_PERCENT = '15';
const HINT_VALUE = '200';

export default function PercentageCalc({ page }) {
  const [percent, setPercent] = useState('');
  const [value, setValue] = useState('');

  const hasInput = percent !== '' && value !== '';
  // Fall back to the placeholder example (15% of 200) as a muted hint so the
  // result area always shows a real answer instead of a bare dash.
  const result = formatNumber(
    percentOf(hasInput ? percent : HINT_PERCENT, hasInput ? value : HINT_VALUE)
  );

  return (
    <PageShell page={page}>
      <div className={styles.layout}>
        <div className={styles.calc}>
          <div className={styles.calcRow}>
            <input
              type="number"
              className={styles.input}
              value={percent}
              onChange={e => setPercent(e.target.value)}
              aria-label="Percent"
              placeholder="15"
            />
            <span className={styles.word}>% of</span>
            <input
              type="number"
              className={styles.input}
              value={value}
              onChange={e => setValue(e.target.value)}
              aria-label="Value"
              placeholder="200"
            />
          </div>
          <div className={styles.result}>
            <span className={styles.resultLabel}>=</span>
            <span className={`${styles.resultValue} ${hasInput ? '' : styles.resultHint}`}>
              {result}
            </span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

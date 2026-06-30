import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import { percentOf, formatNumber } from './percentageUtils';
import styles from './PercentageCalc.module.css';

const HOW_TO_USE = [
  'Enter the percentage you want.',
  'Enter the number it applies to.',
  'The answer updates as you type — e.g. 15% of 200 is 30.',
];

export default function PercentageCalc({ page }) {
  const [percent, setPercent] = useState('');
  const [value, setValue] = useState('');

  const hasInput = percent !== '' && value !== '';
  const result = hasInput ? formatNumber(percentOf(percent, value)) : '—';

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
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
            <span className={styles.resultValue}>{result}</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

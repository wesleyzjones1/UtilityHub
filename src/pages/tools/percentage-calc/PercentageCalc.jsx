import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import { percentOf, whatPercent, percentChange, formatNumber } from './percentageUtils';
import styles from './PercentageCalc.module.css';

const HOW_TO_USE = [
  'Pick the calculator that matches your question.',
  'Type the two numbers — the answer updates as you type.',
  'Leave a field blank to clear that calculator.',
];

function Calc({ title, result, children }) {
  return (
    <div className={styles.calc}>
      <p className={styles.calcTitle}>{title}</p>
      <div className={styles.calcRow}>{children}</div>
      <div className={styles.result}>
        <span className={styles.resultLabel}>=</span>
        <span className={styles.resultValue}>{result}</span>
      </div>
    </div>
  );
}

function NumInput({ value, onChange, label, placeholder }) {
  return (
    <input
      type="number"
      className={styles.input}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={label}
      placeholder={placeholder}
    />
  );
}

export default function PercentageCalc({ page }) {
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [c1, setC1] = useState('');
  const [c2, setC2] = useState('');

  const r1 = a1 !== '' && a2 !== '' ? formatNumber(percentOf(a1, a2)) : '—';
  const r2 = b1 !== '' && b2 !== '' ? `${formatNumber(whatPercent(b1, b2))}%` : '—';
  const r3 = c1 !== '' && c2 !== '' ? `${formatNumber(percentChange(c1, c2))}%` : '—';

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <Calc title="What is X% of Y?" result={r1}>
          <NumInput value={a1} onChange={setA1} label="Percent" placeholder="10" />
          <span className={styles.word}>% of</span>
          <NumInput value={a2} onChange={setA2} label="Value" placeholder="200" />
        </Calc>

        <Calc title="X is what percent of Y?" result={r2}>
          <NumInput value={b1} onChange={setB1} label="Part" placeholder="20" />
          <span className={styles.word}>of</span>
          <NumInput value={b2} onChange={setB2} label="Whole" placeholder="200" />
        </Calc>

        <Calc title="Percent change from X to Y?" result={r3}>
          <NumInput value={c1} onChange={setC1} label="From" placeholder="100" />
          <span className={styles.word}>→</span>
          <NumInput value={c2} onChange={setC2} label="To" placeholder="150" />
        </Calc>
      </div>
    </PageShell>
  );
}

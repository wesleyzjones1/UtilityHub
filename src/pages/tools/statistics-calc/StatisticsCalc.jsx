import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import { parseNumbers, mean, median, mode, variance, stddev } from './statisticsUtils';
import styles from './StatisticsCalc.module.css';

const HOW_TO_USE = [
  'Enter numbers separated by commas, spaces, or new lines.',
  'Statistics update automatically as you type.',
];

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return String(parseFloat(n.toPrecision(4)));
}

export default function StatisticsCalc({ page }) {
  const [input, setInput] = useState('');

  const nums = parseNumbers(input);
  const hasData = nums.length > 0;

  const stats = hasData
    ? {
        count: nums.length,
        sum: nums.reduce((a, b) => a + b, 0),
        mean: mean(nums),
        median: median(nums),
        mode: mode(nums),
        min: Math.min(...nums),
        max: Math.max(...nums),
        range: Math.max(...nums) - Math.min(...nums),
        variance: variance(nums),
        stddev: stddev(nums),
      }
    : null;

  const rows = [
    { label: 'Count', value: hasData ? stats.count : '—' },
    { label: 'Sum', value: hasData ? fmt(stats.sum) : '—' },
    { label: 'Mean', value: hasData ? fmt(stats.mean) : '—' },
    { label: 'Median', value: hasData ? fmt(stats.median) : '—' },
    { label: 'Mode', value: hasData ? (stats.mode ? stats.mode.map(fmt).join(', ') : 'N/A') : '—' },
    { label: 'Min', value: hasData ? fmt(stats.min) : '—' },
    { label: 'Max', value: hasData ? fmt(stats.max) : '—' },
    { label: 'Range', value: hasData ? fmt(stats.range) : '—' },
    { label: 'Variance', value: hasData ? fmt(stats.variance) : '—' },
    { label: 'Std Dev', value: hasData ? fmt(stats.stddev) : '—' },
  ];

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.inputPanel}>
          <Textarea
            value={input}
            onChange={setInput}
            aria-label="Numbers"
            placeholder="Enter numbers separated by commas or new lines…"
            rows={6}
          />
        </div>

        <div className={styles.statsPanel}>
          {rows.map(({ label, value }) => (
            <div key={label} className={styles.statRow}>
              <span className={styles.statLabel}>{label}</span>
              <span className={styles.statValue}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import { useLanguage } from '../../../context/LanguageContext';
import { parseNumbers, mean, median, mode, variance, stddev } from './statisticsUtils';
import styles from './StatisticsCalc.module.css';

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return String(parseFloat(n.toPrecision(4)));
}

export default function StatisticsCalc({ page }) {
  const [input, setInput] = useState('');
  const { t } = useLanguage();

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
    { label: t('statsCount'), value: hasData ? stats.count : '—' },
    { label: t('statsSum'), value: hasData ? fmt(stats.sum) : '—' },
    { label: t('statsMean'), value: hasData ? fmt(stats.mean) : '—' },
    { label: t('statsMedian'), value: hasData ? fmt(stats.median) : '—' },
    { label: t('statsMode'), value: hasData ? (stats.mode ? stats.mode.map(fmt).join(', ') : 'N/A') : '—' },
    { label: t('statsMin'), value: hasData ? fmt(stats.min) : '—' },
    { label: t('statsMax'), value: hasData ? fmt(stats.max) : '—' },
    { label: t('statsRange'), value: hasData ? fmt(stats.range) : '—' },
    { label: t('statsVariance'), value: hasData ? fmt(stats.variance) : '—' },
    { label: t('statsStdDev'), value: hasData ? fmt(stats.stddev) : '—' },
  ];

  return (
    <PageShell page={page}>
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

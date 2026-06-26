import { useState, useMemo } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { wordFrequency } from '../../../utils/textTransforms';
import styles from './WordFrequency.module.css';

const HOW_TO_USE = [
  'Paste or type your text in the textarea.',
  'The word frequency table updates automatically.',
  'Toggle "Exclude stop words" to filter out common words like "the", "and", "of".',
  'Toggle "Case sensitive" to count capitalized and lowercase forms separately.',
];

export default function WordFrequency({ page }) {
  const [text, setText] = useState('');
  const [excludeStop, setExcludeStop] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const results = useMemo(
    () => wordFrequency(text, { caseSensitive, excludeStopWords: excludeStop }),
    [text, caseSensitive, excludeStop]
  );

  const maxCount = results[0]?.count ?? 1;

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <Textarea
        value={text}
        onChange={setText}
        placeholder="Paste or type your text here…"
        rows={8}
        resize="vertical"
        aria-label="Text to analyze"
      />

      <div className={styles.controls}>
        <Toggle
          checked={excludeStop}
          onChange={setExcludeStop}
          label="Exclude stop words"
        />
        <Toggle
          checked={caseSensitive}
          onChange={setCaseSensitive}
          label="Case sensitive"
        />
        {results.length > 0 && (
          <span className={styles.resultCount}>
            {results.length} unique word{results.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {results.length > 0 ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Word</th>
                <th className={styles.th}>Count</th>
                <th className={styles.th}>Frequency</th>
                <th className={styles.th} aria-label="Bar chart"></th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ word, count, pct }, i) => (
                <tr key={word} className={styles.row}>
                  <td className={styles.rank}>{i + 1}</td>
                  <td className={styles.word}>{word}</td>
                  <td className={styles.count}>{count}</td>
                  <td className={styles.pct}>{pct}%</td>
                  <td className={styles.barCell}>
                    <div
                      className={styles.bar}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                      role="presentation"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : text ? (
        <p className={styles.empty}>No words found.</p>
      ) : null}
    </PageShell>
  );
}

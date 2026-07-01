import { useState, useMemo } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { useLanguage } from '../../../context/LanguageContext';
import { wordFrequency } from '../../../utils/textTransforms';
import styles from './WordFrequency.module.css';

export default function WordFrequency({ page }) {
  const [text, setText] = useState('');
  const [excludeStop, setExcludeStop] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const { t } = useLanguage();

  const results = useMemo(
    () => wordFrequency(text, { caseSensitive, excludeStopWords: excludeStop }),
    [text, caseSensitive, excludeStop]
  );

  const maxCount = results[0]?.count ?? 1;

  return (
    <PageShell page={page}>
      <div className={styles.controls}>
        <Toggle
          checked={excludeStop}
          onChange={setExcludeStop}
          label={t('freqExcludeStop')}
        />
        <Toggle
          checked={caseSensitive}
          onChange={setCaseSensitive}
          label={t('freqCaseSensitive')}
        />
        {results.length > 0 && (
          <span className={styles.resultCount}>
            {results.length} unique word{results.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <Textarea
        value={text}
        onChange={setText}
        placeholder="Paste or type your text here…"
        rows={8}
        resize="vertical"
        aria-label="Text to analyze"
      />

      {results.length > 0 ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>{t('freqWord')}</th>
                <th className={styles.th}>{t('count')}</th>
                <th className={styles.th}>{t('freqFrequency')}</th>
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
        <p className={styles.empty}>{t('freqNoWords')}</p>
      ) : null}
    </PageShell>
  );
}

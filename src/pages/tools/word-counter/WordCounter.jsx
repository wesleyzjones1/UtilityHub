import { useState, useMemo } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import { useLanguage } from '../../../context/LanguageContext';
import { countText } from '../../../utils/textTransforms';
import styles from './WordCounter.module.css';

const STAT_KEYS = [
  { key: 'chars',        tKey: 'wcChars' },
  { key: 'charsNoSpaces', tKey: 'wcCharsNoSpaces' },
  { key: 'words',        tKey: 'wcWords' },
  { key: 'uniqueWords',  tKey: 'wcUniqueWords' },
  { key: 'sentences',    tKey: 'wcSentences' },
  { key: 'paragraphs',   tKey: 'wcParagraphs' },
  { key: 'lines',        tKey: 'wcLines' },
];

export default function WordCounter({ page }) {
  const [text, setText] = useState('');
  const stats = useMemo(() => countText(text), [text]);
  const { t } = useLanguage();

  return (
    <PageShell page={page}>
      <Textarea
        value={text}
        onChange={setText}
        placeholder="Paste or type your text here…"
        rows={10}
        resize="vertical"
        aria-label="Text to count"
      />

      <div className={styles.grid}>
        {STAT_KEYS.map(({ key, tKey }) => (
          <div key={key} className={styles.card}>
            <span className={styles.value}>
              {stats[key].toLocaleString()}
            </span>
            <span className={styles.label}>{t(tKey)}</span>
          </div>
        ))}
        <div className={styles.card}>
          <span className={styles.value}>
            ~{stats.readingTime} min
          </span>
          <span className={styles.label}>{t('wcReadingTime')}</span>
        </div>
      </div>
    </PageShell>
  );
}

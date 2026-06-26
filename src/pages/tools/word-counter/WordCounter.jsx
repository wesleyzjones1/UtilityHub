import { useState, useMemo } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import { countText } from '../../../utils/textTransforms';
import styles from './WordCounter.module.css';

const HOW_TO_USE = [
  'Paste or type your text in the textarea.',
  'Statistics update instantly as you type.',
  'Reading time is estimated at 200 words per minute.',
];

const STATS = [
  { key: 'chars',        label: 'Characters' },
  { key: 'charsNoSpaces', label: 'Chars (no spaces)' },
  { key: 'words',        label: 'Words' },
  { key: 'uniqueWords',  label: 'Unique words' },
  { key: 'sentences',    label: 'Sentences' },
  { key: 'paragraphs',   label: 'Paragraphs' },
  { key: 'lines',        label: 'Lines' },
];

export default function WordCounter({ page }) {
  const [text, setText] = useState('');
  const stats = useMemo(() => countText(text), [text]);

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <Textarea
        value={text}
        onChange={setText}
        placeholder="Paste or type your text here…"
        rows={10}
        resize="vertical"
        aria-label="Text to count"
      />

      <div className={styles.grid}>
        {STATS.map(({ key, label }) => (
          <div key={key} className={styles.card}>
            <span className={styles.value}>
              {stats[key].toLocaleString()}
            </span>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
        <div className={styles.card}>
          <span className={styles.value}>
            ~{stats.readingTime} min
          </span>
          <span className={styles.label}>Reading time</span>
        </div>
      </div>
    </PageShell>
  );
}

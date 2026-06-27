import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './TextDiff.module.css';

const HOW_TO_USE = [
  'Paste the original text in the left panel.',
  'Paste the modified text in the right panel.',
  'The diff updates automatically — green lines are additions, red lines are removals.',
];

function diffLines(original, modified) {
  const aLines = original.split('\n');
  const bLines = modified.split('\n');
  const m = aLines.length;
  const n = bLines.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = aLines[i - 1] === bLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const result = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: 'same', text: aLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'add', text: bLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'remove', text: aLines[i - 1] });
      i--;
    }
  }
  return result;
}

export default function TextDiff({ page }) {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');

  const diff = diffLines(original, modified);
  const additions = diff.filter(l => l.type === 'add').length;
  const deletions = diff.filter(l => l.type === 'remove').length;

  const unifiedText = diff
    .map(l => (l.type === 'add' ? '+' : l.type === 'remove' ? '−' : ' ') + l.text)
    .join('\n');

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.inputs}>
          <div className={styles.inputPanel}>
            <span className={styles.panelLabel}>Original</span>
            <Textarea
              value={original}
              onChange={setOriginal}
              aria-label="Original text"
              placeholder="Paste original text here…"
              rows={10}
            />
          </div>
          <div className={styles.inputPanel}>
            <span className={styles.panelLabel}>Modified</span>
            <Textarea
              value={modified}
              onChange={setModified}
              aria-label="Modified text"
              placeholder="Paste modified text here…"
              rows={10}
            />
          </div>
        </div>

        <div className={styles.diffPanel}>
          <div className={styles.diffHeader}>
            <span className={styles.stats}>
              <span className={styles.additions}>{additions} addition{additions !== 1 ? 's' : ''}</span>
              <span className={styles.sep}>,</span>
              <span className={styles.deletions}>{deletions} deletion{deletions !== 1 ? 's' : ''}</span>
            </span>
            {(additions > 0 || deletions > 0) && <CopyButton value={unifiedText} size="sm" />}
          </div>
          <div className={styles.diffOutput}>
            {diff.length === 0 ? (
              <div className={styles.emptyLine}> </div>
            ) : (
              diff.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.type === 'add'
                      ? styles.lineAdd
                      : line.type === 'remove'
                      ? styles.lineRemove
                      : styles.lineSame
                  }
                >
                  <span className={styles.linePrefix} aria-hidden="true">
                    {line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}
                  </span>
                  <span className={styles.lineText}>{line.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

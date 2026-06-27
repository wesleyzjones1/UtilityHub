import { useState, useMemo, useDeferredValue } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import { lineDiff, wordDiff, diffStats } from '../../../utils/diff';
import styles from './TextCompare.module.css';

const HOW_TO_USE = [
  'Paste the original text in the left input panel.',
  'Paste the modified text in the right input panel.',
  'The diff appears instantly below — green lines are added, red are removed, amber are case-only changes.',
  'Word-level differences are highlighted within changed lines.',
];

export default function TextCompare({ page }) {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');

  const dA = useDeferredValue(textA);
  const dB = useDeferredValue(textB);

  const ops = useMemo(() => {
    if (!dA && !dB) return [];
    return lineDiff(dA, dB);
  }, [dA, dB]);

  const stats = useMemo(() => diffStats(ops), [ops]);
  const hasInput = textA || textB;
  const isIdentical = textA === textB && hasInput;

  const rows = useMemo(() => buildRows(ops), [ops]);

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      {/* ── Input panels ── */}
      <div className={styles.inputGrid}>
        <InputPanel
          label="Original"
          value={textA}
          onChange={setTextA}
          placeholder="Paste the original text here…"
        />
        <InputPanel
          label="Modified"
          value={textB}
          onChange={setTextB}
          placeholder="Paste the modified text here…"
        />
      </div>

      {/* ── Stats bar ── */}
      {hasInput && (
        <div className={styles.statsBar} role="status" aria-live="polite">
          {isIdentical ? (
            <span className={styles.statEqual}>Texts are identical</span>
          ) : (
            <>
              <StatBadge value={stats.added}      label="added"        cls={styles.statAdd} />
              <StatBadge value={stats.removed}    label="removed"      cls={styles.statDel} />
              <StatBadge value={stats.caseChanges} label="case changes" cls={styles.statCase} />
              <StatBadge value={stats.unchanged}  label="unchanged"    cls={styles.statSame} />
            </>
          )}
        </div>
      )}

      {/* ── Diff output ── */}
      {textA && textB && !isIdentical && rows.length > 0 && (
        <div className={styles.diffWrap} role="region" aria-label="Diff output">
          {/* Header */}
          <div className={styles.diffHeader}>
            <div className={styles.diffHeaderCell}>Original</div>
            <div className={styles.diffHeaderCell}>Modified</div>
          </div>
          {/* Rows */}
          <div className={styles.diffBody}>
            {rows.map((row, i) => (
              <DiffRow key={i} row={row} />
            ))}
          </div>
        </div>
      )}

      {!hasInput && (
        <p className={styles.emptyHint}>
          Enter text in both panels above to compare them.
        </p>
      )}
    </PageShell>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InputPanel({ label, value, onChange, placeholder }) {
  return (
    <div className={styles.inputPanel}>
      <div className={styles.inputPanelLabel}>{label}</div>
      <textarea
        className={styles.inputArea}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        spellCheck={false}
      />
    </div>
  );
}

function StatBadge({ value, label, cls }) {
  return (
    <span className={[styles.statBadge, cls].join(' ')}>
      <strong>{value}</strong> {label}
    </span>
  );
}

function DiffRow({ row }) {
  return (
    <div className={styles.diffRow}>
      <DiffCell
        lineNum={row.leftNum}
        sign={row.leftSign}
        content={row.leftContent}
        wordOps={row.wordOps}
        side="left"
        cls={styles[row.leftCls]}
      />
      <DiffCell
        lineNum={row.rightNum}
        sign={row.rightSign}
        content={row.rightContent}
        wordOps={row.wordOps}
        side="right"
        cls={styles[row.rightCls]}
      />
    </div>
  );
}

function DiffCell({ lineNum, sign, content, wordOps, side, cls }) {
  return (
    <div className={[styles.diffCell, cls].join(' ')}>
      <span className={styles.lineNum} aria-hidden="true">
        {lineNum ?? ''}
      </span>
      <span className={styles.lineSign} aria-hidden="true">
        {sign}
      </span>
      <span className={styles.lineContent}>
        {wordOps ? (
          <WordHighlight ops={wordOps} side={side} />
        ) : (
          content
        )}
      </span>
    </div>
  );
}

function WordHighlight({ ops, side }) {
  return (
    <>
      {ops.map((op, i) => {
        if (op.type === 'equal') {
          return <span key={i}>{side === 'left' ? op.left : op.right}</span>;
        }
        if (side === 'left' && op.type === 'delete') {
          return <mark key={i} className={styles.wordDel}>{op.left}</mark>;
        }
        if (side === 'right' && op.type === 'insert') {
          return <mark key={i} className={styles.wordIns}>{op.right}</mark>;
        }
        return null;
      })}
    </>
  );
}

// ── Row builder ───────────────────────────────────────────────────────────────

function buildRows(ops) {
  let leftNum = 0;
  let rightNum = 0;
  return ops.map(op => {
    switch (op.type) {
      case 'equal':
        leftNum++; rightNum++;
        return {
          leftNum, leftSign: ' ', leftContent: op.left,  leftCls: 'cellEqual',
          rightNum, rightSign: ' ', rightContent: op.right, rightCls: 'cellEqual',
          wordOps: null,
        };
      case 'delete':
        leftNum++;
        return {
          leftNum, leftSign: '−', leftContent: op.left, leftCls: 'cellDel',
          rightNum: null, rightSign: '', rightContent: '', rightCls: 'cellEmpty',
          wordOps: null,
        };
      case 'insert':
        rightNum++;
        return {
          leftNum: null, leftSign: '', leftContent: '', leftCls: 'cellEmpty',
          rightNum, rightSign: '+', rightContent: op.right, rightCls: 'cellIns',
          wordOps: null,
        };
      case 'change': {
        leftNum++; rightNum++;
        const wordOps = wordDiff(op.left, op.right);
        return {
          leftNum, leftSign: '−', leftContent: op.left,  leftCls: 'cellDel',
          rightNum, rightSign: '+', rightContent: op.right, rightCls: 'cellIns',
          wordOps,
        };
      }
      case 'case-change': {
        leftNum++; rightNum++;
        const wordOps = wordDiff(op.left, op.right);
        return {
          leftNum, leftSign: '~', leftContent: op.left,  leftCls: 'cellCase',
          rightNum, rightSign: '~', rightContent: op.right, rightCls: 'cellCase',
          wordOps,
        };
      }
      default:
        return null;
    }
  }).filter(Boolean);
}

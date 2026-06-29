import { useState, useMemo } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './RegexTester.module.css';

const HOW_TO_USE = [
  'Enter a regular expression pattern in the Pattern field.',
  'Toggle flags (g, i, m) to control global, case-insensitive, and multiline matching.',
  'Type or paste your test string below the pattern.',
  'Matches are highlighted and listed with their positions.',
];

const DEFAULT_TEST = 'The quick brown fox jumps over the lazy dog.';
const MAX_MATCHES = 50;

function buildFlagString(flags) {
  return Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join('');
}

function getMatches(pattern, flags, testString) {
  if (!pattern) return { matches: null, error: null };
  let regex;
  try {
    regex = new RegExp(pattern, buildFlagString(flags));
  } catch (e) {
    return { matches: null, error: e.message };
  }

  const flagStr = buildFlagString(flags);
  const matches = [];

  if (flagStr.includes('g')) {
    let m;
    const globalRegex = new RegExp(pattern, flagStr);
    while ((m = globalRegex.exec(testString)) !== null && matches.length < MAX_MATCHES) {
      matches.push({ text: m[0], index: m.index });
      // Prevent infinite loops on zero-length matches
      if (m[0].length === 0) globalRegex.lastIndex++;
    }
  } else {
    const m = testString.match(regex);
    if (m) matches.push({ text: m[0], index: m.index });
  }

  return { matches, error: null };
}

function buildHighlighted(testString, matches) {
  if (!matches || matches.length === 0) return [{ text: testString, highlight: false }];

  const parts = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index > cursor) {
      parts.push({ text: testString.slice(cursor, match.index), highlight: false });
    }
    parts.push({ text: match.text, highlight: true });
    cursor = match.index + match.text.length;
  }

  if (cursor < testString.length) {
    parts.push({ text: testString.slice(cursor), highlight: false });
  }

  return parts;
}

export default function RegexTester({ page }) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState(DEFAULT_TEST);

  const { matches, error } = useMemo(
    () => getMatches(pattern, flags, testString),
    [pattern, flags, testString]
  );

  const highlighted = useMemo(
    () => (matches ? buildHighlighted(testString, matches) : null),
    [testString, matches]
  );

  const matchesText = matches
    ? matches.map((m) => `index ${m.index}: "${m.text}"`).join('\n')
    : '';

  function toggleFlag(flag) {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }

  let statusLabel;
  if (!pattern) {
    statusLabel = null;
  } else if (error) {
    statusLabel = <span className={styles.statusError}>Invalid pattern</span>;
  } else {
    statusLabel = (
      <span className={matches.length > 0 ? styles.statusMatch : styles.statusNone}>
        {matches.length > 0 ? `${matches.length} match${matches.length !== 1 ? 'es' : ''}` : 'No matches'}
      </span>
    );
  }

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        {/* Pattern row */}
        <div className={styles.patternRow}>
          <div className={styles.patternInputWrap}>
            <span className={styles.delimiter}>/</span>
            <input
              type="text"
              aria-label="Pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="pattern"
              className={styles.patternInput}
              spellCheck={false}
            />
            <span className={styles.delimiter}>/</span>
          </div>
          <div className={styles.flags}>
            {['g', 'i', 'm'].map((flag) => (
              <label key={flag} className={styles.flagLabel}>
                <input
                  type="checkbox"
                  checked={flags[flag]}
                  onChange={() => toggleFlag(flag)}
                  className={styles.flagCheckbox}
                />
                <span className={styles.flagChar}>{flag}</span>
              </label>
            ))}
          </div>
          {statusLabel && <div className={styles.statusBadge}>{statusLabel}</div>}
        </div>

        {/* Test string */}
        <div className={styles.section}>
          <label className={styles.sectionLabel} htmlFor="regex-test-string">Test string</label>
          <textarea
            id="regex-test-string"
            aria-label="Test string"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={8}
            className={styles.testTextarea}
            spellCheck={false}
          />
        </div>

        {/* Highlighted preview */}
        {highlighted && pattern && !error && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Preview</span>
            <div className={styles.preview}>
              {highlighted.map((part, i) =>
                part.highlight ? (
                  <span
                    key={i}
                    style={{
                      background: 'var(--color-primary-subtle)',
                      color: 'var(--color-primary)',
                      borderRadius: '2px',
                    }}
                  >
                    {part.text}
                  </span>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className={styles.section}>
          <div className={styles.resultsHeader}>
            <span className={styles.sectionLabel}>Matches</span>
            {matchesText && <CopyButton value={matchesText} size="sm" />}
          </div>
          <div className={styles.results}>
            {!pattern && (
              <p className={styles.placeholder}>Enter a pattern above</p>
            )}
            {pattern && error && (
              <p className={styles.errorMsg}>Invalid pattern: {error}</p>
            )}
            {pattern && !error && matches.length === 0 && (
              <p className={styles.placeholder}>No matches found.</p>
            )}
            {pattern && !error && matches.length > 0 && (
              <ol className={styles.matchList}>
                {matches.map((m, i) => (
                  <li key={i} className={styles.matchItem}>
                    <span className={styles.matchIndex}>index {m.index}</span>
                    <code className={styles.matchText}>{m.text}</code>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import { contrastRatio } from '../../../utils/colorUtils';
import styles from './ContrastChecker.module.css';

const HOW_TO_USE = [
  'Choose a foreground (text) color and a background color.',
  'The WCAG contrast ratio updates as you adjust the colors.',
  'Check the AA/AAA badges to see if the pair passes for your text size.',
];

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

function normalizeHex(raw, fallback) {
  const s = raw.trim();
  if (!HEX_RE.test(s)) return fallback;
  return ('#' + s.replace('#', '')).toUpperCase();
}

function Badge({ label, passes }) {
  return (
    <div className={`${styles.badge} ${passes ? styles.pass : styles.fail}`}>
      <span className={styles.badgeName}>{label}</span>
      <span className={styles.badgeState}>{passes ? 'Pass' : 'Fail'}</span>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  const swatch = normalizeHex(value, '#000000');
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.fieldInputs}>
        <input
          type="color"
          className={styles.colorInput}
          value={swatch}
          onChange={e => onChange(e.target.value)}
          aria-label={`${label} swatch`}
        />
        <input
          type="text"
          className={styles.hexInput}
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label={label}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default function ContrastChecker({ page }) {
  const [fg, setFg] = useState('#1E293B');
  const [bg, setBg] = useState('#FFFFFF');

  const fgHex = normalizeHex(fg, '#000000');
  const bgHex = normalizeHex(bg, '#FFFFFF');
  const ratio = contrastRatio(fgHex, bgHex);
  const ratioText = `${ratio.toFixed(2)}:1`;

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.fields}>
          <ColorField label="Text color" value={fg} onChange={setFg} />
          <ColorField label="Background" value={bg} onChange={setBg} />
        </div>

        <div className={styles.preview} style={{ backgroundColor: bgHex, color: fgHex }}>
          <span className={styles.previewLarge}>Large text sample</span>
          <span className={styles.previewNormal}>The quick brown fox jumps over the lazy dog.</span>
        </div>

        <div className={styles.ratio}>
          <span className={styles.ratioValue}>{ratioText}</span>
          <span className={styles.ratioLabel}>contrast ratio</span>
        </div>

        <div className={styles.grades}>
          <div className={styles.gradeGroup}>
            <p className={styles.gradeTitle}>Normal text</p>
            <div className={styles.badges}>
              <Badge label="AA" passes={ratio >= 4.5} />
              <Badge label="AAA" passes={ratio >= 7} />
            </div>
          </div>
          <div className={styles.gradeGroup}>
            <p className={styles.gradeTitle}>Large text</p>
            <div className={styles.badges}>
              <Badge label="AA" passes={ratio >= 3} />
              <Badge label="AAA" passes={ratio >= 4.5} />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

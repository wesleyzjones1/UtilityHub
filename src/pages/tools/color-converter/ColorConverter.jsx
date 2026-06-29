import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import {
  hexToRgb, hexToHsl, rgbToHsv, rgbToCmyk, contrastLabel,
} from '../../../utils/colorUtils';
import styles from './ColorConverter.module.css';

const HOW_TO_USE = [
  'Pick a color with the swatch, or type a hex value like #3B82F6.',
  'See the equivalent HEX, RGB, HSL, HSV, and CMYK values.',
  'Use the copy buttons to grab any format.',
];

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

function normalizeHex(raw) {
  const s = raw.trim();
  if (!HEX_RE.test(s)) return null;
  return ('#' + s.replace('#', '')).toUpperCase();
}

function ValueRow({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
      <CopyButton value={value} size="sm" />
    </div>
  );
}

export default function ColorConverter({ page }) {
  const [hexInput, setHexInput] = useState('#3B82F6');

  const hex = normalizeHex(hexInput);
  const valid = hex !== null;
  const rgb = valid ? hexToRgb(hex) : null;
  const hsl = valid ? hexToHsl(hex) : null;
  const hsv = valid ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = valid ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.inputArea}>
          <input
            type="color"
            className={styles.colorInput}
            value={valid ? hex : '#000000'}
            onChange={e => setHexInput(e.target.value)}
            aria-label="Pick a color"
          />
          <input
            type="text"
            className={styles.hexInput}
            value={hexInput}
            onChange={e => setHexInput(e.target.value)}
            aria-label="Hex value"
            placeholder="#3B82F6"
            spellCheck={false}
          />
        </div>

        {valid ? (
          <>
            <div
              className={styles.swatch}
              style={{ backgroundColor: hex, color: contrastLabel(hex) }}
              aria-label={`Preview of ${hex}`}
            >
              {hex}
            </div>
            <div className={styles.values}>
              <ValueRow label="HEX" value={hex} />
              <ValueRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
              <ValueRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
              <ValueRow label="HSV" value={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`} />
              <ValueRow label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} />
            </div>
          </>
        ) : (
          <p className={styles.invalid} role="alert">
            Enter a valid 6-digit hex color, e.g. <code>#3B82F6</code>.
          </p>
        )}
      </div>
    </PageShell>
  );
}

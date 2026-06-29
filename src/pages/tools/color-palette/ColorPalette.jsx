import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import { hexToHsl, rgbToHex } from '../../../utils/colorUtils';
import styles from './ColorPalette.module.css';

const HOW_TO_USE = [
  'Pick a base color using the color picker or enter a hex value.',
  'Choose a color scheme to generate a harmonious palette.',
  'Copy individual hex values or all colors at once.',
];

function rotateHue(h, degrees) {
  return ((h + degrees) % 360 + 360) % 360;
}

function hslToHex(h, s, l) {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = n => {
    const k = (n + h / 30) % 12;
    return ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return rgbToHex(Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255));
}

// Schemes whose number of colors the user can choose. The others have a fixed
// geometric definition (triadic = 3, tetradic = 4, split-complementary = 3).
const COUNTABLE_SCHEMES = ['complementary', 'analogous', 'monochromatic'];

function generatePalette(baseHex, scheme, count) {
  const { h, s, l } = hexToHsl(baseHex);

  switch (scheme) {
    case 'complementary': {
      // Base color, then lightness variations of the complementary hue.
      const compH = rotateHue(h, 180);
      const colors = [hslToHex(h, s, l)];
      const n = count - 1;
      for (let i = 0; i < n; i++) {
        const li = n === 1 ? l : 30 + (i * 50) / (n - 1);
        colors.push(hslToHex(compH, s, li));
      }
      return colors;
    }
    case 'analogous': {
      // `count` hues, 30° apart, centered on the base color.
      const step = 30;
      const start = -((count - 1) / 2) * step;
      return Array.from({ length: count }, (_, i) =>
        hslToHex(rotateHue(h, start + i * step), s, l)
      );
    }
    case 'monochromatic':
      // `count` evenly spaced lightness steps from 20% to 80%.
      return Array.from({ length: count }, (_, i) =>
        hslToHex(h, s, count === 1 ? l : 20 + (i * 60) / (count - 1))
      );
    case 'triadic':
      return [
        hslToHex(h, s, l),
        hslToHex(rotateHue(h, 120), s, l),
        hslToHex(rotateHue(h, 240), s, l),
      ];
    case 'split-complementary':
      return [
        hslToHex(h, s, l),
        hslToHex(rotateHue(h, 150), s, l),
        hslToHex(rotateHue(h, 210), s, l),
      ];
    case 'tetradic':
      return [
        hslToHex(h, s, l),
        hslToHex(rotateHue(h, 90), s, l),
        hslToHex(rotateHue(h, 180), s, l),
        hslToHex(rotateHue(h, 270), s, l),
      ];
    default:
      return [hslToHex(h, s, l)];
  }
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function ColorPalette({ page }) {
  const [baseHex, setBaseHex] = useState('#6366f1');
  const [hexText, setHexText] = useState('#6366f1');
  const [scheme, setScheme] = useState('complementary');
  const [count, setCount] = useState(5);

  function handleSwatchChange(val) {
    setBaseHex(val);
    setHexText(val);
  }

  function handleHexTextChange(val) {
    setHexText(val);
    if (HEX_RE.test(val)) {
      setBaseHex(val);
    }
  }

  const showCount = COUNTABLE_SCHEMES.includes(scheme);
  const palette = generatePalette(baseHex, scheme, count);
  const allHex = palette.join('\n');

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <div className={styles.field}>
            <label className={styles.label}>Base color</label>
            <div className={styles.colorField}>
              <input
                type="color"
                aria-label="Base color"
                className={styles.colorInput}
                value={baseHex}
                onChange={e => handleSwatchChange(e.target.value)}
              />
              <input
                type="text"
                aria-label="Base color hex"
                className={styles.hexInput}
                value={hexText}
                onChange={e => handleHexTextChange(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Color scheme</label>
            <select
              aria-label="Color scheme"
              className={styles.select}
              value={scheme}
              onChange={e => setScheme(e.target.value)}
            >
              <option value="complementary">Complementary</option>
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="split-complementary">Split-complementary</option>
              <option value="tetradic">Tetradic</option>
              <option value="monochromatic">Monochromatic</option>
            </select>
          </div>

          {showCount && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="palette-count">Colors</label>
              <input
                id="palette-count"
                type="number"
                min={2}
                max={8}
                aria-label="Number of colors"
                className={styles.countInput}
                value={count}
                onChange={e => setCount(clamp(parseInt(e.target.value, 10) || 2, 2, 8))}
              />
            </div>
          )}
        </div>

        <div className={styles.palette}>
          {palette.map((hex, i) => (
            <div key={i} className={styles.swatch} aria-label="Color swatch">
              <div className={styles.swatchColor} style={{ backgroundColor: hex }} />
              <span className={styles.hex}>{hex}</span>
              <CopyButton value={hex} label="Copy hex" />
            </div>
          ))}
        </div>

        <div className={styles.copyAll}>
          <CopyButton value={allHex} label="Copy all HEX" />
        </div>
      </div>
    </PageShell>
  );
}

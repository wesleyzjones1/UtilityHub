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

function generatePalette(baseHex, scheme) {
  const { h, s, l } = hexToHsl(baseHex);

  switch (scheme) {
    case 'complementary':
      return [
        hslToHex(h, s, l),
        hslToHex(rotateHue(h, 180), s, l),
      ];
    case 'analogous':
      return [
        hslToHex(rotateHue(h, -60), s, l),
        hslToHex(rotateHue(h, -30), s, l),
        hslToHex(h, s, l),
        hslToHex(rotateHue(h, 30), s, l),
        hslToHex(rotateHue(h, 60), s, l),
      ];
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
    case 'monochromatic':
      return [20, 35, 50, 65, 80].map(lightness => hslToHex(h, s, lightness));
    default:
      return [hslToHex(h, s, l)];
  }
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export default function ColorPalette({ page }) {
  const [baseHex, setBaseHex] = useState('#6366f1');
  const [hexText, setHexText] = useState('#6366f1');
  const [scheme, setScheme] = useState('complementary');

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

  const palette = generatePalette(baseHex, scheme);
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

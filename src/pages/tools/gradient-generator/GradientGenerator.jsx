import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import { hexToRgb, rgbToHex, hexToHsl } from '../../../utils/colorUtils';
import styles from './GradientGenerator.module.css';

const HOW_TO_USE = [
  'Pick a start and end color — add more stops for multi-color blends.',
  'Choose a gradient type and, for linear, the angle.',
  'Copy the CSS value, or copy any of the evenly-spaced palette colors below.',
];

function buildGradient(type, angle, stops) {
  const colorStops = stops.map(s => `${s.color} ${s.position}%`).join(', ');
  if (type === 'radial') return `radial-gradient(circle, ${colorStops})`;
  if (type === 'conic') return `conic-gradient(from 0deg, ${colorStops})`;
  return `linear-gradient(${angle}deg, ${colorStops})`;
}

/** Color of the gradient at a given position (0–100) by linear RGB interpolation. */
function colorAt(sorted, pos) {
  if (pos <= sorted[0].position) {
    const c = hexToRgb(sorted[0].color);
    return rgbToHex(c.r, c.g, c.b);
  }
  const last = sorted[sorted.length - 1];
  if (pos >= last.position) {
    const c = hexToRgb(last.color);
    return rgbToHex(c.r, c.g, c.b);
  }
  let lo = sorted[0];
  let hi = last;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (pos >= sorted[i].position && pos <= sorted[i + 1].position) {
      lo = sorted[i];
      hi = sorted[i + 1];
      break;
    }
  }
  const span = hi.position - lo.position || 1;
  const t = (pos - lo.position) / span;
  const c1 = hexToRgb(lo.color);
  const c2 = hexToRgb(hi.color);
  return rgbToHex(
    Math.round(c1.r + (c2.r - c1.r) * t),
    Math.round(c1.g + (c2.g - c1.g) * t),
    Math.round(c1.b + (c2.b - c1.b) * t),
  );
}

/** Sample `steps` evenly-spaced colors across the gradient stops. */
function samplePalette(stops, steps) {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  return Array.from({ length: steps }, (_, i) =>
    colorAt(sorted, steps === 1 ? sorted[0].position : (i / (steps - 1)) * 100)
  );
}

// ── Harmony palettes (derived from a single base color) ──────────────────────

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

// Schemes whose color count the user can choose. The others are fixed by
// geometry (triadic = 3, split-complementary = 3, tetradic = 4).
const COUNTABLE_SCHEMES = ['complementary', 'analogous', 'monochromatic'];

const SCHEMES = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split-complementary', label: 'Split-complementary' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'monochromatic', label: 'Monochromatic' },
];

function harmonyPalette(baseHex, scheme, count) {
  const { h, s, l } = hexToHsl(baseHex);
  switch (scheme) {
    case 'complementary': {
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
      const step = 30;
      const start = -((count - 1) / 2) * step;
      return Array.from({ length: count }, (_, i) =>
        hslToHex(rotateHue(h, start + i * step), s, l)
      );
    }
    case 'monochromatic':
      return Array.from({ length: count }, (_, i) =>
        hslToHex(h, s, count === 1 ? l : 20 + (i * 60) / (count - 1))
      );
    case 'triadic':
      return [hslToHex(h, s, l), hslToHex(rotateHue(h, 120), s, l), hslToHex(rotateHue(h, 240), s, l)];
    case 'split-complementary':
      return [hslToHex(h, s, l), hslToHex(rotateHue(h, 150), s, l), hslToHex(rotateHue(h, 210), s, l)];
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

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function GradientGenerator({ page }) {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const [steps, setSteps] = useState(5);
  const [paletteMode, setPaletteMode] = useState('blend');
  const [scheme, setScheme] = useState('complementary');
  const [stops, setStops] = useState([
    { color: '#6366f1', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ]);

  const isHarmony = paletteMode === 'harmony';
  // The steps control applies to blends and to count-adjustable harmony schemes.
  const showSteps = !isHarmony || COUNTABLE_SCHEMES.includes(scheme);

  const cssValue = buildGradient(type, angle, stops);
  const palette = isHarmony
    ? harmonyPalette(stops[0].color, scheme, steps)
    : samplePalette(stops, steps);
  const allHex = palette.join('\n');

  function updateStop(index, field, value) {
    setStops(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }

  function addStop() {
    setStops(prev => [...prev, { color: '#ec4899', position: 50 }]);
  }

  function removeStop(index) {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <div className={styles.field}>
            <label className={styles.label}>Gradient type</label>
            <select
              aria-label="Gradient type"
              className={styles.select}
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="conic">Conic</option>
            </select>
          </div>

          {type === 'linear' && (
            <div className={styles.field}>
              <label className={styles.label}>Angle</label>
              <input
                type="number"
                aria-label="Angle"
                className={styles.numberInput}
                min="0"
                max="360"
                value={angle}
                onChange={e => setAngle(Number(e.target.value))}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Palette mode</label>
            <select
              aria-label="Palette mode"
              className={styles.select}
              value={paletteMode}
              onChange={e => setPaletteMode(e.target.value)}
            >
              <option value="blend">Blend (across stops)</option>
              <option value="harmony">Harmony (from first color)</option>
            </select>
          </div>

          {isHarmony && (
            <div className={styles.field}>
              <label className={styles.label}>Color scheme</label>
              <select
                aria-label="Color scheme"
                className={styles.select}
                value={scheme}
                onChange={e => setScheme(e.target.value)}
              >
                {SCHEMES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}

          {showSteps && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="palette-steps">Palette colors</label>
              <input
                id="palette-steps"
                type="number"
                aria-label="Number of palette colors"
                className={styles.numberInput}
                min="2"
                max="12"
                value={steps}
                onChange={e => setSteps(clamp(parseInt(e.target.value, 10) || 2, 2, 12))}
              />
            </div>
          )}

          <div className={styles.stopsSection}>
            <div className={styles.stopsHeader}>
              <span className={styles.label}>Color stops</span>
              <button type="button" className={styles.addBtn} onClick={addStop}>
                Add stop
              </button>
            </div>
            <div className={styles.stops}>
              {stops.map((stop, i) => (
                <div key={i} className={styles.stop}>
                  <input
                    type="color"
                    aria-label={`Stop ${i + 1} color`}
                    className={styles.colorInput}
                    value={stop.color}
                    onChange={e => updateStop(i, 'color', e.target.value)}
                  />
                  <input
                    type="number"
                    aria-label={`Stop ${i + 1} position`}
                    className={styles.positionInput}
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={e => updateStop(i, 'position', Number(e.target.value))}
                  />
                  <span className={styles.pct}>%</span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeStop(i)}
                    disabled={stops.length <= 2}
                    aria-label={`Remove stop ${i + 1}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={styles.preview}
          style={{ background: cssValue }}
          aria-label="Gradient preview"
        />

        <div className={styles.output}>
          <span className={styles.label}>CSS value</span>
          <div className={styles.outputRow}>
            <code className={styles.code}>{cssValue}</code>
            <CopyButton value={cssValue} />
          </div>
        </div>

        <div className={styles.paletteSection}>
          <div className={styles.stopsHeader}>
            <span className={styles.label}>Palette</span>
            <CopyButton value={allHex} label="Copy all HEX" />
          </div>
          <div className={styles.palette}>
            {palette.map((hex, i) => (
              <div key={i} className={styles.swatch} aria-label="Color swatch">
                <div className={styles.swatchColor} style={{ backgroundColor: hex }} />
                <span className={styles.swatchHex}>{hex}</span>
                <CopyButton value={hex} label="Copy hex" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import { hexToRgb, hexToHsl, contrastLabel } from '../../../utils/colorUtils';
import styles from './ColorPicker.module.css';

const HOW_TO_USE = [
  'Click "Pick a color" and your cursor turns into an eyedropper.',
  'Click anywhere on your screen — any app, image, or web page.',
  'The HEX, RGB, and HSL values appear instantly.',
  'Use the copy buttons to grab the value you need.',
];

function EyedropperIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-3.12 3.12-1.41-1.42-1.42 1.42 1.41 1.41-6.6 6.6A2 2 0 0 0 5 16v3h3a2 2 0 0 0 1.42-.59l6.6-6.6 1.41 1.42 1.42-1.42-1.42-1.41 3.12-3.12a1 1 0 0 0 0-1.65z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ColorValue({ label, value, copyText }) {
  return (
    <div className={styles.valueRow}>
      <span className={styles.valueLabel}>{label}</span>
      <span className={styles.valueData}>{value}</span>
      <CopyButton text={copyText ?? value} size="sm" />
    </div>
  );
}

export default function ColorPicker({ page }) {
  const eyeDropperSupported = typeof window !== 'undefined' && 'EyeDropper' in window;
  const [color, setColor] = useState(null);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  async function pick() {
    if (!eyeDropperSupported) return;
    setError(null);
    setPicking(true);
    try {
      const dropper = new window.EyeDropper();
      const result = await dropper.open();
      const hex = result.sRGBHex.toUpperCase();
      setColor(hex);
      setHistory(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 8));
    } catch (e) {
      if (e.name !== 'AbortError') setError('Could not open color picker. Try again.');
    } finally {
      setPicking(false);
    }
  }

  const rgb = color ? hexToRgb(color) : null;
  const hsl = color ? hexToHsl(color) : null;
  const labelColor = color ? contrastLabel(color) : '#000000';

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>

        {/* Pick button */}
        <div className={styles.pickArea}>
          {!eyeDropperSupported && (
            <p className={styles.unsupported} role="alert">
              The EyeDropper API is not supported in this browser. Use Chrome or Edge 95+.
            </p>
          )}
          <button
            className={styles.pickBtn}
            onClick={pick}
            disabled={!eyeDropperSupported || picking}
            aria-label="Pick a color from the screen"
          >
            <EyedropperIcon />
            {picking ? 'Picking…' : 'Pick a color'}
          </button>
          {error && <p className={styles.error} role="alert">{error}</p>}
        </div>

        {/* Color swatch + values */}
        {color && (
          <div className={styles.result}>
            <div
              className={styles.swatch}
              style={{ backgroundColor: color, color: labelColor }}
              aria-label={`Color swatch: ${color}`}
            >
              <span className={styles.swatchHex}>{color}</span>
            </div>

            <div className={styles.values}>
              <ColorValue label="HEX" value={color} />
              <ColorValue
                label="RGB"
                value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                copyText={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              />
              <ColorValue
                label="HSL"
                value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                copyText={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
              />
              <ColorValue
                label="R"
                value={String(rgb.r)}
                copyText={String(rgb.r)}
              />
              <ColorValue
                label="G"
                value={String(rgb.g)}
                copyText={String(rgb.g)}
              />
              <ColorValue
                label="B"
                value={String(rgb.b)}
                copyText={String(rgb.b)}
              />
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className={styles.history}>
            <p className={styles.historyLabel}>Recent</p>
            <div className={styles.historySwatches}>
              {history.map(hex => (
                <button
                  key={hex}
                  className={styles.historySwatch}
                  style={{ backgroundColor: hex }}
                  onClick={() => setColor(hex)}
                  aria-label={`Select ${hex}`}
                  title={hex}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

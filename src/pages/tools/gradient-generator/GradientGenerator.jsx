import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './GradientGenerator.module.css';

const HOW_TO_USE = [
  'Choose a gradient type: linear, radial, or conic.',
  'Adjust the angle (for linear gradients) and add color stops.',
  'Copy the generated CSS value to use in your project.',
];

function buildGradient(type, angle, stops) {
  const colorStops = stops.map(s => `${s.color} ${s.position}%`).join(', ');
  if (type === 'radial') return `radial-gradient(circle, ${colorStops})`;
  if (type === 'conic') return `conic-gradient(from 0deg, ${colorStops})`;
  return `linear-gradient(${angle}deg, ${colorStops})`;
}

export default function GradientGenerator({ page }) {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState([
    { color: '#6366f1', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ]);

  const cssValue = buildGradient(type, angle, stops);

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
      </div>
    </PageShell>
  );
}

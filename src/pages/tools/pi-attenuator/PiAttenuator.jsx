import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Select from '../../../components/ui/Select/Select';
import { calculatePiAttenuator, reversePiAttenuator } from '../../../utils/formatters';
import styles from './PiAttenuator.module.css';

const IMPEDANCE_OPTIONS = [
  { value: '50', label: '50 Ω' },
  { value: '75', label: '75 Ω' },
  { value: 'custom', label: 'Custom' },
];

const MODE_OPTIONS = [
  { value: 'forward', label: 'dB → Resistors' },
  { value: 'reverse', label: 'Resistors → dB' },
];

const HOW_TO_USE = [
  'Choose the direction: calculate resistors from dB, or find dB from known resistors.',
  'Select the system impedance (50 Ω for RF, 75 Ω for cable/video).',
  'Enter your known values — results update instantly.',
];

function fmt(n) {
  return n < 0.01
    ? n.toExponential(3)
    : n >= 1000
    ? `${(n / 1000).toFixed(3)} kΩ`
    : `${n.toFixed(2)} Ω`;
}

export default function PiAttenuator({ page }) {
  const [mode, setMode] = useState('forward');
  const [impedancePreset, setImpedancePreset] = useState('50');
  const [customZ, setCustomZ] = useState('');
  const [dB, setDB] = useState('');
  const [rShunt, setRShunt] = useState('');
  const [rSeries, setRSeries] = useState('');

  const Z = impedancePreset === 'custom' ? parseFloat(customZ) : parseFloat(impedancePreset);

  let result = null;
  let error = null;

  if (mode === 'forward') {
    const atten = parseFloat(dB);
    if (dB.trim() && !isNaN(atten) && !isNaN(Z) && Z > 0) {
      try {
        result = calculatePiAttenuator(atten, Z);
      } catch (e) {
        error = e.message;
      }
    }
  } else {
    const rs = parseFloat(rShunt);
    const rse = parseFloat(rSeries);
    if (rShunt.trim() && rSeries.trim() && !isNaN(rs) && !isNaN(rse) && !isNaN(Z) && Z > 0) {
      try {
        result = reversePiAttenuator(rs, rse, Z);
      } catch (e) {
        error = e.message;
      }
    }
  }

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.controls}>
        <Select label="Direction" options={MODE_OPTIONS} value={mode} onChange={setMode} />
        <Select
          label="Impedance"
          options={IMPEDANCE_OPTIONS}
          value={impedancePreset}
          onChange={setImpedancePreset}
        />
        {impedancePreset === 'custom' && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="custom-z">Custom Ω</label>
            <input
              id="custom-z"
              type="number"
              min="1"
              className={styles.input}
              value={customZ}
              onChange={e => setCustomZ(e.target.value)}
              placeholder="e.g. 600"
              aria-label="Custom impedance"
            />
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {/* Inputs */}
        <section className={styles.card} aria-label="Inputs">
          <h2 className={styles.cardTitle}>Inputs</h2>
          {mode === 'forward' ? (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pi-db">Attenuation (dB)</label>
              <input
                id="pi-db"
                type="number"
                min="0.1"
                step="0.1"
                className={styles.input}
                value={dB}
                onChange={e => setDB(e.target.value)}
                placeholder="e.g. 6"
                aria-label="Attenuation dB"
              />
            </div>
          ) : (
            <>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="pi-rshunt">R Shunt (Ω)</label>
                <input
                  id="pi-rshunt"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={styles.input}
                  value={rShunt}
                  onChange={e => setRShunt(e.target.value)}
                  placeholder="e.g. 150.48"
                  aria-label="R Shunt"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="pi-rseries">R Series (Ω)</label>
                <input
                  id="pi-rseries"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={styles.input}
                  value={rSeries}
                  onChange={e => setRSeries(e.target.value)}
                  placeholder="e.g. 16.61"
                  aria-label="R Series"
                />
              </div>
            </>
          )}
        </section>

        {/* Results */}
        <section className={styles.card} aria-label="Results">
          <h2 className={styles.cardTitle}>Results</h2>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {result && !error && (
            <dl className={styles.results}>
              {mode === 'forward' ? (
                <>
                  <div className={styles.resultRow}>
                    <dt className={styles.resultLabel}>R Shunt (×2)</dt>
                    <dd className={styles.resultValue}>{fmt(result.rShunt)}</dd>
                  </div>
                  <div className={styles.resultRow}>
                    <dt className={styles.resultLabel}>R Series</dt>
                    <dd className={styles.resultValue}>{fmt(result.rSeries)}</dd>
                  </div>
                </>
              ) : (
                <div className={styles.resultRow}>
                  <dt className={styles.resultLabel}>Attenuation</dt>
                  <dd className={styles.resultValue}>{result.dB.toFixed(2)} dB</dd>
                </div>
              )}
              <div className={styles.resultRow}>
                <dt className={styles.resultLabel}>Impedance</dt>
                <dd className={styles.resultValue}>{Z} Ω</dd>
              </div>
            </dl>
          )}
          {!result && !error && (
            <p className={styles.placeholder}>Enter values above to see results.</p>
          )}
        </section>

        {/* Diagram */}
        <section className={styles.card} aria-label="Pi Attenuator Diagram">
          <h2 className={styles.cardTitle}>π Network</h2>
          <div className={styles.diagram} aria-hidden="true">
            <svg viewBox="0 0 300 120" className={styles.svg}>
              {/* Input line */}
              <line x1="0" y1="60" x2="60" y2="60" stroke="currentColor" strokeWidth="2" />
              {/* Shunt R1 */}
              <rect x="45" y="35" width="30" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="60" y1="35" x2="60" y2="10" stroke="currentColor" strokeWidth="2" />
              <line x1="60" y1="49" x2="60" y2="60" stroke="currentColor" strokeWidth="2" />
              <line x1="45" y1="10" x2="75" y2="10" stroke="currentColor" strokeWidth="2" />
              <text x="60" y="8" textAnchor="middle" fontSize="9" fill="currentColor">R1</text>
              {/* Series R */}
              <rect x="105" y="54" width="90" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="60" y1="60" x2="105" y2="60" stroke="currentColor" strokeWidth="2" />
              <line x1="195" y1="60" x2="240" y2="60" stroke="currentColor" strokeWidth="2" />
              <text x="150" y="52" textAnchor="middle" fontSize="9" fill="currentColor">R2</text>
              {/* Shunt R3 */}
              <rect x="225" y="35" width="30" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="240" y1="35" x2="240" y2="10" stroke="currentColor" strokeWidth="2" />
              <line x1="240" y1="49" x2="240" y2="60" stroke="currentColor" strokeWidth="2" />
              <line x1="225" y1="10" x2="255" y2="10" stroke="currentColor" strokeWidth="2" />
              <text x="240" y="8" textAnchor="middle" fontSize="9" fill="currentColor">R3</text>
              {/* Output line */}
              <line x1="240" y1="60" x2="300" y2="60" stroke="currentColor" strokeWidth="2" />
              {/* GND lines */}
              <line x1="60" y1="10" x2="60" y2="5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="40" y1="5" x2="80" y2="5" stroke="currentColor" strokeWidth="2" />
              <line x1="240" y1="10" x2="240" y2="5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="220" y1="5" x2="260" y2="5" stroke="currentColor" strokeWidth="2" />
              {/* Labels */}
              <text x="5" y="56" fontSize="9" fill="currentColor">IN</text>
              <text x="268" y="56" fontSize="9" fill="currentColor">OUT</text>
              <text x="62" y="90" fontSize="8" fill="currentColor">R1=R3 (shunt)</text>
              <text x="62" y="105" fontSize="8" fill="currentColor">R2 (series)</text>
            </svg>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

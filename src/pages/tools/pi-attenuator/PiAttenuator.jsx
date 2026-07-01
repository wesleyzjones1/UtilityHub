import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Select from '../../../components/ui/Select/Select';
import { matchedPiAttenuator, piAttenuationDb } from '../../../utils/formatters';
import styles from './PiAttenuator.module.css';

const IMPEDANCE_OPTIONS = [
  { value: '50', label: '50 Ω' },
  { value: '75', label: '75 Ω' },
  { value: 'custom', label: 'Custom' },
];

// Short, readable value for the schematic (values can span a wide range).
function diagramFmt(str) {
  if (!str) return '—';
  const n = parseFloat(str);
  if (!isFinite(n)) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)} kΩ`;
  return `${n.toFixed(1)} Ω`;
}

export default function PiAttenuator({ page }) {
  const [impedancePreset, setImpedancePreset] = useState('50');
  const [customZ, setCustomZ] = useState('');
  // Shunt and series are the two independent inputs (source of truth).
  const [shunt, setShunt] = useState('');
  const [series, setSeries] = useState('');
  // When non-null, the user is entering a target attenuation ("design mode"):
  // the resistors are derived (matched) from it rather than typed directly.
  const [dbTarget, setDbTarget] = useState('');

  const Z = impedancePreset === 'custom' ? parseFloat(customZ) : parseFloat(impedancePreset);
  const designMode = dbTarget != null;

  // Resolve what each field shows and any error, from the current mode.
  let dbDisplay, shuntDisplay, seriesDisplay, error;
  if (designMode) {
    const m = matchedPiAttenuator(dbTarget, Z);
    dbDisplay = dbTarget;
    shuntDisplay = m.rShunt;
    seriesDisplay = m.rSeries;
    error = m.error;
  } else {
    const g = piAttenuationDb(shunt, series, Z);
    dbDisplay = g.db;
    shuntDisplay = shunt;
    seriesDisplay = series;
    error = g.error;
  }

  // Editing a resistor leaves design mode. Seed both resistors from the values
  // currently on screen so the one the user didn't touch is preserved.
  function editResistor(setter, value) {
    if (designMode) {
      const m = matchedPiAttenuator(dbTarget, Z);
      setShunt(m.rShunt || '');
      setSeries(m.rSeries || '');
      setDbTarget(null);
    }
    setter(value);
  }

  return (
    <PageShell page={page}>
      <div className={styles.controls}>
        <Select
          label="Impedance"
          options={IMPEDANCE_OPTIONS}
          value={impedancePreset}
          onChange={setImpedancePreset}
        />
        {impedancePreset === 'custom' && (
          <RcField
            label="Custom Ω"
            unit="Ω"
            value={customZ}
            onChange={setCustomZ}
            placeholder="600"
            ariaLabel="Custom impedance"
            min="1"
          />
        )}
      </div>

      <section className={styles.fields} aria-label="Pi attenuator values">
        <RcField
          label="Shunt R"
          unit="Ω"
          value={shuntDisplay}
          onChange={v => editResistor(setShunt, v)}
          placeholder="150.5"
          ariaLabel="R Shunt"
        />
        <RcField
          label="Series R"
          unit="Ω"
          value={seriesDisplay}
          onChange={v => editResistor(setSeries, v)}
          placeholder="37.4"
          ariaLabel="R Series"
        />
        <RcField
          label="Attenuation"
          unit="dB"
          value={dbDisplay}
          onChange={setDbTarget}
          placeholder="6"
          ariaLabel="Attenuation dB"
        />
      </section>

      {error && (
        <p className={styles.error} role="alert">{error}</p>
      )}

      <section className={styles.diagramCard} aria-label="Pi attenuator diagram">
        <PiSchematic
          shunt={diagramFmt(shuntDisplay)}
          series={diagramFmt(seriesDisplay)}
          impedance={Number.isFinite(Z) ? `${Z} Ω` : '—'}
        />
      </section>
    </PageShell>
  );
}

function RcField({ label, unit, value, onChange, placeholder, ariaLabel, min }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          type="number"
          step="any"
          min={min}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
        <span className={styles.unit} aria-hidden="true">{unit}</span>
      </div>
    </div>
  );
}

function PiSchematic({ shunt, series, impedance }) {
  return (
    <svg viewBox="0 0 320 180" className={styles.svg} role="img"
      aria-label={`Pi network: shunt resistors ${shunt}, series resistor ${series}, impedance ${impedance}`}>
      {/* Top signal rail: IN → left node → series R → right node → OUT */}
      <line x1="14" y1="45" x2="65" y2="45" className={styles.wire} />
      <line x1="65" y1="45" x2="115" y2="45" className={styles.wire} />
      <rect x="115" y="36" width="90" height="18" rx="3" className={styles.resistor} />
      <line x1="205" y1="45" x2="255" y2="45" className={styles.wire} />
      <line x1="255" y1="45" x2="306" y2="45" className={styles.wire} />

      {/* Left shunt resistor to ground */}
      <line x1="65" y1="45" x2="65" y2="78" className={styles.wire} />
      <rect x="56" y="78" width="18" height="44" rx="3" className={styles.resistor} />
      <line x1="65" y1="122" x2="65" y2="140" className={styles.wire} />
      <Ground cx={65} y={140} />

      {/* Right shunt resistor to ground */}
      <line x1="255" y1="45" x2="255" y2="78" className={styles.wire} />
      <rect x="246" y="78" width="18" height="44" rx="3" className={styles.resistor} />
      <line x1="255" y1="122" x2="255" y2="140" className={styles.wire} />
      <Ground cx={255} y={140} />

      {/* Node dots */}
      <circle cx="65" cy="45" r="3" className={styles.node} />
      <circle cx="255" cy="45" r="3" className={styles.node} />

      {/* Port labels */}
      <text x="12" y="34" className={styles.port}>IN</text>
      <text x="308" y="34" textAnchor="end" className={styles.port}>OUT</text>

      {/* Live values */}
      <text x="160" y="26" textAnchor="middle" className={styles.value}>{series}</text>
      <text x="160" y="70" textAnchor="middle" className={styles.caption}>series</text>
      <text x="65" y="165" textAnchor="middle" className={styles.value}>{shunt}</text>
      <text x="65" y="176" textAnchor="middle" className={styles.caption}>shunt</text>
      <text x="255" y="165" textAnchor="middle" className={styles.value}>{shunt}</text>
      <text x="255" y="176" textAnchor="middle" className={styles.caption}>shunt</text>
    </svg>
  );
}

function Ground({ cx, y }) {
  return (
    <g className={styles.wire}>
      <line x1={cx - 14} y1={y} x2={cx + 14} y2={y} />
      <line x1={cx - 8} y1={y + 5} x2={cx + 8} y2={y + 5} />
      <line x1={cx - 3} y1={y + 10} x2={cx + 3} y2={y + 10} />
    </g>
  );
}

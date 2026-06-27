import PageShell from '../../../templates/PageShell/PageShell';
import styles from './EngineeringCheatSheet.module.css';

const SI_PREFIXES = [
  { prefix: 'Tera',  symbol: 'T', exp: '10¹²',  value: '1,000,000,000,000' },
  { prefix: 'Giga',  symbol: 'G', exp: '10⁹',   value: '1,000,000,000' },
  { prefix: 'Mega',  symbol: 'M', exp: '10⁶',   value: '1,000,000' },
  { prefix: 'Kilo',  symbol: 'k', exp: '10³',   value: '1,000' },
  { prefix: 'Hecto', symbol: 'h', exp: '10²',   value: '100' },
  { prefix: 'Deca',  symbol: 'da', exp: '10¹',  value: '10' },
  { prefix: '—',     symbol: '—',  exp: '10⁰',  value: '1 (base)' },
  { prefix: 'Deci',  symbol: 'd', exp: '10⁻¹',  value: '0.1' },
  { prefix: 'Centi', symbol: 'c', exp: '10⁻²',  value: '0.01' },
  { prefix: 'Milli', symbol: 'm', exp: '10⁻³',  value: '0.001' },
  { prefix: 'Micro', symbol: 'μ', exp: '10⁻⁶',  value: '0.000001' },
  { prefix: 'Nano',  symbol: 'n', exp: '10⁻⁹',  value: '0.000000001' },
  { prefix: 'Pico',  symbol: 'p', exp: '10⁻¹²', value: '0.000000000001' },
  { prefix: 'Femto', symbol: 'f', exp: '10⁻¹⁵', value: '0.000000000000001' },
];

const CAPACITORS = [
  ['1 F',   '1,000 mF',   '1,000,000 μF',   '1,000,000,000 nF',   '1,000,000,000,000 pF'],
  ['1 mF',  '0.001 F',    '1,000 μF',        '1,000,000 nF',       '1,000,000,000 pF'],
  ['1 μF',  '0.000001 F', '0.001 mF',        '1,000 nF',           '1,000,000 pF'],
  ['1 nF',  '0.001 μF',   '1,000 pF',        '—',                  '—'],
  ['1 pF',  '0.001 nF',   '0.000001 μF',     '—',                  '—'],
];

const FREQUENCY = [
  ['1 THz', '1,000 GHz',   '1,000,000 MHz',   '10⁹ kHz',     '10¹² Hz'],
  ['1 GHz', '0.001 THz',   '1,000 MHz',        '1,000,000 kHz', '10⁹ Hz'],
  ['1 MHz', '0.001 GHz',   '1,000 kHz',        '1,000,000 Hz', '—'],
  ['1 kHz', '0.001 MHz',   '1,000 Hz',         '—',            '—'],
  ['1 Hz',  '0.001 kHz',   '—',                '—',            '—'],
];

const TIME_UNITS = [
  { unit: '1 nanosecond (ns)',  equals: '0.001 μs = 10⁻⁹ s' },
  { unit: '1 microsecond (μs)', equals: '1,000 ns = 0.001 ms' },
  { unit: '1 millisecond (ms)', equals: '1,000 μs = 0.001 s' },
  { unit: '1 second (s)',       equals: '1,000 ms = 1/60 min' },
  { unit: '1 minute (min)',     equals: '60 s = 1/60 hr' },
  { unit: '1 hour (hr)',        equals: '60 min = 3,600 s' },
  { unit: '1 day',              equals: '24 hr = 86,400 s' },
  { unit: '1 week',             equals: '7 days = 604,800 s' },
];

const MASS_UNITS = [
  { unit: '1 tonne (t)',       equals: '1,000 kg = 2,204.62 lb' },
  { unit: '1 kilogram (kg)',   equals: '1,000 g = 2.20462 lb' },
  { unit: '1 gram (g)',        equals: '0.001 kg = 1,000 mg' },
  { unit: '1 milligram (mg)',  equals: '0.001 g = 1,000 μg' },
  { unit: '1 pound (lb)',      equals: '16 oz = 453.592 g' },
  { unit: '1 ounce (oz)',      equals: '28.3495 g = 0.0625 lb' },
];

const SHORTHANDS = [
  { sym: 'Ω',    name: 'Ohm',       desc: 'Unit of electrical resistance' },
  { sym: 'V',    name: 'Volt',      desc: 'Unit of electric potential' },
  { sym: 'A',    name: 'Ampere',    desc: 'Unit of electric current' },
  { sym: 'W',    name: 'Watt',      desc: 'Unit of power (P = V × I)' },
  { sym: 'F',    name: 'Farad',     desc: 'Unit of electrical capacitance' },
  { sym: 'H',    name: 'Henry',     desc: 'Unit of inductance' },
  { sym: 'Hz',   name: 'Hertz',     desc: 'Cycles per second' },
  { sym: 'dB',   name: 'Decibel',   desc: 'Logarithmic ratio of power or amplitude' },
  { sym: 'PPM',  name: 'Parts per million', desc: 'Tolerance or deviation' },
  { sym: 'RMS',  name: 'Root Mean Square', desc: 'Effective AC voltage/current' },
  { sym: 'BJT',  name: 'Bipolar Junction Transistor', desc: 'Current-controlled switch/amplifier' },
  { sym: 'FET',  name: 'Field Effect Transistor', desc: 'Voltage-controlled switch/amplifier' },
  { sym: 'PCB',  name: 'Printed Circuit Board', desc: 'Physical substrate for circuits' },
  { sym: 'SMD',  name: 'Surface-Mount Device', desc: 'Component soldered on PCB surface' },
  { sym: 'ESD',  name: 'Electrostatic Discharge', desc: 'Static electricity damage mechanism' },
  { sym: 'MCU',  name: 'Microcontroller Unit', desc: 'Integrated microprocessor system' },
];

const HOW_TO_USE = [
  'Use this page as a quick reference for common engineering values.',
  'All tables are read-only — scroll to find the section you need.',
];

export default function EngineeringCheatSheet({ page }) {
  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <Section title="SI Prefixes">
        <table className={styles.table}>
          <thead>
            <tr>
              <Th>Prefix</Th><Th>Symbol</Th><Th>Exponent</Th><Th>Value</Th>
            </tr>
          </thead>
          <tbody>
            {SI_PREFIXES.map(r => (
              <tr key={r.symbol} className={styles.row}>
                <Td mono={false}>{r.prefix}</Td>
                <Td>{r.symbol}</Td>
                <Td>{r.exp}</Td>
                <Td>{r.value}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Capacitor Unit Conversions">
        <table className={styles.table}>
          <thead>
            <tr><Th>Value</Th><Th>= mF</Th><Th>= μF</Th><Th>= nF</Th><Th>= pF</Th></tr>
          </thead>
          <tbody>
            {CAPACITORS.map((row, i) => (
              <tr key={i} className={styles.row}>
                {row.map((cell, j) => <Td key={j}>{cell}</Td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Frequency Conversions">
        <table className={styles.table}>
          <thead>
            <tr><Th>Value</Th><Th>= THz</Th><Th>= GHz</Th><Th>= MHz</Th><Th>= Hz</Th></tr>
          </thead>
          <tbody>
            {FREQUENCY.map((row, i) => (
              <tr key={i} className={styles.row}>
                {row.map((cell, j) => <Td key={j}>{cell}</Td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Time Units">
        <table className={styles.table}>
          <thead>
            <tr><Th>Unit</Th><Th>Equivalents</Th></tr>
          </thead>
          <tbody>
            {TIME_UNITS.map(r => (
              <tr key={r.unit} className={styles.row}>
                <Td>{r.unit}</Td><Td>{r.equals}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Mass Units">
        <table className={styles.table}>
          <thead>
            <tr><Th>Unit</Th><Th>Equivalents</Th></tr>
          </thead>
          <tbody>
            {MASS_UNITS.map(r => (
              <tr key={r.unit} className={styles.row}>
                <Td>{r.unit}</Td><Td>{r.equals}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Common Engineering Shorthand">
        <table className={styles.table}>
          <thead>
            <tr><Th>Symbol</Th><Th>Name</Th><Th>Description</Th></tr>
          </thead>
          <tbody>
            {SHORTHANDS.map(r => (
              <tr key={r.sym} className={styles.row}>
                <Td>{r.sym}</Td>
                <Td mono={false}>{r.name}</Td>
                <Td mono={false}>{r.desc}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </PageShell>
  );
}

function Section({ title, children }) {
  return (
    <section className={styles.section} aria-label={title}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.tableWrap}>{children}</div>
    </section>
  );
}

function Th({ children }) {
  return <th className={styles.th}>{children}</th>;
}

function Td({ children, mono = true }) {
  return <td className={`${styles.td} ${mono ? styles.mono : ''}`}>{children}</td>;
}

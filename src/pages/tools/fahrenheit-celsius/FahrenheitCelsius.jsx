import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import { useLanguage } from '../../../context/LanguageContext';
import { convertTemperature } from '../../../utils/converters';
import styles from './FahrenheitCelsius.module.css';

export default function FahrenheitCelsius({ page }) {
  const [active, setActive] = useState({ unit: 'f', value: '' });
  const { t } = useLanguage();

  const result = convertTemperature(active.value, active.unit);

  function displayFor(unit) {
    if (active.unit === unit) return active.value;
    return result[unit];
  }

  function handleChange(unit, val) {
    setActive({ unit, value: val });
  }

  return (
    <PageShell page={page}>
      <div className={styles.grid}>
        <TempField
          label={t('tempFahrenheit')}
          unit="°F"
          value={displayFor('f')}
          onChange={v => handleChange('f', v)}
          aria-label={t('tempFahrenheit')}
        />
        <TempField
          label={t('tempCelsius')}
          unit="°C"
          value={displayFor('c')}
          onChange={v => handleChange('c', v)}
          aria-label={t('tempCelsius')}
        />
        <TempField
          label={t('tempKelvin')}
          unit="K"
          value={displayFor('k')}
          onChange={v => handleChange('k', v)}
          aria-label={t('tempKelvin')}
        />
      </div>
    </PageShell>
  );
}

function TempField({ label, unit, value, onChange, 'aria-label': ariaLabel }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="0"
          aria-label={ariaLabel}
          step="any"
        />
        <span className={styles.unit} aria-hidden="true">{unit}</span>
      </div>
    </div>
  );
}

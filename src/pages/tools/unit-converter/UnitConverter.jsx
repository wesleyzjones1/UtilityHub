import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Select from '../../../components/ui/Select/Select';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import { useLanguage } from '../../../context/LanguageContext';
import { UNIT_CATEGORIES, convertUnit, formatResult } from '../../../utils/unitConversions';
import styles from './UnitConverter.module.css';

const CATEGORY_OPTIONS = Object.entries(UNIT_CATEGORIES).map(([value, c]) => ({ value, label: c.label }));

function unitOptions(category) {
  return Object.entries(UNIT_CATEGORIES[category].units).map(([value, u]) => ({ value, label: u.label }));
}

export default function UnitConverter({ page }) {
  const [category, setCategory] = useState('length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');
  const [value, setValue] = useState('1');
  const { t } = useLanguage();

  function changeCategory(next) {
    const keys = Object.keys(UNIT_CATEGORIES[next].units);
    setCategory(next);
    setFrom(keys[0]);
    setTo(keys[1] ?? keys[0]);
  }

  const options = unitOptions(category);
  const result = value !== '' ? formatResult(convertUnit(value, category, from, to)) : '';

  return (
    <PageShell page={page}>
      <div className={styles.layout}>
        <Select label={t('unitMeasurement')} options={CATEGORY_OPTIONS} value={category} onChange={changeCategory} />

        <div className={styles.row}>
          <div className={styles.field}>
            <Select label={t('unitFrom')} options={options} value={from} onChange={setFrom} />
            <input
              type="number"
              className={styles.input}
              value={value}
              onChange={e => setValue(e.target.value)}
              aria-label="Value to convert"
              placeholder="Enter a value"
            />
          </div>

          <span className={styles.arrow} aria-hidden="true">→</span>

          <div className={styles.field}>
            <Select label={t('unitTo')} options={options} value={to} onChange={setTo} />
            <div className={styles.output}>
              <span className={styles.outputValue}>{result || '—'}</span>
              {result && <CopyButton value={result} size="sm" />}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

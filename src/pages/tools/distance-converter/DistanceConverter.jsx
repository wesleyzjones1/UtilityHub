import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { convertDistance, DISTANCE_UNITS } from '../../../utils/converters';
import styles from './DistanceConverter.module.css';

export default function DistanceConverter({ page }) {
  const [from, setFrom] = useState('m');
  const [to, setTo]     = useState('ft');
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const { output, error } = convertDistance(input, from, to);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <div className={styles.controls}>
          <Select
            label={t('from')}
            options={DISTANCE_UNITS}
            value={from}
            onChange={setFrom}
          />
          <span className={styles.arrow} aria-hidden="true">→</span>
          <Select
            label={t('to')}
            options={DISTANCE_UNITS}
            value={to}
            onChange={setTo}
          />
          {error && <span className={styles.error} role="alert">{error}</span>}
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      outputLabel={t('result')}
      inputMono
      outputMono
      inputPlaceholder="Enter a number…"
    />
  );
}

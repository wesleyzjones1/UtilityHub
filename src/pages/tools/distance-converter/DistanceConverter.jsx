import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { convertDistance, DISTANCE_UNITS } from '../../../utils/converters';
import styles from './DistanceConverter.module.css';

const HOW_TO_USE = [
  'Choose the unit to convert from in the "From" dropdown.',
  'Choose the target unit in the "To" dropdown.',
  'Enter a number in the input panel — the converted value appears instantly.',
];

export default function DistanceConverter({ page }) {
  const [from, setFrom] = useState('m');
  const [to, setTo]     = useState('ft');
  const [input, setInput] = useState('');

  const { output, error } = convertDistance(input, from, to);

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <div className={styles.controls}>
          <Select
            label="From"
            options={DISTANCE_UNITS}
            value={from}
            onChange={setFrom}
          />
          <span className={styles.arrow} aria-hidden="true">→</span>
          <Select
            label="To"
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
      inputLabel="Input"
      outputLabel="Result"
      inputMono
      outputMono
      inputPlaceholder="Enter a number…"
    />
  );
}

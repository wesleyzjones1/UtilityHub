import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { convertBase } from '../../../utils/converters';
import styles from './BaseConverter.module.css';

const BASE_OPTIONS = [
  { value: 'binary',      label: 'Binary (Base 2)' },
  { value: 'octal',       label: 'Octal (Base 8)' },
  { value: 'decimal',     label: 'Decimal (Base 10)' },
  { value: 'hexadecimal', label: 'Hexadecimal (Base 16)' },
  { value: 'text',        label: 'Text (UTF-8)' },
];

const HOW_TO_USE = [
  'Choose the "From" base in the left dropdown.',
  'Choose the "To" base in the right dropdown.',
  'Enter your value in the input panel — the result appears instantly.',
  'For Text conversions, each character is space-separated in the output.',
];

export default function BaseConverter({ page }) {
  const [from, setFrom] = useState('decimal');
  const [to, setTo]     = useState('binary');
  const [input, setInput] = useState('');

  const { output, error } = convertBase(input, from, to);

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <div className={styles.controls}>
          <Select
            label="From"
            options={BASE_OPTIONS}
            value={from}
            onChange={setFrom}
          />
          <span className={styles.arrow} aria-hidden="true">→</span>
          <Select
            label="To"
            options={BASE_OPTIONS}
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
      inputPlaceholder={from === 'text' ? 'Enter text…' : `Enter ${from} value…`}
      outputPlaceholder="Result appears here…"
    />
  );
}

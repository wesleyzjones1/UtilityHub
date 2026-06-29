import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import { convertBase } from '../../../utils/converters';
import styles from './BaseConverter.module.css';

const BASE_OPTIONS = [
  { value: 'binary',      label: 'Binary',  title: 'Binary (Base 2)' },
  { value: 'hexadecimal', label: 'Hex',     title: 'Hexadecimal (Base 16)' },
  { value: 'decimal',     label: 'Decimal', title: 'Decimal (Base 10)' },
  { value: 'octal',       label: 'Octal',   title: 'Octal (Base 8)' },
  { value: 'text',        label: 'Text',    title: 'Text (UTF-8)' },
];

const HOW_TO_USE = [
  'Choose the source base using the buttons above the input.',
  'Choose the target base using the buttons above the output.',
  'Type or paste your value — the result appears instantly.',
  'For Text conversions, each character is space-separated in the output.',
];

export default function BaseConverter({ page }) {
  const [from, setFrom] = useState('binary');
  const [to, setTo]     = useState('hexadecimal');
  const [input, setInput] = useState('');

  const { output, error } = convertBase(input, from, to);

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      hideHeaderActions
      inputControls={
        <div className={styles.controlsRow}>
          <ButtonGroup
            label="From"
            hideLabel
            options={BASE_OPTIONS}
            value={from}
            onChange={setFrom}
          />
          {input && (
            <button
              className={styles.clearBtn}
              onClick={() => setInput('')}
              aria-label="Clear input"
              title="Clear input"
            >
              ✕
            </button>
          )}
        </div>
      }
      outputControls={
        <div className={styles.controlsRow}>
          <ButtonGroup
            label="To"
            hideLabel
            options={BASE_OPTIONS}
            value={to}
            onChange={setTo}
          />
          {output && <CopyButton value={output} size="sm" />}
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Output"
      actions={error && <span className={styles.error} role="alert">{error}</span>}
      inputMono
      outputMono
      inputPlaceholder={from === 'text' ? 'Enter text…' : `Enter ${from} value…`}
      outputPlaceholder="Result appears here…"
    />
  );
}

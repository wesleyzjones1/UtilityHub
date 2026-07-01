import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import { useLanguage } from '../../../context/LanguageContext';
import { convertBase } from '../../../utils/converters';
import styles from './BaseConverter.module.css';

const BASE_OPTIONS = [
  { value: 'binary',      label: 'Binary',  title: 'Binary (Base 2)' },
  { value: 'hexadecimal', label: 'Hex',     title: 'Hexadecimal (Base 16)' },
  { value: 'decimal',     label: 'Decimal', title: 'Decimal (Base 10)' },
  { value: 'octal',       label: 'Octal',   title: 'Octal (Base 8)' },
  { value: 'text',        label: 'Text',    title: 'Text (UTF-8)' },
];

export default function BaseConverter({ page }) {
  const [from, setFrom] = useState('binary');
  const [to, setTo]     = useState('hexadecimal');
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const { output, error } = convertBase(input, from, to);

  const BASE_SAMPLES = { binary: '1010', hexadecimal: 'FF', decimal: '42', octal: '52', text: 'Hi' };
  const inputExample = BASE_SAMPLES[from] ?? '42';
  const { output: outputExample } = convertBase(inputExample, from, to);

  return (
    <DualPanelTemplate
      page={page}
      hideHeaderActions
      inputControls={
        <div className={styles.controlsRow}>
          <ButtonGroup
            label={t('from')}
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
            label={t('to')}
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
      actions={error && <span className={styles.error} role="alert">{error}</span>}
      inputMono
      outputMono
      inputPlaceholder={inputExample}
      outputPlaceholder={outputExample || '…'}
    />
  );
}

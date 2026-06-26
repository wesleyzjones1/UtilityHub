import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { columnsToInline, inlineToColumns } from '../../../utils/textTransforms';
import styles from './InlineColumnConverter.module.css';

const SEPARATOR_OPTIONS = [
  { value: ',',  label: 'Comma (,)' },
  { value: ', ', label: 'Comma + space (, )' },
  { value: ';',  label: 'Semicolon (;)' },
  { value: '|',  label: 'Pipe (|)' },
  { value: '\t', label: 'Tab' },
  { value: ' ',  label: 'Space' },
];

const HOW_TO_USE = [
  'Paste your text in the input panel.',
  'Toggle between "Column → Inline" and "Inline → Column" conversion.',
  'Choose the separator that matches your data.',
  'Click "Copy" to copy the result.',
];

export default function InlineColumnConverter({ page }) {
  const [input, setInput] = useState('');
  const [toInline, setToInline] = useState(true);
  const [separator, setSeparator] = useState(', ');

  const output = input
    ? toInline
      ? columnsToInline(input, separator)
      : inlineToColumns(input, separator)
    : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <div className={styles.controls}>
          <Toggle
            checked={toInline}
            onChange={setToInline}
            label={toInline ? 'Column → Inline' : 'Inline → Column'}
          />
          <Select
            label="Separator"
            options={SEPARATOR_OPTIONS}
            value={separator}
            onChange={setSeparator}
          />
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={toInline ? 'Column (one per line)' : 'Inline (separated)'}
      outputLabel={toInline ? 'Inline' : 'Column (one per line)'}
      inputMono
      outputMono
    />
  );
}

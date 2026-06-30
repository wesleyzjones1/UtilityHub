import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import Select from '../../../components/ui/Select/Select';
import { columnsToInline, inlineToColumns } from '../../../utils/textTransforms';
import styles from './InlineColumnConverter.module.css';

const SEPARATOR_OPTIONS = [
  { value: ', ', label: 'Comma + space (, )' },
  { value: ',',  label: 'Comma (,)' },
  { value: ';',  label: 'Semicolon (;)' },
  { value: '|',  label: 'Pipe (|)' },
  { value: '\t', label: 'Tab' },
  { value: ' ',  label: 'Space' },
  { value: '',   label: 'Nothing (join)' },
];

const SEPARATOR_OPTIONS_TO_COLUMN = SEPARATOR_OPTIONS.filter(o => o.value !== '');

const HOW_TO_USE = [
  'Paste your text in the input panel.',
  'Toggle between "Column → Inline" and "Inline → Column" conversion.',
  'Choose the separator that matches your data.',
  'Use "Nothing (join)" to merge all lines into one — equivalent to removing line breaks.',
  'Click "Copy" to copy the result.',
];

export default function InlineColumnConverter({ page }) {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState('to-inline');
  const [separator, setSeparator] = useState(', ');

  const toInline = direction === 'to-inline';

  function handleDirectionChange(val) {
    if (val === 'to-column' && separator === '') setSeparator(', ');
    setDirection(val);
  }

  const output = input
    ? toInline
      ? columnsToInline(input, separator)
      : inlineToColumns(input, separator)
    : '';

  const ITEMS = ['apple', 'banana', 'cherry'];
  const inputExample = toInline ? ITEMS.join('\n') : ITEMS.join(separator || ', ');
  const outputPlaceholder = toInline
    ? columnsToInline(ITEMS.join('\n'), separator)
    : inlineToColumns(ITEMS.join(separator), separator);

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <div className={styles.controls}>
          <ButtonGroup
            options={[
              { value: 'to-inline', label: 'Column → Inline' },
              { value: 'to-column', label: 'Inline → Column' },
            ]}
            value={direction}
            onChange={handleDirectionChange}
          />
          <Select
            label="Separator"
            options={toInline ? SEPARATOR_OPTIONS : SEPARATOR_OPTIONS_TO_COLUMN}
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
      inputPlaceholder={inputExample}
      outputPlaceholder={outputPlaceholder}
      inputMono
      outputMono
    />
  );
}

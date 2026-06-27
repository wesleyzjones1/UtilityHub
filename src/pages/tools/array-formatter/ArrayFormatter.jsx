import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { formatArray } from '../../../utils/converters';

const FORMAT_OPTIONS = [
  { value: 'js',           label: "JS array  ['a', 'b']" },
  { value: 'js-multiline', label: 'JS array (multiline)' },
  { value: 'json',         label: 'JSON array ["a","b"]' },
  { value: 'json-pretty',  label: 'JSON (pretty)' },
  { value: 'python',       label: "Python list ['a', 'b']" },
  { value: 'csv',          label: 'Comma-separated' },
  { value: 'sql-in',       label: "SQL IN ('a', 'b')" },
];

const QUOTE_OPTIONS = [
  { value: 'single', label: "Single quotes '" },
  { value: 'double', label: 'Double quotes "' },
  { value: 'none',   label: 'No quotes' },
];

const HOW_TO_USE = [
  'Paste or type items in the input panel — one item per line.',
  'Choose the output format from the first dropdown.',
  'Choose a quote style from the second dropdown (for JSON, double quotes are always used).',
  'Click "Copy" to copy the formatted result.',
];

export default function ArrayFormatter({ page }) {
  const [input, setInput]   = useState('');
  const [format, setFormat] = useState('js');
  const [quote, setQuote]   = useState('single');

  const output = input ? formatArray(input, format, quote) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <>
          <Select
            label="Format"
            options={FORMAT_OPTIONS}
            value={format}
            onChange={setFormat}
          />
          <Select
            label="Quote style"
            options={QUOTE_OPTIONS}
            value={quote}
            onChange={setQuote}
          />
        </>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Items (one per line)"
      outputLabel="Formatted"
      inputMono
      outputMono
    />
  );
}

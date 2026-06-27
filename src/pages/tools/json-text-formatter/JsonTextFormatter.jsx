import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { encodeJSONText, decodeJSONText } from '../../../utils/formatters';

const MODE_OPTIONS = [
  { value: 'encode', label: 'Text → JSON string' },
  { value: 'decode', label: 'JSON string → Text' },
];

const HOW_TO_USE = [
  'To encode: paste plain text and get a JSON-escaped string (with quotes).',
  'To decode: paste a JSON string (with or without outer quotes) to get plain text.',
  'Useful for embedding multiline text in JSON configs or API payloads.',
  'Copy the result from the output panel.',
];

export default function JsonTextFormatter({ page }) {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');

  let output = '';
  if (input.trim()) {
    try {
      output = mode === 'encode' ? encodeJSONText(input) : decodeJSONText(input);
    } catch (e) {
      output = `Error: ${e.message}`;
    }
  }

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <Select
          label="Mode"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={mode === 'encode' ? 'Plain Text' : 'JSON String'}
      outputLabel={mode === 'encode' ? 'JSON String' : 'Plain Text'}
      inputMono
      outputMono
      inputPlaceholder={
        mode === 'encode'
          ? 'Paste plain text here…'
          : 'Paste JSON string here… e.g. "hello\\nworld"'
      }
      outputPlaceholder="Output appears here…"
    />
  );
}

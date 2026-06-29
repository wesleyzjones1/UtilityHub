import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { formatJSON, minifyJSON } from '../../../utils/formatters';

const MODE_OPTIONS = [
  { value: 'format', label: 'Format' },
  { value: 'minify', label: 'Minify' },
];

const HOW_TO_USE = [
  'Paste your JSON into the input panel.',
  'Choose Format to prettify with indentation, or Minify to compact it.',
  'Invalid JSON will show an error message in the output.',
  'Copy the result from the output panel.',
];

export default function JsonFormatter({ page }) {
  const [mode, setMode] = useState('format');
  const [input, setInput] = useState('');

  let output = '';
  if (input.trim()) {
    try {
      output = mode === 'minify' ? minifyJSON(input) : formatJSON(input);
    } catch (e) {
      output = `// Error: ${e.message}`;
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
      inputLabel="JSON Input"
      outputLabel="JSON Output"
      inputMono
      outputMono
      inputPlaceholder='Paste JSON here… e.g. {"key": "value"}'
      outputPlaceholder="Output appears here…"
    />
  );
}

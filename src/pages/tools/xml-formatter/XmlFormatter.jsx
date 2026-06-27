import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { formatXML, minifyXML } from '../../../utils/formatters';

const MODE_OPTIONS = [
  { value: 'format', label: 'Format' },
  { value: 'minify', label: 'Minify' },
];

const HOW_TO_USE = [
  'Paste your XML into the input panel.',
  'Choose Format to add proper indentation, or Minify to remove whitespace.',
  'Copy the result from the output panel.',
];

export default function XmlFormatter({ page }) {
  const [mode, setMode] = useState('format');
  const [input, setInput] = useState('');

  let output = '';
  if (input.trim()) {
    try {
      output = mode === 'minify' ? minifyXML(input) : formatXML(input);
    } catch (e) {
      output = `<!-- Error: ${e.message} -->`;
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
      inputLabel="XML Input"
      outputLabel="XML Output"
      inputMono
      outputMono
      inputPlaceholder="Paste XML here…"
      outputPlaceholder="Output appears here…"
    />
  );
}

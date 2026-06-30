import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { removeAllWhitespace } from '../../../utils/textTransforms';

const MODE_OPTIONS = [
  { value: 'all',    label: 'All whitespace' },
  { value: 'spaces', label: 'Spaces only' },
  { value: 'tabs',   label: 'Tabs only' },
  { value: 'extra',  label: 'Extra spaces (collapse)' },
];

const HOW_TO_USE = [
  'Paste or type text in the input panel.',
  'Choose what to remove: all whitespace, spaces only, tabs only, or collapse extra spaces.',
  'Click "Copy" to copy the cleaned output.',
];

export default function RemoveAllWhitespace({ page }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('all');

  const output = input ? removeAllWhitespace(input, mode) : '';

  const EXAMPLE = 'hello   world';
  const outputPlaceholder = removeAllWhitespace(EXAMPLE, mode);

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <Select
          label="Remove"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Cleaned"
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

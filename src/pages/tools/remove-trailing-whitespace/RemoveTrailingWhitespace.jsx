import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { removeTrailingWhitespace } from '../../../utils/textTransforms';

const HOW_TO_USE = [
  'Paste your text in the input panel.',
  'Trailing spaces and tabs are stripped from each line instantly.',
  'Click "Copy" to copy the cleaned output.',
];

export default function RemoveTrailingWhitespace({ page }) {
  const [input, setInput] = useState('');
  const output = input ? removeTrailingWhitespace(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Cleaned"
      inputMono
      outputMono
      inputPlaceholder="Paste text with trailing spaces here…"
    />
  );
}

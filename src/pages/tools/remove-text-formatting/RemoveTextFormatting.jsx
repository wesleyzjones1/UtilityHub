import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { removeTextFormatting } from '../../../utils/textTransforms';

const HOW_TO_USE = [
  'Paste your Markdown, HTML, or richly formatted text in the input panel.',
  'All formatting symbols are stripped, leaving clean plain text.',
  'Click "Copy" to copy the plain text output.',
];

export default function RemoveTextFormatting({ page }) {
  const [input, setInput] = useState('');
  const output = input ? removeTextFormatting(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Formatted Input"
      outputLabel="Plain Text"
      inputPlaceholder="Paste Markdown, HTML, or formatted text here…"
    />
  );
}

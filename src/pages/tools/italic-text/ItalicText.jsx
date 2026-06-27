import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { toItalicText } from '../../../utils/textTransforms';

const HOW_TO_USE = [
  'Type or paste your text in the input panel.',
  'The output uses Unicode Mathematical Italic characters.',
  'Copy and paste into social media, chat apps, or anywhere Unicode is supported.',
];

export default function ItalicText({ page }) {
  const [input, setInput] = useState('');
  const output = input ? toItalicText(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Italic Output"
    />
  );
}

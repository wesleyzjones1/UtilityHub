import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { reverseText } from '../../../utils/textTransforms';

const HOW_TO_USE = [
  'Paste or type your text in the input panel.',
  'The reversed text appears instantly in the output panel.',
  'Click "Copy" to copy the reversed output.',
];

export default function ReverseText({ page }) {
  const [input, setInput] = useState('');
  const output = input ? reverseText(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Original"
      outputLabel="Reversed"
      inputMono
      outputMono
    />
  );
}

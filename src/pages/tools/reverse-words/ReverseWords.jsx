import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { reverseWords } from '../../../utils/textTransforms';

const HOW_TO_USE = [
  'Paste or type your text in the input panel.',
  'The word order is reversed instantly in the output panel.',
  'Click "Copy" to copy the output.',
];

export default function ReverseWords({ page }) {
  const [input, setInput] = useState('');
  const output = input ? reverseWords(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Original"
      outputLabel="Reversed Words"
    />
  );
}

import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { reverseTextInEachWord } from '../../../utils/textTransforms';

const HOW_TO_USE = [
  'Paste or type your text in the input panel.',
  'Each word\'s characters are reversed while word order is preserved.',
  'Click "Copy" to copy the output.',
];

export default function ReverseTextInWord({ page }) {
  const [input, setInput] = useState('');
  const output = input ? reverseTextInEachWord(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Original"
      outputLabel="Each Word Reversed"
      inputMono
      outputMono
    />
  );
}

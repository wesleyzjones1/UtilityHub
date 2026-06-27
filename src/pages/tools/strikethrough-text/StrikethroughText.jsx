import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { toStrikethroughText } from '../../../utils/textTransforms';

const HOW_TO_USE = [
  'Type or paste your text in the input panel.',
  'The output uses Unicode combining characters to add a strikethrough effect.',
  'Copy the result and paste it into any app that renders Unicode — social media, chat, documents.',
];

export default function StrikethroughText({ page }) {
  const [input, setInput] = useState('');
  const output = input ? toStrikethroughText(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Strikethrough Output"
    />
  );
}

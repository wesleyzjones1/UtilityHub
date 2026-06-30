import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { toBoldText } from '../../../utils/textTransforms';

const HOW_TO_USE = [
  'Type or paste your text in the input panel.',
  'The output uses Unicode Mathematical Bold characters.',
  'Copy and paste into social media, chat apps, or anywhere Unicode is supported.',
];

export default function BoldText({ page }) {
  const [input, setInput] = useState('');
  const output = input ? toBoldText(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Bold Output"
      inputPlaceholder="Hello world"
      outputPlaceholder="𝗛𝗲𝗹𝗹𝗼 𝘄𝗼𝗿𝗹𝗱"
    />
  );
}

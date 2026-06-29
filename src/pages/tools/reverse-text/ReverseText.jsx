import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import { reverseText, reverseWords } from '../../../utils/textTransforms';

const MODE_OPTIONS = [
  { value: 'characters', label: 'Reverse characters' },
  { value: 'words', label: 'Reverse word order' },
];

const HOW_TO_USE = [
  'Paste or type your text in the input panel.',
  'Pick a mode: reverse every character, or reverse the order of words.',
  'The reversed text appears instantly in the output panel.',
  'Click "Copy" to copy the output.',
];

export default function ReverseText({ page }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('characters');

  const output = input
    ? mode === 'words'
      ? reverseWords(input)
      : reverseText(input)
    : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <ButtonGroup
          label="Mode"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
      }
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

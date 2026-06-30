import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { removeLineBreaks } from '../../../utils/textTransforms';

const REPLACEMENT_OPTIONS = [
  { value: ' ',  label: 'Space' },
  { value: '',   label: 'Nothing (join)' },
  { value: ', ', label: 'Comma + space' },
  { value: ' | ', label: 'Pipe ( | )' },
];

const HOW_TO_USE = [
  'Paste multi-line text in the input panel.',
  'Choose what to replace line breaks with.',
  'All line breaks (\n, \r\n) are removed instantly.',
  'Click "Copy" to copy the single-line output.',
];

export default function RemoveLineBreaks({ page }) {
  const [input, setInput] = useState('');
  const [replacement, setReplacement] = useState(' ');

  const output = input ? removeLineBreaks(input, replacement) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <Select
          label="Replace line breaks with"
          options={REPLACEMENT_OPTIONS}
          value={replacement}
          onChange={setReplacement}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Multi-line Input"
      outputLabel="Single Line"
      inputPlaceholder={"Line one\nLine two\nLine three"}
      outputPlaceholder="Line one Line two Line three"
    />
  );
}

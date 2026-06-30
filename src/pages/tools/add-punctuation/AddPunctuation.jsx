import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import { addPunctuation } from '../../../utils/textTransforms';
import styles from './AddPunctuation.module.css';

const PUNCT_OPTIONS = [
  { value: '.', label: '.', title: 'Period' },
  { value: '!', label: '!', title: 'Exclamation mark' },
  { value: '?', label: '?', title: 'Question mark' },
  { value: ',', label: ',', title: 'Comma' },
  { value: ';', label: ';', title: 'Semicolon' },
  { value: ':', label: ':', title: 'Colon' },
];

const MODE_OPTIONS = [
  { value: 'missing', label: 'Add if missing' },
  { value: 'always',  label: 'Always append' },
  { value: 'replace', label: 'Replace existing' },
];

const HOW_TO_USE = [
  'Paste multi-line text into the input panel.',
  'Choose the punctuation mark and the mode.',
  '"Add if missing" only adds punctuation to lines that have none.',
  'Click "Copy" to copy the result.',
];

export default function AddPunctuation({ page }) {
  const [input, setInput] = useState('');
  const [punct, setPunct] = useState('.');
  const [mode, setMode] = useState('missing');

  const output = input ? addPunctuation(input, punct, mode) : '';

  const EXAMPLE = 'First line\nSecond line\nThird line';
  const outputPlaceholder = addPunctuation(EXAMPLE, punct, mode);

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <div className={styles.controls}>
          <ButtonGroup
            label="Punctuation"
            options={PUNCT_OPTIONS}
            value={punct}
            onChange={setPunct}
          />
          <Select
            label="Mode"
            options={MODE_OPTIONS}
            value={mode}
            onChange={setMode}
          />
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="With Punctuation"
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

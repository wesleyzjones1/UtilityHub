import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { convertCase } from '../../../utils/textTransforms';

const CASE_OPTIONS = [
  { value: 'upper',    label: 'UPPER CASE' },
  { value: 'lower',    label: 'lower case' },
  { value: 'title',    label: 'Title Case' },
  { value: 'sentence', label: 'Sentence case' },
  { value: 'camel',    label: 'camelCase' },
  { value: 'pascal',   label: 'PascalCase' },
  { value: 'snake',    label: 'snake_case' },
  { value: 'kebab',    label: 'kebab-case' },
  { value: 'constant', label: 'CONSTANT_CASE' },
];

const HOW_TO_USE = [
  'Paste or type your text in the input panel.',
  'Choose a case format from the dropdown above the panels.',
  'The converted text appears instantly — click "Copy" to copy it.',
];

export default function CaseConverter({ page }) {
  const [input, setInput] = useState('');
  const [caseType, setCaseType] = useState('upper');

  const output = input ? convertCase(input, caseType) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <Select
          label="Case format"
          options={CASE_OPTIONS}
          value={caseType}
          onChange={setCaseType}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Converted"
    />
  );
}

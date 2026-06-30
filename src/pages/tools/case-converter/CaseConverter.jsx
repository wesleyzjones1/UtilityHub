import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { convertCase } from '../../../utils/textTransforms';
import styles from './CaseConverter.module.css';

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
  'Click a case format button to convert.',
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
        <div className={styles.buttons}>
          {CASE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.btn} ${caseType === opt.value ? styles.btnActive : ''}`}
              onClick={() => setCaseType(opt.value)}
              aria-pressed={caseType === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Converted"
      inputPlaceholder="the quick brown fox"
      outputPlaceholder="THE QUICK BROWN FOX"
    />
  );
}

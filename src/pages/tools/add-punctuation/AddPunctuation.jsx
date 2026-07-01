import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import { useLanguage } from '../../../context/LanguageContext';
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

function useModeOptions(t) {
  return [
    { value: 'missing', label: t('punctAddMissing') },
    { value: 'always',  label: t('punctAlwaysAppend') },
    { value: 'replace', label: t('punctReplace') },
  ];
}

export default function AddPunctuation({ page }) {
  const [input, setInput] = useState('');
  const [punct, setPunct] = useState('.');
  const [mode, setMode] = useState('missing');
  const { t } = useLanguage();
  const modeOptions = useModeOptions(t);

  const output = input ? addPunctuation(input, punct, mode) : '';

  const EXAMPLE = 'First line\nSecond line\nThird line';
  const outputPlaceholder = addPunctuation(EXAMPLE, punct, mode);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <div className={styles.controls}>
          <ButtonGroup
            label={t('punctPunctuation')}
            options={PUNCT_OPTIONS}
            value={punct}
            onChange={setPunct}
          />
          <Select
            label={t('mode')}
            options={modeOptions}
            value={mode}
            onChange={setMode}
          />
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      outputLabel={t('punctWithPunctuation')}
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

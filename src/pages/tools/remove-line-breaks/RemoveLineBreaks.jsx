import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { removeLineBreaks } from '../../../utils/textTransforms';

const REPLACEMENT_OPTIONS = [
  { value: ' ',  label: 'Space' },
  { value: '',   label: 'Nothing (join)' },
  { value: ', ', label: 'Comma + space' },
  { value: ' | ', label: 'Pipe ( | )' },
];

export default function RemoveLineBreaks({ page }) {
  const [input, setInput] = useState('');
  const [replacement, setReplacement] = useState(' ');
  const { t } = useLanguage();

  const output = input ? removeLineBreaks(input, replacement) : '';

  const EXAMPLE = 'Line one\nLine two\nLine three';
  const outputPlaceholder = removeLineBreaks(EXAMPLE, replacement);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <Select
          label={t('rlbReplaceWith')}
          options={REPLACEMENT_OPTIONS}
          value={replacement}
          onChange={setReplacement}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('rlbMultiLine')}
      outputLabel={t('rlbSingleLine')}
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

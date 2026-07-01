import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { useLanguage } from '../../../context/LanguageContext';
import { reverseTextInEachWord } from '../../../utils/textTransforms';

export default function ReverseTextInWord({ page }) {
  const [input, setInput] = useState('');
  const { t } = useLanguage();
  const output = input ? reverseTextInEachWord(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('compareOriginal')}
      outputLabel={t('reverseEachWordLabel')}
      inputMono
      outputMono
    />
  );
}

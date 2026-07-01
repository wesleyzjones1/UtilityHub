import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { useLanguage } from '../../../context/LanguageContext';
import { removeTrailingWhitespace } from '../../../utils/textTransforms';

export default function RemoveTrailingWhitespace({ page }) {
  const [input, setInput] = useState('');
  const { t } = useLanguage();
  const output = input ? removeTrailingWhitespace(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      input={input}
      onInputChange={setInput}
      output={output}
      outputLabel={t('cleaned')}
      inputMono
      outputMono
      inputPlaceholder={"hello   \nworld  "}
      outputPlaceholder={"hello\nworld"}
    />
  );
}

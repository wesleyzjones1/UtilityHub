import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { useLanguage } from '../../../context/LanguageContext';
import { removeTextFormatting } from '../../../utils/textTransforms';

export default function RemoveTextFormatting({ page }) {
  const [input, setInput] = useState('');
  const { t } = useLanguage();
  const output = input ? removeTextFormatting(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('rtfFormattedInput')}
      outputLabel={t('plainText')}
      inputPlaceholder={"**bold** and _italic_ text"}
      outputPlaceholder="bold and italic text"
    />
  );
}

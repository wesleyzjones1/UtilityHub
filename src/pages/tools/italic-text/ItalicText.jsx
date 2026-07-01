import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { useLanguage } from '../../../context/LanguageContext';
import { toItalicText } from '../../../utils/textTransforms';

export default function ItalicText({ page }) {
  const [input, setInput] = useState('');
  const { t } = useLanguage();
  const output = input ? toItalicText(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      input={input}
      onInputChange={setInput}
      output={output}
      outputLabel={t('outputItalic')}
      inputPlaceholder="Hello world"
      outputPlaceholder="𝘏𝘦𝘭𝘭𝘰 𝘸𝘰𝘳𝘭𝘥"
    />
  );
}

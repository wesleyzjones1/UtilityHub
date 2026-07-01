import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { useLanguage } from '../../../context/LanguageContext';
import { toStrikethroughText } from '../../../utils/textTransforms';

export default function StrikethroughText({ page }) {
  const [input, setInput] = useState('');
  const { t } = useLanguage();
  const output = input ? toStrikethroughText(input) : '';

  return (
    <DualPanelTemplate
      page={page}
      input={input}
      onInputChange={setInput}
      output={output}
      outputLabel={t('outputStrikethrough')}
      inputPlaceholder="Hello world"
      outputPlaceholder="H̶e̶l̶l̶o̶ ̶w̶o̶r̶l̶d"
    />
  );
}

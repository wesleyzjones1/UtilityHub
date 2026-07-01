import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { formatXML, minifyXML } from '../../../utils/formatters';

export default function XmlFormatter({ page }) {
  const [mode, setMode] = useState('format');
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  let output = '';
  if (input.trim()) {
    try {
      output = mode === 'minify' ? minifyXML(input) : formatXML(input);
    } catch (e) {
      output = `<!-- Error: ${e.message} -->`;
    }
  }

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <Select
          label={t('mode')}
          options={[{ value: 'format', label: t('format') }, { value: 'minify', label: t('minify') }]}
          value={mode}
          onChange={setMode}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('xmlInput')}
      outputLabel={t('xmlOutput')}
      inputMono
      outputMono
      inputPlaceholder="Paste XML here…"
      outputPlaceholder="Output appears here…"
    />
  );
}

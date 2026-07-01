import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { formatJSON, minifyJSON } from '../../../utils/formatters';

export default function JsonFormatter({ page }) {
  const [mode, setMode] = useState('format');
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const modeOptions = [
    { value: 'format', label: t('format') },
    { value: 'minify', label: t('minify') },
  ];

  let output = '';
  if (input.trim()) {
    try {
      output = mode === 'minify' ? minifyJSON(input) : formatJSON(input);
    } catch (e) {
      output = `// Error: ${e.message}`;
    }
  }

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <Select
          label={t('mode')}
          options={modeOptions}
          value={mode}
          onChange={setMode}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('jsonInput')}
      outputLabel={t('jsonOutput')}
      inputMono
      outputMono
      inputPlaceholder='Paste JSON here… e.g. {"key": "value"}'
      outputPlaceholder="Output appears here…"
    />
  );
}

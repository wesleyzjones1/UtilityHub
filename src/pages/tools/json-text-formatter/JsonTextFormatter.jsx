import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { encodeJSONText, decodeJSONText } from '../../../utils/formatters';

export default function JsonTextFormatter({ page }) {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const modeOptions = [
    { value: 'encode', label: `${t('plainText')} → ${t('jsonString')}` },
    { value: 'decode', label: `${t('jsonString')} → ${t('plainText')}` },
  ];

  let output = '';
  if (input.trim()) {
    try {
      output = mode === 'encode' ? encodeJSONText(input) : decodeJSONText(input);
    } catch (e) {
      output = `Error: ${e.message}`;
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
      inputLabel={mode === 'encode' ? t('plainText') : t('jsonString')}
      outputLabel={mode === 'encode' ? t('jsonString') : t('plainText')}
      inputMono
      outputMono
      inputPlaceholder={
        mode === 'encode'
          ? 'Paste plain text here…'
          : 'Paste JSON string here… e.g. "hello\\nworld"'
      }
      outputPlaceholder="Output appears here…"
    />
  );
}

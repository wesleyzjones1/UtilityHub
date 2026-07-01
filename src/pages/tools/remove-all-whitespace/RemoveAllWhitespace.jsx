import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { removeAllWhitespace } from '../../../utils/textTransforms';

function useModeOptions(t) {
  return [
    { value: 'all',    label: t('wsAllWhitespace') },
    { value: 'spaces', label: t('wsSpacesOnly') },
    { value: 'tabs',   label: t('wsTabsOnly') },
    { value: 'extra',  label: t('wsExtraSpaces') },
  ];
}

export default function RemoveAllWhitespace({ page }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('all');
  const { t } = useLanguage();
  const modeOptions = useModeOptions(t);

  const output = input ? removeAllWhitespace(input, mode) : '';

  const EXAMPLE = 'hello   world';
  const outputPlaceholder = removeAllWhitespace(EXAMPLE, mode);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <Select
          label={t('remove')}
          options={modeOptions}
          value={mode}
          onChange={setMode}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      outputLabel={t('cleaned')}
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import { useLanguage } from '../../../context/LanguageContext';
import { reverseText, reverseWords, reverseTextInEachWord } from '../../../utils/textTransforms';

function useModeOptions(t) {
  return [
    { value: 'characters', label: t('reverseCharacters') },
    { value: 'words',      label: t('reverseWordOrder') },
    { value: 'each-word',  label: t('reverseEachWord') },
  ];
}

export default function ReverseText({ page }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('characters');
  const { t } = useLanguage();
  const modeOptions = useModeOptions(t);

  const output = input
    ? mode === 'words'     ? reverseWords(input)
    : mode === 'each-word' ? reverseTextInEachWord(input)
    : reverseText(input)
    : '';

  const EXAMPLE = 'hello world';
  const outputPlaceholder =
    mode === 'words'     ? reverseWords(EXAMPLE) :
    mode === 'each-word' ? reverseTextInEachWord(EXAMPLE) :
    reverseText(EXAMPLE);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <ButtonGroup
          label={t('mode')}
          options={modeOptions}
          value={mode}
          onChange={setMode}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('compareOriginal')}
      outputLabel={t('reverseReversed')}
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

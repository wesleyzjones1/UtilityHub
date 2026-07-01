import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import { useLanguage } from '../../../context/LanguageContext';
import { toBoldText, toItalicText, toStrikethroughText } from '../../../utils/textTransforms';

const TRANSFORMS = {
  bold:          toBoldText,
  italic:        toItalicText,
  strikethrough: toStrikethroughText,
};

export default function BoldText({ page }) {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('bold');
  const { t } = useLanguage();

  const styleOptions = [
    { value: 'bold',          label: t('styleBold') },
    { value: 'italic',        label: t('styleItalic') },
    { value: 'strikethrough', label: t('styleStrikethrough') },
  ];

  const outputLabels = {
    bold:          t('outputBold'),
    italic:        t('outputItalic'),
    strikethrough: t('outputStrikethrough'),
  };

  const transform = TRANSFORMS[style];
  const output = input ? transform(input) : '';

  const EXAMPLE = 'Hello world';
  const outputPlaceholder = transform(EXAMPLE);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <ButtonGroup
          label={t('style')}
          options={styleOptions}
          value={style}
          onChange={setStyle}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      outputLabel={outputLabels[style]}
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

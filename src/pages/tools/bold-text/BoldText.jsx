import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import { toBoldText, toItalicText, toStrikethroughText } from '../../../utils/textTransforms';

const STYLE_OPTIONS = [
  { value: 'bold',          label: 'Bold' },
  { value: 'italic',        label: 'Italic' },
  { value: 'strikethrough', label: 'Strikethrough' },
];

const TRANSFORMS = {
  bold:          toBoldText,
  italic:        toItalicText,
  strikethrough: toStrikethroughText,
};

const OUTPUT_LABELS = {
  bold:          'Bold Output',
  italic:        'Italic Output',
  strikethrough: 'Strikethrough Output',
};

const HOW_TO_USE = [
  'Type or paste your text in the input panel.',
  'Choose a style — Bold, Italic, or Strikethrough.',
  'The output uses Unicode characters that work anywhere: social media, chat apps, documents.',
  'Copy and paste the result wherever you need it.',
];

export default function BoldText({ page }) {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('bold');

  const transform = TRANSFORMS[style];
  const output = input ? transform(input) : '';

  const EXAMPLE = 'Hello world';
  const outputPlaceholder = transform(EXAMPLE);

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <ButtonGroup
          label="Style"
          options={STYLE_OPTIONS}
          value={style}
          onChange={setStyle}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel={OUTPUT_LABELS[style]}
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

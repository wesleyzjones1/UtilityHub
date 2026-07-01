import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { columnsToInline, inlineToColumns } from '../../../utils/textTransforms';
import styles from './InlineColumnConverter.module.css';

const SEPARATOR_OPTIONS = [
  { value: ', ', label: 'Comma + space (, )' },
  { value: ',',  label: 'Comma (,)' },
  { value: ';',  label: 'Semicolon (;)' },
  { value: '|',  label: 'Pipe (|)' },
  { value: '\t', label: 'Tab' },
  { value: ' ',  label: 'Space' },
  { value: '',   label: 'Nothing (join)' },
];

const SEPARATOR_OPTIONS_TO_COLUMN = SEPARATOR_OPTIONS.filter(o => o.value !== '');

export default function InlineColumnConverter({ page }) {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState('to-inline');
  const [separator, setSeparator] = useState(', ');
  const { t } = useLanguage();

  const toInline = direction === 'to-inline';

  function handleDirectionChange(val) {
    if (val === 'to-column' && separator === '') setSeparator(', ');
    setDirection(val);
  }

  const output = input
    ? toInline
      ? columnsToInline(input, separator)
      : inlineToColumns(input, separator)
    : '';

  const ITEMS = ['apple', 'banana', 'cherry'];
  const inputExample = toInline ? ITEMS.join('\n') : ITEMS.join(separator || ', ');
  const outputPlaceholder = toInline
    ? columnsToInline(ITEMS.join('\n'), separator)
    : inlineToColumns(ITEMS.join(separator), separator);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <div className={styles.controls}>
          <ButtonGroup
            options={[
              { value: 'to-inline', label: t('iccColumnToInline') },
              { value: 'to-column', label: t('iccInlineToColumn') },
            ]}
            value={direction}
            onChange={handleDirectionChange}
          />
          <Select
            label={t('separator')}
            options={toInline ? SEPARATOR_OPTIONS : SEPARATOR_OPTIONS_TO_COLUMN}
            value={separator}
            onChange={setSeparator}
          />
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={toInline ? t('iccColumnPerLine') : t('iccInlineSeparated')}
      outputLabel={toInline ? t('iccInlineSeparated') : t('iccColumnPerLine')}
      inputPlaceholder={inputExample}
      outputPlaceholder={outputPlaceholder}
      inputMono
      outputMono
    />
  );
}

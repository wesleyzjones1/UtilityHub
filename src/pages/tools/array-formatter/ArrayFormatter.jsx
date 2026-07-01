import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { formatArray } from '../../../utils/converters';

const FORMAT_OPTIONS = [
  { value: 'js',           label: "JS array  ['a', 'b']" },
  { value: 'js-multiline', label: 'JS array (multiline)' },
  { value: 'json',         label: 'JSON array ["a","b"]' },
  { value: 'json-pretty',  label: 'JSON (pretty)' },
  { value: 'python',       label: "Python list ['a', 'b']" },
  { value: 'csv',          label: 'Comma-separated' },
  { value: 'sql-in',       label: "SQL IN ('a', 'b')" },
];

const QUOTE_OPTIONS = [
  { value: 'single', label: "Single quotes '" },
  { value: 'double', label: 'Double quotes "' },
  { value: 'none',   label: 'No quotes' },
];

export default function ArrayFormatter({ page }) {
  const [input, setInput]   = useState('');
  const [format, setFormat] = useState('js');
  const [quote, setQuote]   = useState('single');
  const { t } = useLanguage();

  const output = input ? formatArray(input, format, quote) : '';

  const EXAMPLE = 'apple\nbanana\ncherry';
  const outputPlaceholder = formatArray(EXAMPLE, format, quote);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <>
          <Select
            label={t('format')}
            options={FORMAT_OPTIONS}
            value={format}
            onChange={setFormat}
          />
          <Select
            label={t('quoteStyle')}
            options={QUOTE_OPTIONS}
            value={quote}
            onChange={setQuote}
          />
        </>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('arrayItems')}
      outputLabel={t('converted')}
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

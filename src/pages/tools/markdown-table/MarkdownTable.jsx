import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { generateMarkdownTable } from '../../../utils/converters';

const SEP_OPTIONS = [
  { value: 'auto',  label: 'Auto-detect' },
  { value: ',',     label: 'Comma (CSV)' },
  { value: '\t',    label: 'Tab (TSV)' },
  { value: ';',     label: 'Semicolon' },
  { value: '|',     label: 'Pipe' },
];

const EXAMPLE = `Name,Age,City
Alice,30,New York
Bob,25,Los Angeles
Carol,35,Chicago`;

export default function MarkdownTable({ page }) {
  const [input, setInput]     = useState('');
  const [separator, setSep]   = useState('auto');
  const { t } = useLanguage();

  const output = input ? generateMarkdownTable(input, separator) : '';

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <Select
          label={t('separator')}
          options={SEP_OPTIONS}
          value={separator}
          onChange={setSep}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('mdtDelimitedData')}
      outputLabel={t('mdtMarkdownTable')}
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
    />
  );
}

import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { generateMarkdownTable } from '../../../utils/converters';

const SEP_OPTIONS = [
  { value: 'auto',  label: 'Auto-detect' },
  { value: ',',     label: 'Comma (CSV)' },
  { value: '\t',    label: 'Tab (TSV)' },
  { value: ';',     label: 'Semicolon' },
  { value: '|',     label: 'Pipe' },
];

const HOW_TO_USE = [
  'Paste comma-separated, tab-separated, or pipe-separated data in the input panel.',
  'The first row is treated as the header row.',
  'Choose the separator or leave it on Auto-detect.',
  'Copy the output and paste it directly into any Markdown editor.',
];

const EXAMPLE = `Name,Age,City
Alice,30,New York
Bob,25,Los Angeles
Carol,35,Chicago`;

export default function MarkdownTable({ page }) {
  const [input, setInput]     = useState('');
  const [separator, setSep]   = useState('auto');

  const output = input ? generateMarkdownTable(input, separator) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <Select
          label="Separator"
          options={SEP_OPTIONS}
          value={separator}
          onChange={setSep}
        />
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Delimited Data"
      outputLabel="Markdown Table"
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
    />
  );
}

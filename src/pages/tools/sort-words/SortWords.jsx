import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { sortWords } from '../../../utils/textTransforms';
import styles from './SortWords.module.css';

const ORDER_OPTIONS = [
  { value: 'asc',         label: 'A → Z' },
  { value: 'desc',        label: 'Z → A' },
  { value: 'length-asc',  label: 'Shortest first' },
  { value: 'length-desc', label: 'Longest first' },
];

const HOW_TO_USE = [
  'Paste or type words in the input panel (separated by spaces or newlines).',
  'Choose a sort order from the dropdown.',
  'Toggle case sensitivity to control uppercase/lowercase ordering.',
  'Each sorted word appears on its own line in the output.',
];

export default function SortWords({ page }) {
  const [input, setInput] = useState('');
  const [order, setOrder] = useState('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const output = input ? sortWords(input, order, caseSensitive) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <div className={styles.controls}>
          <Select
            label="Sort order"
            options={ORDER_OPTIONS}
            value={order}
            onChange={setOrder}
          />
          <Toggle
            checked={caseSensitive}
            onChange={setCaseSensitive}
            label="Case sensitive"
          />
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Words"
      outputLabel="Sorted"
      inputMono
      outputMono
    />
  );
}

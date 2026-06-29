import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { sortNumbers } from '../../../utils/converters';

const ORDER_OPTIONS = [
  { value: 'asc',  label: 'Smallest first' },
  { value: 'desc', label: 'Largest first' },
];

const HOW_TO_USE = [
  'Paste or type numbers — one per line or comma-separated.',
  'Choose a sort order.',
  'Toggle "Remove duplicates" to keep only unique values.',
  'Non-numeric lines are ignored automatically.',
];

export default function NumberSorter({ page }) {
  const [input, setInput] = useState('');
  const [order, setOrder] = useState('asc');
  const [removeDuplicates, setRemoveDuplicates] = useState(false);

  const output = input ? sortNumbers(input, order, removeDuplicates) : '';

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <>
          <Select
            label="Order"
            options={ORDER_OPTIONS}
            value={order}
            onChange={setOrder}
          />
          <Toggle
            checked={removeDuplicates}
            onChange={setRemoveDuplicates}
            label="Remove duplicates"
          />
        </>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Numbers"
      outputLabel="Sorted"
      inputMono
      outputMono
      inputPlaceholder="3&#10;1&#10;2&#10;or: 3, 1, 2"
    />
  );
}

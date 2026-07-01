import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { useLanguage } from '../../../context/LanguageContext';
import { sortNumbers } from '../../../utils/converters';

function useOrderOptions(t) {
  return [
    { value: 'asc',  label: t('nsSmallestFirst') },
    { value: 'desc', label: t('nsLargestFirst') },
  ];
}

export default function NumberSorter({ page }) {
  const [input, setInput] = useState('');
  const [order, setOrder] = useState('asc');
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const { t } = useLanguage();
  const orderOptions = useOrderOptions(t);

  const output = input ? sortNumbers(input, order, removeDuplicates) : '';

  const EXAMPLE = '3\n1\n4\n1\n2';
  const outputPlaceholder = sortNumbers(EXAMPLE, order, removeDuplicates);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <>
          <Select
            label={t('order')}
            options={orderOptions}
            value={order}
            onChange={setOrder}
          />
          <Toggle
            checked={removeDuplicates}
            onChange={setRemoveDuplicates}
            label={t('nsRemoveDuplicates')}
          />
        </>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('nsNumbers')}
      outputLabel={t('sortSorted')}
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

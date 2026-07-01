import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { useLanguage } from '../../../context/LanguageContext';
import { sortWords } from '../../../utils/textTransforms';
import styles from './SortWords.module.css';

function useOrderOptions(t) {
  return [
    { value: 'asc',         label: t('sortAscending') },
    { value: 'desc',        label: t('sortDescending') },
    { value: 'length-asc',  label: t('sortShortestFirst') },
    { value: 'length-desc', label: t('sortLongestFirst') },
  ];
}

export default function SortWords({ page }) {
  const [input, setInput] = useState('');
  const [order, setOrder] = useState('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const { t } = useLanguage();
  const orderOptions = useOrderOptions(t);

  const output = input ? sortWords(input, order, caseSensitive) : '';

  const EXAMPLE = 'banana\napple\ncherry';
  const outputPlaceholder = sortWords(EXAMPLE, order, caseSensitive);

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <div className={styles.controls}>
          <ButtonGroup
            label={t('sortOrder')}
            options={orderOptions}
            value={order}
            onChange={setOrder}
          />
          <Toggle
            checked={caseSensitive}
            onChange={setCaseSensitive}
            label={t('sortCaseSensitive')}
          />
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel={t('sortWords')}
      outputLabel={t('sortSorted')}
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

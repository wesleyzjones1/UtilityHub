import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { useLanguage } from '../../../context/LanguageContext';
import { removeCharacter } from '../../../utils/textTransforms';
import styles from './RemoveCharacter.module.css';

export default function RemoveCharacter({ page }) {
  const [input, setInput] = useState('');
  const [chars, setChars] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const { t } = useLanguage();

  const output = input && chars ? removeCharacter(input, chars, caseSensitive) : input;

  const EXAMPLE = 'he##llo wor##ld';
  const outputPlaceholder = chars
    ? removeCharacter(EXAMPLE, chars, caseSensitive)
    : EXAMPLE;

  return (
    <DualPanelTemplate
      page={page}
      topControls={
        <div className={styles.controls}>
          <div className={styles.charInputWrap}>
            <label className={styles.charLabel} htmlFor="remove-chars">
              Characters to remove
            </label>
            <input
              id="remove-chars"
              type="text"
              className={styles.charInput}
              value={chars}
              onChange={e => setChars(e.target.value)}
              placeholder="e.g.  ,;!"
              spellCheck={false}
            />
          </div>
          <Toggle
            checked={caseSensitive}
            onChange={setCaseSensitive}
            label={t('freqCaseSensitive')}
          />
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      outputLabel={t('cleaned')}
      inputMono
      outputMono
      inputPlaceholder={EXAMPLE}
      outputPlaceholder={outputPlaceholder}
    />
  );
}

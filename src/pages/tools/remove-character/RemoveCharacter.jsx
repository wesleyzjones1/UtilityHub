import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { removeCharacter } from '../../../utils/textTransforms';
import styles from './RemoveCharacter.module.css';

const HOW_TO_USE = [
  'Paste or type your text in the input panel.',
  'Type the character(s) you want to remove in the "Characters to remove" field.',
  'Toggle case sensitivity if needed.',
  'Click "Copy" to copy the result.',
];

export default function RemoveCharacter({ page }) {
  const [input, setInput] = useState('');
  const [chars, setChars] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);

  const output = input && chars ? removeCharacter(input, chars, caseSensitive) : input;

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
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
            label="Case sensitive"
          />
        </div>
      }
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Cleaned"
      inputMono
      outputMono
      inputPlaceholder="he##llo wor##ld"
      outputPlaceholder="hello world"
    />
  );
}

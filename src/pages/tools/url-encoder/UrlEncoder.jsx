import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './UrlEncoder.module.css';

function encode(input) {
  return encodeURIComponent(input);
}

function decode(input) {
  try {
    return decodeURIComponent(input);
  } catch {
    return 'Error: Invalid encoded input.';
  }
}

export default function UrlEncoder({ page }) {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const output = input.trim()
    ? mode === 'encode' ? encode(input) : decode(input)
    : '';

  const ENCODE_EXAMPLE = 'hello world & more';
  const DECODE_EXAMPLE = 'hello%20world%20%26%20more';
  const inputExample  = mode === 'encode' ? ENCODE_EXAMPLE : DECODE_EXAMPLE;
  const outputExample = mode === 'encode' ? encode(ENCODE_EXAMPLE) : decode(DECODE_EXAMPLE);

  const modeSelector = (
    <div className={styles.controls}>
      <label htmlFor="url-encoder-mode" className={styles.controlLabel}>{t('mode')}</label>
      <select
        id="url-encoder-mode"
        aria-label={t('mode')}
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className={styles.select}
      >
        <option value="encode">Encode</option>
        <option value="decode">Decode</option>
      </select>
    </div>
  );

  return (
    <DualPanelTemplate
      page={page}
      topControls={modeSelector}
      input={input}
      onInputChange={setInput}
      output={output}
      inputMono
      outputMono
      inputPlaceholder={inputExample}
      outputPlaceholder={outputExample}
    />
  );
}

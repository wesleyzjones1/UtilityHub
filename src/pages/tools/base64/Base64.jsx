import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import { useUrlState } from '../../../hooks/useUrlState';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './Base64.module.css';

function encode(input) {
  return btoa(unescape(encodeURIComponent(input)));
}

function decode(input) {
  try {
    return decodeURIComponent(escape(atob(input)));
  } catch {
    return 'Error: Invalid Base64 input.';
  }
}

export default function Base64({ page }) {
  const [mode, setMode] = useUrlState('mode', 'encode');
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const output = input.trim()
    ? mode === 'encode' ? encode(input) : decode(input)
    : '';

  const ENCODE_EXAMPLE = 'Hello, world!';
  const DECODE_EXAMPLE = 'SGVsbG8sIHdvcmxkIQ==';
  const inputExample  = mode === 'encode' ? ENCODE_EXAMPLE : DECODE_EXAMPLE;
  const outputExample = mode === 'encode' ? encode(ENCODE_EXAMPLE) : decode(DECODE_EXAMPLE);

  const modeSelector = (
    <div className={styles.controls}>
      <label htmlFor="base64-mode" className={styles.controlLabel}>{t('mode')}</label>
      <select
        id="base64-mode"
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

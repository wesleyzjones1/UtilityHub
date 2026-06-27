import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import styles from './UrlEncoder.module.css';

const HOW_TO_USE = [
  'Select Encode to percent-encode special characters, or Decode to reverse it.',
  'Paste your URL component or encoded string into the left panel.',
  'The result appears instantly in the right panel.',
  'Copy the output using the copy button.',
];

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

  const output = input.trim()
    ? mode === 'encode' ? encode(input) : decode(input)
    : '';

  const modeSelector = (
    <div className={styles.controls}>
      <label htmlFor="url-encoder-mode" className={styles.controlLabel}>Mode</label>
      <select
        id="url-encoder-mode"
        aria-label="Mode"
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
      howToUse={HOW_TO_USE}
      topControls={modeSelector}
      input={input}
      onInputChange={setInput}
      output={output}
      inputLabel="Input"
      outputLabel="Output"
      inputMono
      outputMono
      inputPlaceholder={mode === 'encode' ? 'Enter text to encode…' : 'Enter encoded URL to decode…'}
      outputPlaceholder="Result will appear here…"
    />
  );
}

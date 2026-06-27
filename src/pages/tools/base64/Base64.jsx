import { useState } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import styles from './Base64.module.css';

const HOW_TO_USE = [
  'Select Encode to convert plain text to Base64, or Decode to reverse it.',
  'Type or paste your input into the left panel.',
  'The result appears instantly in the right panel.',
  'Copy the output using the copy button.',
];

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
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');

  const output = input.trim()
    ? mode === 'encode' ? encode(input) : decode(input)
    : '';

  const modeSelector = (
    <div className={styles.controls}>
      <label htmlFor="base64-mode" className={styles.controlLabel}>Mode</label>
      <select
        id="base64-mode"
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
      inputPlaceholder={mode === 'encode' ? 'Enter text to encode…' : 'Enter Base64 to decode…'}
      outputPlaceholder="Result will appear here…"
    />
  );
}

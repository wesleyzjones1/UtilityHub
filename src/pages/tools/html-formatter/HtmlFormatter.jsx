import { useState, useEffect } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { minifyHTML } from '../../../utils/formatters';

const MODE_OPTIONS = [
  { value: 'format', label: 'Format' },
  { value: 'minify', label: 'Minify' },
];

const HOW_TO_USE = [
  'Paste your HTML into the input panel.',
  'Choose Format to prettify with proper indentation, or Minify to compress.',
  'Copy the result from the output panel.',
];

export default function HtmlFormatter({ page }) {
  const [mode, setMode] = useState('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!input.trim()) { setOutput(''); setError(null); return; }

    if (mode === 'minify') {
      setOutput(minifyHTML(input));
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [{ format }, { default: parserHtml }] = await Promise.all([
          import('prettier/standalone'),
          import('prettier/plugins/html'),
        ]);
        const result = await format(input, { parser: 'html', plugins: [parserHtml] });
        if (!cancelled) { setOutput(result); setError(null); }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();

    return () => { cancelled = true; };
  }, [input, mode]);

  return (
    <DualPanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <Select
          label="Mode"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
      }
      input={input}
      onInputChange={setInput}
      output={error ? `<!-- Error: ${error} -->` : output}
      inputLabel="HTML Input"
      outputLabel="HTML Output"
      inputMono
      outputMono
      inputPlaceholder={mode === 'minify' ? "<div>\n  <p>Hello world</p>\n</div>" : "<div><p>Hello world</p></div>"}
      outputPlaceholder={mode === 'minify' ? "<div><p>Hello world</p></div>" : "<div>\n  <p>Hello world</p>\n</div>"}
    />
  );
}

import { useState, useEffect } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { minifyJS } from '../../../utils/formatters';

const MODE_OPTIONS = [
  { value: 'format', label: 'Format' },
  { value: 'minify', label: 'Minify' },
];

const HOW_TO_USE = [
  'Paste your TypeScript into the input panel.',
  'Choose Format to prettify, or Minify to strip whitespace and comments.',
  'Copy the result from the output panel.',
];

export default function TypescriptFormatter({ page }) {
  const [mode, setMode] = useState('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!input.trim()) { setOutput(''); setError(null); return; }

    if (mode === 'minify') {
      setOutput(minifyJS(input));
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [{ format }, { default: parserTypescript }, { default: parserEstree }] = await Promise.all([
          import('prettier/standalone'),
          import('prettier/plugins/typescript'),
          import('prettier/plugins/estree'),
        ]);
        const result = await format(input, {
          parser: 'typescript',
          plugins: [parserTypescript, parserEstree],
        });
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
      output={error ? `// Error: ${error}` : output}
      inputLabel="TypeScript Input"
      outputLabel="TypeScript Output"
      inputMono
      outputMono
      inputPlaceholder="function greet(name:string){return 'Hi '+name;}"
      outputPlaceholder={"function greet(name: string) {\n  return 'Hi ' + name;\n}"}
    />
  );
}

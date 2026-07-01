import { useState, useEffect } from 'react';
import DualPanelTemplate from '../../../templates/DualPanelTemplate/DualPanelTemplate';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import { minifyJS } from '../../../utils/formatters';

export default function TypescriptFormatter({ page }) {
  const [mode, setMode] = useState('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const { t } = useLanguage();

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
      topControls={
        <Select
          label={t('mode')}
          options={[{ value: 'format', label: t('format') }, { value: 'minify', label: t('minify') }]}
          value={mode}
          onChange={setMode}
        />
      }
      input={input}
      onInputChange={setInput}
      output={error ? `// Error: ${error}` : output}
      inputLabel={t('tsInput')}
      outputLabel={t('tsOutput')}
      inputMono
      outputMono
      inputPlaceholder={mode === 'minify' ? "function greet(name: string) {\n  return 'Hi ' + name;\n}" : "function greet(name:string){return 'Hi '+name;}"}
      outputPlaceholder={mode === 'minify' ? "function greet(name:string){return 'Hi '+name;}" : "function greet(name: string) {\n  return 'Hi ' + name;\n}"}
    />
  );
}

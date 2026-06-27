import { useState, useEffect } from 'react';
import { marked } from 'marked';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import Select from '../../../components/ui/Select/Select';
import styles from './MarkdownPreview.module.css';

const MODE_OPTIONS = [
  { value: 'preview', label: 'Preview' },
  { value: 'format', label: 'Format' },
];

const HOW_TO_USE = [
  'Type or paste Markdown in the left panel.',
  'Switch to Preview to see rendered HTML, or Format to run Prettier on your Markdown.',
  'Copy the formatted Markdown from the output panel.',
];

export default function MarkdownPreview({ page }) {
  const [mode, setMode] = useState('preview');
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [formatError, setFormatError] = useState(null);

  const html = input ? marked.parse(input) : '';

  useEffect(() => {
    if (mode !== 'format' || !input.trim()) {
      setFormatted('');
      setFormatError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [{ format }, { default: parserMarkdown }] = await Promise.all([
          import('prettier/standalone'),
          import('prettier/plugins/markdown'),
        ]);
        const result = await format(input, { parser: 'markdown', plugins: [parserMarkdown] });
        if (!cancelled) { setFormatted(result); setFormatError(null); }
      } catch (e) {
        if (!cancelled) setFormatError(e.message);
      }
    })();

    return () => { cancelled = true; };
  }, [input, mode]);

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.topBar}>
        <Select
          label="Right panel"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
      </div>
      <div className={styles.panels}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>Markdown Input</span>
          </div>
          <Textarea
            value={input}
            onChange={setInput}
            placeholder="Type Markdown here…"
            mono
            rows={16}
            resize="vertical"
            aria-label="Markdown Input"
          />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>
              {mode === 'preview' ? 'HTML Preview' : 'Formatted Markdown'}
            </span>
            {mode === 'format' && formatted && <CopyButton value={formatted} size="sm" />}
          </div>
          {mode === 'preview' ? (
            <div
              className={styles.preview}
              aria-label="HTML Preview"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <Textarea
              value={formatError ? `<!-- Error: ${formatError} -->` : formatted}
              readOnly
              placeholder="Formatted Markdown appears here…"
              mono
              rows={16}
              resize="vertical"
              aria-label="Formatted Markdown"
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}

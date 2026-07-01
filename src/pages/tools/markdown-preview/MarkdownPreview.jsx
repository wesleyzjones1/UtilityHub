import { useState, useEffect } from 'react';
import { marked } from 'marked';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import Select from '../../../components/ui/Select/Select';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './MarkdownPreview.module.css';

export default function MarkdownPreview({ page }) {
  const [mode, setMode] = useState('preview');
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [formatError, setFormatError] = useState(null);
  const { t } = useLanguage();

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
    <PageShell page={page}>
      <div className={styles.topBar}>
        <Select
          label={t('mdRightPanel')}
          options={[{ value: 'preview', label: t('preview') }, { value: 'format', label: t('format') }]}
          value={mode}
          onChange={setMode}
        />
      </div>
      <div className={styles.panels}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{t('mdMarkdownInput')}</span>
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
              {mode === 'preview' ? t('mdHtmlPreview') : t('mdFormattedMarkdown')}
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

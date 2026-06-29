import PageShell from '../PageShell/PageShell';
import Textarea from '../../components/ui/Textarea/Textarea';
import CopyButton from '../../components/ui/CopyButton/CopyButton';
import styles from './DualPanelTemplate.module.css';

/**
 * Two-panel input → output layout.
 * Used by: Case Converter, JSON Formatter, Text Diff, Markdown Preview, etc.
 */
export default function DualPanelTemplate({
  page,
  howToUse = [],
  topControls,
  inputLabel = 'Input',
  outputLabel = 'Output',
  input = '',
  onInputChange,
  output = '',
  outputMono = true,
  inputMono = false,
  inputRows = 12,
  outputRows = 12,
  inputPlaceholder = 'Paste or type your input here…',
  outputPlaceholder = 'Output will appear here…',
  actions,
}) {
  return (
    <PageShell page={page} howToUse={howToUse}>
      {topControls && (
        <div className={styles.topBar}>
          {topControls}
        </div>
      )}

      <div className={styles.panels}>
        {/* Input panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{inputLabel}</span>
            {input && onInputChange && (
              <button
                className={styles.clearBtn}
                onClick={() => onInputChange('')}
                aria-label="Clear input"
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>
          <Textarea
            className={styles.field}
            value={input}
            onChange={onInputChange}
            placeholder={inputPlaceholder}
            mono={inputMono}
            rows={inputRows}
            resize="vertical"
            aria-label={inputLabel}
          />
        </div>

        {/* Arrow divider */}
        <div className={styles.divider} aria-hidden="true">
          <ArrowIcon />
        </div>

        {/* Output panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{outputLabel}</span>
            {output && <CopyButton value={output} size="sm" />}
          </div>
          <Textarea
            className={styles.field}
            value={output}
            readOnly
            placeholder={outputPlaceholder}
            mono={outputMono}
            rows={outputRows}
            resize="vertical"
            aria-label={outputLabel}
          />
        </div>
      </div>

      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </PageShell>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

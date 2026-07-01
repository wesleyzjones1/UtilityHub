import PageShell from '../PageShell/PageShell';
import Textarea from '../../components/ui/Textarea/Textarea';
import CopyButton from '../../components/ui/CopyButton/CopyButton';
import { useLanguage } from '../../context/LanguageContext';
import styles from './DualPanelTemplate.module.css';

/**
 * Two-panel input → output layout.
 * Used by: Case Converter, JSON Formatter, Text Diff, Markdown Preview, etc.
 */
export default function DualPanelTemplate({
  page,
  topControls,
  inputControls,
  outputControls,
  inputLabel,
  outputLabel,
  input = '',
  onInputChange,
  output = '',
  outputMono = true,
  inputMono = false,
  inputRows = 12,
  outputRows = 12,
  inputPlaceholder,
  outputPlaceholder,
  actions,
  hideHeaderActions = false,
}) {
  const { t } = useLanguage();
  const resolvedInputLabel = inputLabel ?? t('input');
  const resolvedOutputLabel = outputLabel ?? t('output');
  const resolvedInputPlaceholder = inputPlaceholder ?? 'Paste or type your input here…';
  const resolvedOutputPlaceholder = outputPlaceholder ?? 'Output will appear here…';

  return (
    <PageShell page={page}>
      {topControls && (
        <div className={styles.topBar}>
          {topControls}
        </div>
      )}

      <div className={styles.panels}>
        {/* Input panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{resolvedInputLabel}</span>
            {!hideHeaderActions && input && onInputChange && (
              <button
                className={styles.clearBtn}
                onClick={() => onInputChange('')}
                aria-label={t('clearInput')}
                title={t('clearInput')}
              >
                ✕
              </button>
            )}
          </div>
          {inputControls && (
            <div className={styles.panelControls}>{inputControls}</div>
          )}
          <Textarea
            className={styles.field}
            value={input}
            onChange={onInputChange}
            placeholder={resolvedInputPlaceholder}
            mono={inputMono}
            rows={inputRows}
            resize="vertical"
            aria-label={resolvedInputLabel}
          />
        </div>

        {/* Arrow divider */}
        <div className={styles.divider} aria-hidden="true">
          <ArrowIcon />
        </div>

        {/* Output panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{resolvedOutputLabel}</span>
            {!hideHeaderActions && output && <CopyButton value={output} size="sm" />}
          </div>
          {outputControls && (
            <div className={styles.panelControls}>{outputControls}</div>
          )}
          <Textarea
            className={styles.field}
            value={output}
            readOnly
            placeholder={resolvedOutputPlaceholder}
            mono={outputMono}
            rows={outputRows}
            resize="vertical"
            aria-label={resolvedOutputLabel}
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

import PageShell from '../PageShell/PageShell';
import ImageDropZone from '../../components/ui/ImageDropZone/ImageDropZone';
import Textarea from '../../components/ui/Textarea/Textarea';
import CopyButton from '../../components/ui/CopyButton/CopyButton';
import styles from './ImageToTextTemplate.module.css';

/**
 * Two-panel layout: image drop (45%) left + text output (55%) right.
 * Used by: Image to Base64, OCR (future), EXIF reader (future).
 */
export default function ImageToTextTemplate({
  page,
  howToUse = [],
  topControls,
  actions,
  onFile,
  onClear,
  file,
  accept,
  maxSizeBytes,
  dropLabel,
  dropSublabel,
  outputLabel = 'Output',
  output = '',
  outputMono = true,
  outputRows = 12,
  outputPlaceholder = 'Output will appear here…',
}) {
  return (
    <PageShell page={page} howToUse={howToUse}>
      {topControls && (
        <div className={styles.topBar}>
          {topControls}
        </div>
      )}

      <div className={styles.layout}>
        {/* Image drop (45%) */}
        <div className={styles.imageSide}>
          <ImageDropZone
            onFile={onFile}
            onClear={onClear}
            file={file}
            accept={accept}
            maxSizeBytes={maxSizeBytes}
            label={dropLabel}
            sublabel={dropSublabel}
          />
        </div>

        {/* Arrow indicator */}
        <div className={styles.divider} aria-hidden="true">
          <ArrowIcon />
        </div>

        {/* Text output (55%) */}
        <div className={styles.textSide}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{outputLabel}</span>
            {output && <CopyButton value={output} size="sm" />}
          </div>
          <Textarea
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

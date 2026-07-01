import PageShell from '../PageShell/PageShell';
import ImageDropZone from '../../components/ui/ImageDropZone/ImageDropZone';
import styles from './ImageDropTemplate.module.css';

/**
 * Single centered image drop zone — for image-only upload tools.
 * Used by: Image Resizer, Color Palette Extractor, etc.
 */
export default function ImageDropTemplate({
  page,
  topControls,
  actions,
  onFile,
  onClear,
  file,
  accept,
  maxSizeBytes,
  dropLabel,
  dropSublabel,
  children,
}) {
  return (
    <PageShell page={page}>
      {topControls && (
        <div className={styles.topBar}>
          {topControls}
        </div>
      )}

      <div className={styles.dropWrap}>
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

      {children && (
        <div className={styles.extras}>
          {children}
        </div>
      )}

      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </PageShell>
  );
}

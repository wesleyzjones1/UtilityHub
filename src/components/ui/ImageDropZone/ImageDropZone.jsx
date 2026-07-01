import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './ImageDropZone.module.css';

const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml';

export default function ImageDropZone({
  onFile,
  onClear,
  accept = DEFAULT_ACCEPT,
  maxSizeBytes = 10 * 1024 * 1024,
  file: controlledFile,
  label,
  sublabel,
}) {
  const inputRef = useRef(null);
  const dragCount = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [internalFile, setInternalFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useLanguage();
  const resolvedLabel = label ?? t('dropImage');
  const resolvedSublabel = sublabel ?? t('dropImageSub');

  const activeFile = controlledFile ?? internalFile;

  // Revoke object URL on unmount / file change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = useCallback((file) => {
    setError(null);
    if (!file) return;
    if (maxSizeBytes && file.size > maxSizeBytes) {
      setError(`File too large (max ${(maxSizeBytes / 1024 / 1024).toFixed(0)} MB)`);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setPreviewUrl(url);
    setInternalFile(file);
    onFile?.(file);
  }, [maxSizeBytes, onFile, previewUrl]);

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setInternalFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  }, [previewUrl, onClear]);

  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    dragCount.current += 1;
    if (dragCount.current === 1) setDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    dragCount.current -= 1;
    if (dragCount.current === 0) setDragging(false);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    dragCount.current = 0;
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      className={[
        styles.zone,
        dragging && styles.dragging,
        activeFile && styles.hasFile,
        error && styles.hasError,
      ].filter(Boolean).join(' ')}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => !activeFile && inputRef.current?.click()}
      role="button"
      tabIndex={activeFile ? -1 : 0}
      aria-label={activeFile ? `Selected file: ${activeFile.name}` : resolvedLabel}
      onKeyDown={(e) => { if (!activeFile && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click(); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={styles.input}
        onChange={e => handleFile(e.target.files?.[0])}
        aria-hidden="true"
        tabIndex={-1}
      />

      {activeFile ? (
        <FilePreview
          file={activeFile}
          previewUrl={previewUrl}
          onClear={handleClear}
          removeLabel={t('removeFile')}
        />
      ) : (
        <EmptyPrompt label={resolvedLabel} sublabel={resolvedSublabel} dragging={dragging} error={error} releaseLabel={t('releaseToUpload')} />
      )}
    </div>
  );
}

function EmptyPrompt({ label, sublabel, dragging, error, releaseLabel }) {
  return (
    <div className={styles.prompt}>
      <div className={styles.promptIcon} aria-hidden="true">
        <UploadIcon />
      </div>
      <p className={styles.promptLabel}>{dragging ? releaseLabel : label}</p>
      {!dragging && <p className={styles.promptSub}>{sublabel}</p>}
      {error && <p className={styles.errorMsg} role="alert">{error}</p>}
    </div>
  );
}

function FilePreview({ file, previewUrl, onClear, removeLabel }) {
  return (
    <div className={styles.preview} onClick={e => e.stopPropagation()}>
      {previewUrl && (
        <img src={previewUrl} alt={file.name} className={styles.previewImg} />
      )}
      <div className={styles.previewMeta}>
        <span className={styles.previewName}>{file.name}</span>
        <span className={styles.previewSize}>{formatBytes(file.size)}</span>
      </div>
      <button
        type="button"
        className={styles.clearBtn}
        onClick={onClear}
        aria-label={removeLabel}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

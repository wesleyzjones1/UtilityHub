import { useState, useCallback } from 'react';
import ImageDropTemplate from '../../../templates/ImageDropTemplate/ImageDropTemplate';
import Button from '../../../components/ui/Button/Button';
import { loadImage, createICOBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './IcoCreator.module.css';

const ALL_SIZES = [16, 32, 48, 64, 128, 256];
const DEFAULT_SIZES = [16, 32, 48];

export default function IcoCreator({ page }) {
  const [file, setFile] = useState(null);
  const [origImg, setOrigImg] = useState(null);
  const [sizes, setSizes] = useState(new Set(DEFAULT_SIZES));
  const [outputBlob, setOutputBlob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setError(null);
    setOutputBlob(null);
    try {
      const img = await loadImage(f);
      setOrigImg(img);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setOrigImg(null);
    setOutputBlob(null);
    setError(null);
  }, []);

  const toggleSize = useCallback((size) => {
    setSizes(prev => {
      const next = new Set(prev);
      if (next.has(size)) {
        if (next.size > 1) next.delete(size); // keep at least one
      } else {
        next.add(size);
      }
      return next;
    });
  }, []);

  const handleCreate = useCallback(async () => {
    if (!origImg || sizes.size === 0) return;
    setLoading(true);
    setError(null);
    setOutputBlob(null);
    try {
      const sortedSizes = [...sizes].sort((a, b) => a - b);
      const blob = await createICOBlob(origImg, sortedSizes);
      setOutputBlob(blob);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [origImg, sizes]);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) {
      downloadBlob(outputBlob, replaceExt(file.name, '.ico'));
    }
  }, [outputBlob, file]);

  return (
    <ImageDropTemplate
      page={page}
      file={file}
      onFile={handleFile}
      onClear={handleClear}
      accept="image/png,image/jpeg,image/webp,image/svg+xml"
      dropLabel="Drop an image here"
      dropSublabel="or click to browse — square images work best"
      topControls={
        origImg && (
          <fieldset className={styles.sizes}>
            <legend className={styles.legend}>Include sizes</legend>
            <div className={styles.sizeGrid}>
              {ALL_SIZES.map(size => (
                <label key={size} className={styles.sizeLabel}>
                  <input
                    type="checkbox"
                    checked={sizes.has(size)}
                    onChange={() => toggleSize(size)}
                    aria-label={`${size}×${size}`}
                  />
                  {size}×{size}
                </label>
              ))}
            </div>
          </fieldset>
        )
      }
      actions={
        origImg && (
          <>
            <Button onClick={handleCreate} loading={loading} disabled={sizes.size === 0}>
              Create ICO
            </Button>
            {outputBlob && (
              <Button variant="secondary" onClick={handleDownload}>
                Download .ico
              </Button>
            )}
          </>
        )
      }
    >
      {error && <p className={styles.error} role="alert">{error}</p>}
      {outputBlob && !loading && (
        <p className={styles.success} aria-label="ICO result">
          ICO created with {sizes.size} size{sizes.size !== 1 ? 's' : ''} — {formatBytes(outputBlob.size)}
        </p>
      )}
    </ImageDropTemplate>
  );
}

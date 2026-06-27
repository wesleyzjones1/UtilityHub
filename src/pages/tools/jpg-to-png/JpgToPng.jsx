import { useState, useCallback } from 'react';
import ImageDropTemplate from '../../../templates/ImageDropTemplate/ImageDropTemplate';
import Button from '../../../components/ui/Button/Button';
import { loadImage, renderToCanvas, canvasToBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './JpgToPng.module.css';

const HOW_TO_USE = [
  'Drop a JPEG image or click to browse.',
  'A PNG preview appears automatically.',
  'Click Download PNG to save the converted file.',
];

export default function JpgToPng({ page }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setError(null);
    setOutputBlob(null);
    setPreview(null);
    setLoading(true);
    try {
      const img = await loadImage(f);
      const canvas = renderToCanvas(img, img.naturalWidth, img.naturalHeight);
      const blob = await canvasToBlob(canvas, 'image/png');
      setOutputBlob(blob);
      setPreview(URL.createObjectURL(blob));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setPreview(null);
    setOutputBlob(null);
    setError(null);
  }, []);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) {
      downloadBlob(outputBlob, replaceExt(file.name, '.png'));
    }
  }, [outputBlob, file]);

  return (
    <ImageDropTemplate
      page={page}
      howToUse={HOW_TO_USE}
      file={file}
      onFile={handleFile}
      onClear={handleClear}
      accept="image/jpeg"
      dropLabel="Drop a JPEG image here"
      dropSublabel="or click to browse — JPEG only"
      actions={
        outputBlob && (
          <Button onClick={handleDownload}>
            Download PNG
          </Button>
        )
      }
    >
      {loading && <p className={styles.status}>Converting…</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {preview && (
        <div className={styles.preview}>
          <div className={styles.meta}>
            <span>Input: {formatBytes(file.size)} (JPEG)</span>
            <span aria-label="Output size">Output: {formatBytes(outputBlob.size)} (PNG)</span>
          </div>
          <img src={preview} alt="PNG preview" className={styles.img} />
        </div>
      )}
    </ImageDropTemplate>
  );
}

import { useState, useCallback } from 'react';
import ImageDropTemplate from '../../../templates/ImageDropTemplate/ImageDropTemplate';
import Button from '../../../components/ui/Button/Button';
import { loadImage, renderToCanvas, canvasToBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './PngToJpg.module.css';

const HOW_TO_USE = [
  'Drop a PNG image or click to browse.',
  'Adjust the quality slider (higher = better quality, larger file).',
  'Click Download JPG to save the converted file.',
];

export default function PngToJpg({ page }) {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(90);
  const [preview, setPreview] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const convert = useCallback(async (f, q) => {
    if (!f) return;
    setLoading(true);
    setError(null);
    setOutputBlob(null);
    if (preview) URL.revokeObjectURL(preview);
    try {
      const img = await loadImage(f);
      const canvas = renderToCanvas(img, img.naturalWidth, img.naturalHeight, '#ffffff');
      const blob = await canvasToBlob(canvas, 'image/jpeg', q / 100);
      setOutputBlob(blob);
      setPreview(URL.createObjectURL(blob));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [preview]);

  const handleFile = useCallback((f) => {
    setFile(f);
    convert(f, quality);
  }, [convert, quality]);

  const handleQualityChange = useCallback((q) => {
    setQuality(q);
    if (file) convert(file, q);
  }, [file, convert]);

  const handleClear = useCallback(() => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setOutputBlob(null);
    setError(null);
  }, [preview]);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) {
      downloadBlob(outputBlob, replaceExt(file.name, '.jpg'));
    }
  }, [outputBlob, file]);

  return (
    <ImageDropTemplate
      page={page}
      howToUse={HOW_TO_USE}
      file={file}
      onFile={handleFile}
      onClear={handleClear}
      accept="image/png"
      dropLabel="Drop a PNG image here"
      dropSublabel="or click to browse — PNG only"
      topControls={
        <div className={styles.controls}>
          <label className={styles.sliderLabel} htmlFor="jpg-quality">
            Quality: <strong>{quality}%</strong>
          </label>
          <input
            id="jpg-quality"
            type="range"
            min="10"
            max="100"
            step="5"
            value={quality}
            onChange={e => handleQualityChange(Number(e.target.value))}
            className={styles.slider}
            aria-label="JPEG quality"
          />
        </div>
      }
      actions={
        outputBlob && (
          <Button onClick={handleDownload}>
            Download JPG
          </Button>
        )
      }
    >
      {loading && <p className={styles.status}>Converting…</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {preview && !loading && (
        <div className={styles.preview}>
          <div className={styles.meta}>
            <span>Input: {formatBytes(file.size)} (PNG)</span>
            <span aria-label="Output size">Output: {formatBytes(outputBlob.size)} (JPG)</span>
          </div>
          <img src={preview} alt="JPG preview" className={styles.img} />
        </div>
      )}
    </ImageDropTemplate>
  );
}

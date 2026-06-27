import { useState, useCallback } from 'react';
import ImageDropTemplate from '../../../templates/ImageDropTemplate/ImageDropTemplate';
import Button from '../../../components/ui/Button/Button';
import { loadImage, renderToCanvas, canvasToBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './SvgToPng.module.css';

const HOW_TO_USE = [
  'Drop an SVG file or click to browse.',
  'Set the desired output width — height scales automatically.',
  'Click Convert, then Download PNG to save.',
];

export default function SvgToPng({ page }) {
  const [file, setFile] = useState(null);
  const [origImg, setOrigImg] = useState(null);
  const [outputWidth, setOutputWidth] = useState('512');
  const [preview, setPreview] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setError(null);
    setOutputBlob(null);
    setPreview(null);
    try {
      const img = await loadImage(f);
      setOrigImg(img);
      // Default output width to natural width or 512 if unknown
      const natW = img.naturalWidth || 512;
      setOutputWidth(String(natW));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setOrigImg(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setOutputBlob(null);
    setError(null);
  }, [preview]);

  const handleConvert = useCallback(async () => {
    if (!origImg) return;
    const w = Math.max(1, parseInt(outputWidth, 10) || 512);
    const ratio = (origImg.naturalHeight || 1) / (origImg.naturalWidth || 1);
    const h = Math.max(1, Math.round(w * ratio));
    setLoading(true);
    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    try {
      const canvas = renderToCanvas(origImg, w, h);
      const blob = await canvasToBlob(canvas, 'image/png');
      setOutputBlob(blob);
      setPreview(URL.createObjectURL(blob));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [origImg, outputWidth, preview]);

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
      accept="image/svg+xml"
      dropLabel="Drop an SVG file here"
      dropSublabel="or click to browse — SVG only"
      topControls={
        origImg && (
          <div className={styles.controls}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="svg-width">Output width (px)</label>
              <input
                id="svg-width"
                type="number"
                min="1"
                className={styles.input}
                value={outputWidth}
                onChange={e => setOutputWidth(e.target.value)}
                aria-label="Output width in pixels"
              />
            </div>
          </div>
        )
      }
      actions={
        origImg && (
          <>
            <Button onClick={handleConvert} loading={loading}>
              Convert to PNG
            </Button>
            {outputBlob && (
              <Button variant="secondary" onClick={handleDownload}>
                Download PNG
              </Button>
            )}
          </>
        )
      }
    >
      {error && <p className={styles.error} role="alert">{error}</p>}
      {preview && !loading && (
        <div className={styles.preview}>
          <div className={styles.meta}>
            <span>Output: {formatBytes(outputBlob.size)} (PNG)</span>
          </div>
          <img src={preview} alt="PNG preview" className={styles.img} />
        </div>
      )}
    </ImageDropTemplate>
  );
}

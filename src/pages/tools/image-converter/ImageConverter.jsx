import { useState, useCallback, useEffect } from 'react';
import ImageDropTemplate from '../../../templates/ImageDropTemplate/ImageDropTemplate';
import Button from '../../../components/ui/Button/Button';
import { loadImage, renderToCanvas, canvasToBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './ImageConverter.module.css';

const FORMATS = {
  png:  { mime: 'image/png',  ext: '.png',  label: 'PNG',  lossy: false },
  jpeg: { mime: 'image/jpeg', ext: '.jpg',  label: 'JPG',  lossy: true },
  webp: { mime: 'image/webp', ext: '.webp', label: 'WEBP', lossy: true },
};

function extLabel(name = '') {
  const m = name.split('.').pop();
  return m ? m.toUpperCase() : 'IMG';
}

export default function ImageConverter({ page }) {
  const [file, setFile] = useState(null);
  const [origImg, setOrigImg] = useState(null);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState('');
  const [preview, setPreview] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Revoke the last preview URL when it changes or on unmount.
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const convert = useCallback(async (img, fmt, q, widthStr) => {
    if (!img) return;
    const spec = FORMATS[fmt];
    const natW = img.naturalWidth || 512;
    const natH = img.naturalHeight || natW;
    const w = Math.max(1, parseInt(widthStr, 10) || natW);
    const h = Math.max(1, Math.round(w * (natH / natW)));
    setLoading(true);
    setError(null);
    try {
      // JPEG has no alpha — flatten onto white; PNG/WEBP keep transparency.
      const bg = fmt === 'jpeg' ? '#ffffff' : null;
      const canvas = renderToCanvas(img, w, h, bg);
      const blob = await canvasToBlob(canvas, spec.mime, spec.lossy ? q / 100 : undefined);
      setOutputBlob(blob);
      setPreview(URL.createObjectURL(blob));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setError(null);
    setOutputBlob(null);
    try {
      const img = await loadImage(f);
      setOrigImg(img);
      const natW = String(img.naturalWidth || 512);
      setWidth(natW);
      convert(img, format, quality, natW);
    } catch (e) {
      setError(e.message);
    }
  }, [convert, format, quality]);

  const handleClear = useCallback(() => {
    setFile(null);
    setOrigImg(null);
    setPreview(null);
    setOutputBlob(null);
    setWidth('');
    setError(null);
  }, []);

  const handleFormat = useCallback((fmt) => {
    setFormat(fmt);
    if (origImg) convert(origImg, fmt, quality, width);
  }, [origImg, quality, width, convert]);

  const handleQuality = useCallback((q) => {
    setQuality(q);
    if (origImg) convert(origImg, format, q, width);
  }, [origImg, format, width, convert]);

  const handleWidth = useCallback((w) => {
    setWidth(w);
    if (origImg) convert(origImg, format, quality, w);
  }, [origImg, format, quality, convert]);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) downloadBlob(outputBlob, replaceExt(file.name, FORMATS[format].ext));
  }, [outputBlob, file, format]);

  const spec = FORMATS[format];

  return (
    <ImageDropTemplate
      page={page}
      file={file}
      onFile={handleFile}
      onClear={handleClear}
      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/bmp"
      dropLabel="Drop an image here"
      dropSublabel="or click to browse — PNG, JPG, WEBP, SVG, GIF, BMP"
      topControls={
        <div className={styles.controls}>
          <div className={styles.group}>
            <span className={styles.groupLabel}>Convert to</span>
            <div className={styles.formatBtns} role="group" aria-label="Output format">
              {Object.entries(FORMATS).map(([key, f]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.formatBtn} ${format === key ? styles.formatBtnActive : ''}`}
                  onClick={() => handleFormat(key)}
                  aria-pressed={format === key}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {spec.lossy && (
            <div className={styles.group}>
              <label className={styles.sliderLabel} htmlFor="img-quality">
                Quality: <strong>{quality}%</strong>
              </label>
              <input
                id="img-quality"
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={e => handleQuality(Number(e.target.value))}
                className={styles.slider}
                aria-label="Image quality"
              />
            </div>
          )}

          {origImg && (
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="img-width">Width (px)</label>
              <input
                id="img-width"
                type="number"
                min="1"
                className={styles.input}
                value={width}
                onChange={e => handleWidth(e.target.value)}
                aria-label="Output width in pixels"
              />
            </div>
          )}
        </div>
      }
      actions={
        outputBlob && (
          <Button onClick={handleDownload}>
            Download {spec.label}
          </Button>
        )
      }
    >
      {loading && <p className={styles.status}>Converting…</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {preview && !loading && (
        <div className={styles.preview}>
          <div className={styles.meta}>
            <span>Input: {formatBytes(file.size)} ({extLabel(file.name)})</span>
            <span aria-label="Output size">Output: {formatBytes(outputBlob.size)} ({spec.label})</span>
            {outputBlob.size < file.size && (
              <span className={styles.saving}>
                −{Math.round((1 - outputBlob.size / file.size) * 100)}% saved
              </span>
            )}
          </div>
          <img src={preview} alt={`${spec.label} preview`} className={styles.img} />
        </div>
      )}
    </ImageDropTemplate>
  );
}

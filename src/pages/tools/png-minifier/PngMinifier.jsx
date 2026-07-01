import { useState, useCallback } from 'react';
import ImageDropTemplate from '../../../templates/ImageDropTemplate/ImageDropTemplate';
import Button from '../../../components/ui/Button/Button';
import { loadImage, renderToCanvas, canvasToBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './PngMinifier.module.css';

export default function PngMinifier({ page }) {
  const [file, setFile] = useState(null);
  const [scale, setScale] = useState(100);
  const [preview, setPreview] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [origDims, setOrigDims] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const process = useCallback(async (f, s) => {
    if (!f) return;
    setLoading(true);
    setError(null);
    setOutputBlob(null);
    if (preview) URL.revokeObjectURL(preview);
    try {
      const img = await loadImage(f);
      const w = Math.max(1, Math.round(img.naturalWidth * s / 100));
      const h = Math.max(1, Math.round(img.naturalHeight * s / 100));
      setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
      const canvas = renderToCanvas(img, w, h);
      const blob = await canvasToBlob(canvas, 'image/png');
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
    process(f, scale);
  }, [process, scale]);

  const handleScaleChange = useCallback((s) => {
    setScale(s);
    if (file) process(file, s);
  }, [file, process]);

  const handleClear = useCallback(() => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setOutputBlob(null);
    setOrigDims(null);
    setError(null);
  }, [preview]);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) {
      downloadBlob(outputBlob, replaceExt(file.name, '-min.png'));
    }
  }, [outputBlob, file]);

  const scaledW = origDims ? Math.max(1, Math.round(origDims.w * scale / 100)) : 0;
  const scaledH = origDims ? Math.max(1, Math.round(origDims.h * scale / 100)) : 0;

  return (
    <ImageDropTemplate
      page={page}
      file={file}
      onFile={handleFile}
      onClear={handleClear}
      accept="image/png"
      dropLabel="Drop a PNG image here"
      dropSublabel="or click to browse — PNG only"
      topControls={
        <div className={styles.controls}>
          <label className={styles.sliderLabel} htmlFor="png-scale">
            Scale: <strong>{scale}%</strong>
          </label>
          <input
            id="png-scale"
            type="range"
            min="10"
            max="100"
            step="5"
            value={scale}
            onChange={e => handleScaleChange(Number(e.target.value))}
            className={styles.slider}
            aria-label="Scale percentage"
          />
          {origDims && (
            <span className={styles.dims}>
              {scaledW} × {scaledH} px
            </span>
          )}
        </div>
      }
      actions={
        outputBlob && (
          <Button onClick={handleDownload}>
            Download PNG
          </Button>
        )
      }
    >
      {loading && <p className={styles.status}>Processing…</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {preview && !loading && (
        <div className={styles.preview}>
          <div className={styles.meta}>
            <span>Original: {formatBytes(file.size)}</span>
            <span aria-label="Compressed size">Compressed: {formatBytes(outputBlob.size)}</span>
            {outputBlob.size < file.size && (
              <span className={styles.saving}>
                −{Math.round((1 - outputBlob.size / file.size) * 100)}% saved
              </span>
            )}
          </div>
          <img src={preview} alt="Minified PNG preview" className={styles.img} />
        </div>
      )}
    </ImageDropTemplate>
  );
}

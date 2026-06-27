import { useState, useCallback, useEffect } from 'react';
import ImageDropTemplate from '../../../templates/ImageDropTemplate/ImageDropTemplate';
import Button from '../../../components/ui/Button/Button';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { loadImage, renderToCanvas, canvasToBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './ImageResizer.module.css';

const HOW_TO_USE = [
  'Drop any image or click to browse.',
  'Enter the desired width or height — enable Lock Ratio to scale proportionally.',
  'Click Download to save the resized image.',
];

export default function ImageResizer({ page }) {
  const [file, setFile] = useState(null);
  const [origImg, setOrigImg] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockRatio, setLockRatio] = useState(true);
  const [outputBlob, setOutputBlob] = useState(null);
  const [preview, setPreview] = useState(null);
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
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setOrigImg(null);
    setWidth('');
    setHeight('');
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setOutputBlob(null);
    setError(null);
  }, [preview]);

  const handleWidthChange = useCallback((val) => {
    setWidth(val);
    if (lockRatio && origImg && val) {
      const ratio = origImg.naturalHeight / origImg.naturalWidth;
      setHeight(String(Math.round(Number(val) * ratio)));
    }
  }, [lockRatio, origImg]);

  const handleHeightChange = useCallback((val) => {
    setHeight(val);
    if (lockRatio && origImg && val) {
      const ratio = origImg.naturalWidth / origImg.naturalHeight;
      setWidth(String(Math.round(Number(val) * ratio)));
    }
  }, [lockRatio, origImg]);

  const handleResize = useCallback(async () => {
    if (!origImg || !width || !height) return;
    const w = Math.max(1, parseInt(width, 10));
    const h = Math.max(1, parseInt(height, 10));
    setLoading(true);
    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    try {
      const canvas = renderToCanvas(origImg, w, h);
      const type = file?.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
      const blob = await canvasToBlob(canvas, type);
      setOutputBlob(blob);
      setPreview(URL.createObjectURL(blob));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [origImg, width, height, file, preview]);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) {
      const ext = file.type === 'image/jpeg' ? '.jpg' : '.png';
      downloadBlob(outputBlob, replaceExt(file.name, `-${width}x${height}${ext}`));
    }
  }, [outputBlob, file, width, height]);

  return (
    <ImageDropTemplate
      page={page}
      howToUse={HOW_TO_USE}
      file={file}
      onFile={handleFile}
      onClear={handleClear}
      accept="image/png,image/jpeg,image/webp,image/gif"
      dropLabel="Drop an image here"
      dropSublabel="or click to browse"
      topControls={
        origImg && (
          <div className={styles.controls}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="resize-width">Width (px)</label>
              <input
                id="resize-width"
                type="number"
                min="1"
                className={styles.input}
                value={width}
                onChange={e => handleWidthChange(e.target.value)}
                aria-label="Width in pixels"
              />
            </div>
            <span className={styles.x} aria-hidden="true">×</span>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="resize-height">Height (px)</label>
              <input
                id="resize-height"
                type="number"
                min="1"
                className={styles.input}
                value={height}
                onChange={e => handleHeightChange(e.target.value)}
                aria-label="Height in pixels"
              />
            </div>
            <Toggle
              checked={lockRatio}
              onChange={setLockRatio}
              label="Lock ratio"
            />
          </div>
        )
      }
      actions={
        origImg && (
          <>
            <Button onClick={handleResize} loading={loading}>
              Resize
            </Button>
            {outputBlob && (
              <Button variant="secondary" onClick={handleDownload}>
                Download
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
            <span>Original: {origImg?.naturalWidth} × {origImg?.naturalHeight} px · {formatBytes(file.size)}</span>
            <span aria-label="Output size">Output: {width} × {height} px · {formatBytes(outputBlob.size)}</span>
          </div>
          <img src={preview} alt="Resized preview" className={styles.img} />
        </div>
      )}
    </ImageDropTemplate>
  );
}

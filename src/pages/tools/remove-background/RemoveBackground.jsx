import { useState, useEffect, useCallback } from 'react';
import ImageDropTemplate from '../../../templates/ImageDropTemplate/ImageDropTemplate';
import Button from '../../../components/ui/Button/Button';
import ButtonGroup from '../../../components/ui/ButtonGroup/ButtonGroup';
import { loadImage, renderToCanvas, canvasToBlob, downloadBlob, formatBytes } from '../../../utils/imageUtils';
import styles from './RemoveBackground.module.css';

const TARGET_OPTIONS = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'auto', label: 'Auto (corners)' },
];

/** Make pixels close to the target background colour transparent. */
function removeBackground(img, target, tolerancePct) {
  const canvas = renderToCanvas(img, img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = imageData.data;

  let tr;
  let tg;
  let tb;
  if (target === 'white') {
    tr = tg = tb = 255;
  } else if (target === 'black') {
    tr = tg = tb = 0;
  } else {
    // Auto: average the four corner pixels.
    const w = canvas.width;
    const h = canvas.height;
    const corners = [0, (w - 1) * 4, w * (h - 1) * 4, (w * h - 1) * 4];
    let sr = 0;
    let sg = 0;
    let sb = 0;
    for (const c of corners) {
      sr += px[c];
      sg += px[c + 1];
      sb += px[c + 2];
    }
    tr = sr / 4;
    tg = sg / 4;
    tb = sb / 4;
  }

  const threshold = (tolerancePct / 100) * 442; // 442 ≈ max RGB distance
  for (let i = 0; i < px.length; i += 4) {
    const dr = px[i] - tr;
    const dg = px[i + 1] - tg;
    const db = px[i + 2] - tb;
    if (Math.sqrt(dr * dr + dg * dg + db * db) <= threshold) {
      px[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export default function RemoveBackground({ page }) {
  const [file, setFile] = useState(null);
  const [imgEl, setImgEl] = useState(null);
  const [target, setTarget] = useState('white');
  const [tolerance, setTolerance] = useState(30);
  const [preview, setPreview] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setError(null);
    setLoading(true);
    try {
      const img = await loadImage(f);
      setImgEl(img);
    } catch (e) {
      setError(e.message);
      setImgEl(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setImgEl(null);
    setPreview(null);
    setOutputBlob(null);
    setError(null);
  }, []);

  // Re-process whenever the image or settings change.
  useEffect(() => {
    if (!imgEl) return;
    let cancelled = false;
    (async () => {
      try {
        const canvas = removeBackground(imgEl, target, tolerance);
        const blob = await canvasToBlob(canvas, 'image/png');
        if (cancelled) return;
        setOutputBlob(blob);
        setPreview(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [imgEl, target, tolerance]);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) {
      const name = file.name.replace(/\.[^.]+$/, '') + '-no-bg.png';
      downloadBlob(outputBlob, name);
    }
  }, [outputBlob, file]);

  return (
    <ImageDropTemplate
      page={page}
      file={file}
      onFile={handleFile}
      onClear={handleClear}
      accept="image/*"
      dropLabel="Drop an image here"
      dropSublabel="or click to browse — PNG, JPG, or WebP"
      actions={
        outputBlob && (
          <Button onClick={handleDownload}>
            Download PNG
          </Button>
        )
      }
    >
      {loading && <p className={styles.status}>Loading…</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}

      {imgEl && (
        <div className={styles.controls}>
          <ButtonGroup
            label="Background to remove"
            options={TARGET_OPTIONS}
            value={target}
            onChange={setTarget}
          />
          <label className={styles.sliderField}>
            <span className={styles.sliderLabel}>Tolerance: {tolerance}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={tolerance}
              onChange={e => setTolerance(Number(e.target.value))}
              aria-label="Tolerance"
              className={styles.slider}
            />
          </label>
        </div>
      )}

      {preview && (
        <div className={styles.preview}>
          {file && outputBlob && (
            <div className={styles.meta}>
              <span>Input: {formatBytes(file.size)}</span>
              <span aria-label="Output size">Output: {formatBytes(outputBlob.size)} (PNG)</span>
            </div>
          )}
          <div className={styles.checker}>
            <img src={preview} alt="Background removed preview" className={styles.img} />
          </div>
        </div>
      )}
    </ImageDropTemplate>
  );
}

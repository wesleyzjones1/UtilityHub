import { useState, useCallback, useRef, useEffect } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import ImageDropZone from '../../../components/ui/ImageDropZone/ImageDropZone';
import Button from '../../../components/ui/Button/Button';
import { loadImage, canvasToBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './ImageCropper.module.css';

const VIEWPORT_H = 440;
const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function ImageCropper({ page }) {
  const [file, setFile] = useState(null);
  const [origImg, setOrigImg] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [outputPreview, setOutputPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Crop in image pixels
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);

  const dragState = useRef(null);
  const stageRef = useRef(null);
  const viewportRef = useRef(null);
  const [viewportW, setViewportW] = useState(0);

  const natW = origImg?.naturalWidth || 1;
  const natH = origImg?.naturalHeight || 1;

  // Track the available viewport width so the image can be fitted into it.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [origImg]);

  const fitScale = origImg ? Math.min(viewportW / natW, VIEWPORT_H / natH) || 1 : 1;
  const displayW = natW * fitScale * zoom;
  const displayH = natH * fitScale * zoom;

  const clearOutput = useCallback(() => {
    setOutputBlob(null);
    setOutputPreview(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const toImageCoords = useCallback((clientX, clientY) => {
    const stage = stageRef.current;
    if (!stage) return null;
    const r = stage.getBoundingClientRect();
    return {
      x: clamp(Math.round(((clientX - r.left) / r.width) * natW), 0, natW),
      y: clamp(Math.round(((clientY - r.top) / r.height) * natH), 0, natH),
    };
  }, [natW, natH]);

  const onDragMove = useCallback((e) => {
    const ds = dragState.current;
    if (!ds) return;
    const pt = toImageCoords(e.clientX, e.clientY);
    if (!pt) return;
    const { mode, startX, startY, startCrop, handle } = ds;

    if (mode === 'new') {
      setCrop({
        x: Math.min(startX, pt.x),
        y: Math.min(startY, pt.y),
        w: Math.abs(pt.x - startX),
        h: Math.abs(pt.y - startY),
      });
    } else if (mode === 'move') {
      const dx = pt.x - startX;
      const dy = pt.y - startY;
      setCrop({
        ...startCrop,
        x: clamp(startCrop.x + dx, 0, natW - startCrop.w),
        y: clamp(startCrop.y + dy, 0, natH - startCrop.h),
      });
    } else if (mode === 'resize') {
      let left = startCrop.x;
      let top = startCrop.y;
      let right = startCrop.x + startCrop.w;
      let bottom = startCrop.y + startCrop.h;
      if (handle.includes('n')) top = pt.y;
      if (handle.includes('s')) bottom = pt.y;
      if (handle.includes('w')) left = pt.x;
      if (handle.includes('e')) right = pt.x;
      setCrop({
        x: Math.min(left, right),
        y: Math.min(top, bottom),
        w: Math.abs(right - left),
        h: Math.abs(bottom - top),
      });
    }
  }, [toImageCoords, natW, natH]);

  const endDrag = useCallback(() => {
    dragState.current = null;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', endDrag);
  }, [onDragMove]);

  const beginDrag = useCallback((mode, e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    const pt = toImageCoords(e.clientX, e.clientY);
    if (!pt) return;
    dragState.current = { mode, handle, startX: pt.x, startY: pt.y, startCrop: crop };
    if (mode === 'new') setCrop({ x: pt.x, y: pt.y, w: 0, h: 0 });
    clearOutput();
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', endDrag);
  }, [toImageCoords, crop, clearOutput, onDragMove, endDrag]);

  useEffect(() => () => {
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', endDrag);
  }, [onDragMove, endDrag]);

  const centerCrop = useCallback(() => {
    setCrop(prev => {
      let { w, h } = prev;
      if (w < 1 || h < 1) {
        const side = Math.round(Math.min(natW, natH) * 0.6);
        w = side;
        h = side;
      }
      return {
        w,
        h,
        x: Math.round((natW - w) / 2),
        y: Math.round((natH - h) / 2),
      };
    });
    clearOutput();
  }, [natW, natH, clearOutput]);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setError(null);
    clearOutput();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setZoom(1);
    try {
      const img = await loadImage(f);
      setOrigImg(img);
      setPreviewUrl(URL.createObjectURL(f));
      // Start with a centered square so the box is visible and adjustable.
      const side = Math.round(Math.min(img.naturalWidth, img.naturalHeight) * 0.6);
      setCrop({
        w: side,
        h: side,
        x: Math.round((img.naturalWidth - side) / 2),
        y: Math.round((img.naturalHeight - side) / 2),
      });
    } catch (err) {
      setError(err.message);
    }
  }, [previewUrl, clearOutput]);

  const handleCrop = useCallback(async () => {
    if (!origImg || crop.w < 1 || crop.h < 1) return;
    setLoading(true);
    setError(null);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = crop.w;
      canvas.height = crop.h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(origImg, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      const type = file?.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
      const blob = await canvasToBlob(canvas, type);
      setOutputBlob(blob);
      setOutputPreview(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [origImg, crop, file]);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) {
      const ext = file.type === 'image/jpeg' ? '.jpg' : '.png';
      downloadBlob(outputBlob, replaceExt(file.name, `-crop${ext}`));
    }
  }, [outputBlob, file]);

  const overlayStyle = {
    left: `${(crop.x / natW) * 100}%`,
    top: `${(crop.y / natH) * 100}%`,
    width: `${(crop.w / natW) * 100}%`,
    height: `${(crop.h / natH) * 100}%`,
  };

  const hasCrop = crop.w > 0 && crop.h > 0;

  return (
    <PageShell page={page}>
      {!file ? (
        <div className={styles.dropWrap}>
          <ImageDropZone
            onFile={handleFile}
            accept="image/png,image/jpeg,image/webp,image/gif"
            label="Drop an image here"
            sublabel="or click to browse"
          />
        </div>
      ) : (
        <div className={styles.layout}>
          {/* Crop inputs */}
          <div className={styles.fields}>
            {(['x', 'y', 'w', 'h']).map((key, i) => (
              <div key={key} className={styles.field}>
                <label className={styles.fieldLabel} htmlFor={`crop-${key}`}>
                  {['X', 'Y', 'Width', 'Height'][i]}
                </label>
                <input
                  id={`crop-${key}`}
                  type="number"
                  min="0"
                  className={styles.input}
                  value={crop[key]}
                  onChange={e => {
                    const v = Math.max(0, Number(e.target.value));
                    setCrop(prev => ({ ...prev, [key]: v }));
                    clearOutput();
                  }}
                  aria-label={['Crop X', 'Crop Y', 'Crop width', 'Crop height'][i]}
                />
              </div>
            ))}
          </div>

          {/* Zoom + center toolbar */}
          <div className={styles.toolbar}>
            <Button variant="secondary" size="sm" onClick={() => setZoom(z => clamp(z / 1.25, 0.1, 8))} aria-label="Zoom out">−</Button>
            <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
            <Button variant="secondary" size="sm" onClick={() => setZoom(z => clamp(z * 1.25, 0.1, 8))} aria-label="Zoom in">+</Button>
            <Button variant="secondary" size="sm" onClick={() => setZoom(1)}>Fit</Button>
            <Button variant="secondary" size="sm" onClick={centerCrop}>Center</Button>
            <Button variant="secondary" size="sm" onClick={() => handleFile(file)}>Change image</Button>
          </div>

          {/* Image viewport with crop overlay */}
          <div ref={viewportRef} className={styles.viewport}>
            <div
              ref={stageRef}
              className={styles.stage}
              style={{ width: `${displayW}px`, height: `${displayH}px` }}
              onMouseDown={(e) => beginDrag('new', e)}
              aria-label="Drag to select crop region"
              role="img"
            >
              <img
                src={previewUrl}
                alt="Source to crop"
                className={styles.sourceImg}
                draggable={false}
              />
              {hasCrop && (
                <div className={styles.cropOverlay} style={overlayStyle}>
                  <div
                    className={styles.cropMove}
                    onMouseDown={(e) => beginDrag('move', e)}
                    aria-hidden="true"
                  />
                  {HANDLES.map(h => (
                    <div
                      key={h}
                      className={`${styles.handle} ${styles[`handle_${h}`]}`}
                      onMouseDown={(e) => beginDrag('resize', e, h)}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.actions}>
            <Button onClick={handleCrop} loading={loading} disabled={crop.w < 1 || crop.h < 1}>
              Crop
            </Button>
            {outputBlob && (
              <Button variant="secondary" onClick={handleDownload}>
                Download
              </Button>
            )}
          </div>

          {outputPreview && !loading && (
            <div className={styles.resultWrap}>
              <p className={styles.resultMeta}>
                {crop.w} × {crop.h} px · {formatBytes(outputBlob.size)}
              </p>
              <img src={outputPreview} alt="Cropped result" className={styles.resultImg} />
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}

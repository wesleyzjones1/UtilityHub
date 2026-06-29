import { useState, useCallback, useRef } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import ImageDropZone from '../../../components/ui/ImageDropZone/ImageDropZone';
import Button from '../../../components/ui/Button/Button';
import { loadImage, canvasToBlob, downloadBlob, replaceExt, formatBytes } from '../../../utils/imageUtils';
import styles from './ImageCropper.module.css';

const HOW_TO_USE = [
  'Drop an image or click to browse.',
  'Drag on the image to draw a crop region, or enter coordinates manually.',
  'Click Crop to apply, then Download to save.',
];

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
  // Drag state
  const dragState = useRef(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const getImageRect = () => {
    const img = imgRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    return { left: rect.left, top: rect.top, w: rect.width, h: rect.height };
  };

  const toImageCoords = (clientX, clientY) => {
    const r = getImageRect();
    if (!r || !origImg) return null;
    return {
      x: Math.round(((clientX - r.left) / r.w) * origImg.naturalWidth),
      y: Math.round(((clientY - r.top) / r.h) * origImg.naturalHeight),
    };
  };

  const onMouseDown = useCallback((e) => {
    if (!origImg) return;
    e.preventDefault();
    const pt = toImageCoords(e.clientX, e.clientY);
    if (!pt) return;
    dragState.current = { startX: pt.x, startY: pt.y };
    setCrop({ x: pt.x, y: pt.y, w: 0, h: 0 });
    setOutputBlob(null);
    if (outputPreview) URL.revokeObjectURL(outputPreview);
    setOutputPreview(null);
  }, [origImg, outputPreview]);

  const onMouseMove = useCallback((e) => {
    if (!dragState.current || !origImg) return;
    const pt = toImageCoords(e.clientX, e.clientY);
    if (!pt) return;
    const { startX, startY } = dragState.current;
    setCrop({
      x: Math.max(0, Math.min(startX, pt.x)),
      y: Math.max(0, Math.min(startY, pt.y)),
      w: Math.min(Math.abs(pt.x - startX), origImg.naturalWidth),
      h: Math.min(Math.abs(pt.y - startY), origImg.naturalHeight),
    });
  }, [origImg]);

  const onMouseUp = useCallback(() => {
    dragState.current = null;
  }, []);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setError(null);
    setOutputBlob(null);
    if (outputPreview) URL.revokeObjectURL(outputPreview);
    setOutputPreview(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    try {
      const img = await loadImage(f);
      setOrigImg(img);
      setPreviewUrl(URL.createObjectURL(f));
      setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
    } catch (err) {
      setError(err.message);
    }
  }, [previewUrl, outputPreview]);

  const handleClear = useCallback(() => {
    setFile(null);
    setOrigImg(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (outputPreview) URL.revokeObjectURL(outputPreview);
    setOutputPreview(null);
    setOutputBlob(null);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setError(null);
  }, [previewUrl, outputPreview]);

  const handleCrop = useCallback(async () => {
    if (!origImg || crop.w < 1 || crop.h < 1) return;
    setLoading(true);
    setError(null);
    if (outputPreview) URL.revokeObjectURL(outputPreview);
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
  }, [origImg, crop, file, outputPreview]);

  const handleDownload = useCallback(() => {
    if (outputBlob && file) {
      const ext = file.type === 'image/jpeg' ? '.jpg' : '.png';
      downloadBlob(outputBlob, replaceExt(file.name, `-crop${ext}`));
    }
  }, [outputBlob, file]);

  // Overlay rect as % of displayed image
  const overlayStyle = (() => {
    const r = getImageRect();
    if (!r || !origImg || !origImg.naturalWidth) return null;
    const scaleX = r.w / origImg.naturalWidth;
    const scaleY = r.h / origImg.naturalHeight;
    return {
      left: `${crop.x * scaleX}px`,
      top: `${crop.y * scaleY}px`,
      width: `${crop.w * scaleX}px`,
      height: `${crop.h * scaleY}px`,
    };
  })();

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      {!file ? (
        <div className={styles.dropWrap}>
          <ImageDropZone
            onFile={handleFile}
            onClear={handleClear}
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
                  onChange={e => setCrop(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  aria-label={['Crop X', 'Crop Y', 'Crop width', 'Crop height'][i]}
                />
              </div>
            ))}
            <Button
              onClick={() => {
                if (file) handleFile(file);
              }}
              variant="secondary"
              size="sm"
              className={styles.clearBtn}
            >
              Change image
            </Button>
          </div>

          {/* Image with crop overlay */}
          <div
            ref={containerRef}
            className={styles.imgContainer}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            aria-label="Drag to select crop region"
            role="img"
          >
            <img
              ref={imgRef}
              src={previewUrl}
              alt="Source to crop"
              className={styles.sourceImg}
              draggable={false}
            />
            {overlayStyle && crop.w > 0 && crop.h > 0 && (
              <div className={styles.cropOverlay} style={overlayStyle} aria-hidden="true" />
            )}
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

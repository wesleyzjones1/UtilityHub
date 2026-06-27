import { useCallback, useEffect, useRef, useState } from 'react';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import PageShell from '../../../templates/PageShell/PageShell';
import ImageDropZone from '../../../components/ui/ImageDropZone/ImageDropZone';
import {
  MAX_DURATION,
  clampDuration,
  computeOutputHeight,
  estimateFrameCount,
  frameDelayMs,
  formatBytes,
  estimateGifBytes,
} from './videoToGifUtils';
import styles from './VideoToGif.module.css';

const HOW_TO_USE = [
  'Drop or select a video file (MP4, WebM, or MOV up to 100 MB).',
  'Set the start time, clip duration (max 10 s), frame rate, and output width.',
  'Click Convert and wait for encoding to finish — longer clips take more time.',
  'Preview the animated GIF and click Download to save it.',
];

const FPS_OPTIONS = [5, 10, 15, 20, 25];
const WIDTH_OPTIONS = [240, 320, 480, 640];
const LARGE_OUTPUT_BYTES = 8 * 1024 * 1024;

/** Seek a video element to a time and resolve once the frame is ready. */
function seekTo(video, time) {
  return new Promise((resolve, reject) => {
    const onSeeked = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error('Failed to seek video.')); };
    function cleanup() {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
    }
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    video.currentTime = time;
  });
}

export default function VideoToGif({ page }) {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [meta, setMeta] = useState(null); // { width, height, duration }
  const [start, setStart] = useState(0);
  const [duration, setDuration] = useState(3);
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);

  const [gifUrl, setGifUrl] = useState(null);
  const [gifSize, setGifSize] = useState(0);
  const [encoding, setEncoding] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState(null);

  const videoRef = useRef(null);

  // Revoke object URLs on unmount.
  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
  }, [videoUrl, gifUrl]);

  const handleFile = useCallback((picked) => {
    setError(null);
    setMeta(null);
    setGifSize(0);
    setProgress({ done: 0, total: 0 });
    setGifUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    setVideoUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(picked); });
    setFile(picked);
  }, []);

  const handleClear = useCallback(() => {
    setVideoUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    setGifUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    setFile(null);
    setMeta(null);
    setError(null);
    setGifSize(0);
    setProgress({ done: 0, total: 0 });
  }, []);

  function handleLoadedMetadata() {
    const v = videoRef.current;
    if (!v) return;
    setMeta({ width: v.videoWidth, height: v.videoHeight, duration: v.duration });
    // Default the clip duration to the whole video if it's shorter than the default.
    if (Number.isFinite(v.duration) && v.duration < duration) {
      setDuration(Math.max(0.1, +v.duration.toFixed(1)));
    }
  }

  async function handleConvert() {
    const video = videoRef.current;
    if (!video || encoding) return;

    const clip = clampDuration(duration);
    const total = estimateFrameCount(clip, fps);
    const outW = width;
    const outH = meta ? computeOutputHeight(meta.width, meta.height, outW) : Math.round(outW * 0.5625);

    setError(null);
    setEncoding(true);
    setProgress({ done: 0, total });
    setGifUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    setGifSize(0);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is not supported in this browser.');

      const gif = GIFEncoder();
      const delay = frameDelayMs(fps);

      for (let i = 0; i < total; i++) {
        const t = start + i / fps;
        await seekTo(video, Math.min(t, (meta?.duration ?? t)));
        ctx.drawImage(video, 0, 0, outW, outH);
        const { data } = ctx.getImageData(0, 0, outW, outH);
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, outW, outH, { palette, delay });
        setProgress({ done: i + 1, total });
        // Yield to the event loop so the progress bar can paint.
        await new Promise(r => setTimeout(r, 0));
      }

      gif.finish();
      const bytes = gif.bytes();
      const blob = new Blob([bytes], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
      setGifSize(blob.size);
    } catch (e) {
      setError(e?.message || 'Could not convert this video. Try a different file.');
    } finally {
      setEncoding(false);
    }
  }

  const outH = meta ? computeOutputHeight(meta.width, meta.height, width) : null;
  const willBeLarge = estimateGifBytes(width, outH ?? width * 0.5625, duration, fps) > LARGE_OUTPUT_BYTES;
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <ImageDropZone
          file={file}
          onFile={handleFile}
          onClear={handleClear}
          accept="video/mp4,video/webm,video/quicktime,video/*"
          maxSizeBytes={100 * 1024 * 1024}
          label="Drop a video here"
          sublabel="or click to browse · MP4, WebM, MOV"
        />

        {videoUrl && (
          <div className={styles.workspace}>
            <video
              ref={videoRef}
              src={videoUrl}
              className={styles.video}
              onLoadedMetadata={handleLoadedMetadata}
              controls
              muted
              playsInline
              preload="metadata"
            />

            <div className={styles.controls}>
              <div className={styles.field}>
                <label htmlFor="vg-start">Start (s)</label>
                <input
                  id="vg-start"
                  type="number"
                  min="0"
                  step="0.5"
                  value={start}
                  onChange={e => setStart(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="vg-duration">Duration (s)</label>
                <input
                  id="vg-duration"
                  type="number"
                  min="0.1"
                  max={MAX_DURATION}
                  step="0.5"
                  value={duration}
                  onChange={e => setDuration(clampDuration(e.target.value))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="vg-fps">Frame rate</label>
                <select id="vg-fps" value={fps} onChange={e => setFps(Number(e.target.value))}>
                  {FPS_OPTIONS.map(f => <option key={f} value={f}>{f} fps</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="vg-width">Width (px)</label>
                <select id="vg-width" value={width} onChange={e => setWidth(Number(e.target.value))}>
                  {WIDTH_OPTIONS.map(w => <option key={w} value={w}>{w}{outH ? ` × ${computeOutputHeight(meta.width, meta.height, w)}` : ''}</option>)}
                </select>
              </div>
            </div>

            {willBeLarge && !encoding && (
              <p className={styles.warning} role="status">
                Heads up: these settings may produce a large GIF. Lower the duration, width, or frame rate for a smaller file.
              </p>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.convertBtn}
                onClick={handleConvert}
                disabled={!file || encoding}
              >
                {encoding ? 'Converting…' : 'Convert to GIF'}
              </button>
            </div>

            {encoding && (
              <div className={styles.progressWrap} aria-live="polite">
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                </div>
                <span className={styles.progressLabel}>
                  {progress.done} / {progress.total} frames ({pct}%)
                </span>
              </div>
            )}

            {error && <p className={styles.error} role="alert">{error}</p>}

            {gifUrl && (
              <div className={styles.result}>
                <img src={gifUrl} alt="Converted GIF preview" className={styles.gifPreview} />
                <div className={styles.resultMeta}>
                  <span className={styles.resultSize}>{formatBytes(gifSize)}</span>
                  <a
                    href={gifUrl}
                    download={`${(file?.name || 'video').replace(/\.[^.]+$/, '')}.gif`}
                    className={styles.downloadBtn}
                  >
                    Download GIF
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}

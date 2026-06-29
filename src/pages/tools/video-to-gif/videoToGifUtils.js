/** Pure helpers for the Video to GIF tool (kept free of DOM/canvas so they're unit-testable). */

export const MAX_DURATION = 10; // seconds — GIFs balloon in size beyond this

/** Clamp a numeric duration into the allowed 0.1–MAX_DURATION range. */
export function clampDuration(value, max = MAX_DURATION) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(Math.max(n, 0.1), max);
}

/**
 * Compute output height from a target width while preserving the source aspect
 * ratio. Rounds to an even integer (some encoders dislike odd dimensions).
 */
export function computeOutputHeight(sourceWidth, sourceHeight, targetWidth) {
  if (!sourceWidth || !sourceHeight || !targetWidth) return 0;
  const h = Math.round((sourceHeight / sourceWidth) * targetWidth);
  return h % 2 === 0 ? h : h + 1;
}

/** Total number of frames captured for a given duration and frame rate. */
export function estimateFrameCount(duration, fps) {
  const frames = Math.round(clampDuration(duration) * fps);
  return Math.max(1, frames);
}

/** Per-frame delay in milliseconds for a given frame rate. */
export function frameDelayMs(fps) {
  return Math.round(1000 / Math.max(1, fps));
}

/** Human-readable byte size. */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Rough output-size estimate (bytes) used only to warn the user before they
 * commit to a large render. Assumes ~0.8 bytes per pixel per frame after
 * palette compression — deliberately conservative, not exact.
 */
export function estimateGifBytes(width, height, duration, fps) {
  const frames = estimateFrameCount(duration, fps);
  return Math.round(width * height * frames * 0.8);
}

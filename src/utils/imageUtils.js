/** Load a File/Blob into an HTMLImageElement. */
export function loadImage(source) {
  return new Promise((resolve, reject) => {
    const url = source instanceof File || source instanceof Blob
      ? URL.createObjectURL(source)
      : source;
    const img = new Image();
    img.onload = () => {
      if (source instanceof File || source instanceof Blob) URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/** Render an image onto a new canvas, optionally filling a background colour first. */
export function renderToCanvas(img, width, height, bgColor = null) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

/** canvas.toBlob wrapped in a Promise. */
export function canvasToBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Failed to encode image'))),
      type,
      quality,
    );
  });
}

/** Trigger a browser file download from a Blob. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Replace a file extension with a new one. */
export function replaceExt(filename, ext) {
  return filename.replace(/\.[^.]+$/, '') + ext;
}

/** Format bytes as a human-readable string. */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Build an ICO blob from a source image at the requested sizes.
 * Embeds each size as a PNG sub-image (modern ICO format).
 */
export async function createICOBlob(img, sizes) {
  // Render each size and get its PNG bytes
  const entries = await Promise.all(
    sizes.map(async (size) => {
      const canvas = renderToCanvas(img, size, size);
      const blob = await canvasToBlob(canvas, 'image/png');
      const buffer = await blob.arrayBuffer();
      return { size, data: new Uint8Array(buffer) };
    }),
  );

  const count = entries.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = count * dirEntrySize;

  // Calculate data offsets
  let dataOffset = headerSize + dirSize;
  const offsets = entries.map(({ data }) => {
    const o = dataOffset;
    dataOffset += data.length;
    return o;
  });

  const buf = new ArrayBuffer(dataOffset);
  const view = new DataView(buf);

  // ICO header
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type = 1 (ICO)
  view.setUint16(4, count, true);

  // Directory entries
  entries.forEach(({ size, data }, i) => {
    const base = headerSize + i * dirEntrySize;
    view.setUint8(base, size >= 256 ? 0 : size);   // width  (0 = 256)
    view.setUint8(base + 1, size >= 256 ? 0 : size); // height
    view.setUint8(base + 2, 0);  // color count
    view.setUint8(base + 3, 0);  // reserved
    view.setUint16(base + 4, 1, true);              // color planes
    view.setUint16(base + 6, 32, true);             // bits per pixel
    view.setUint32(base + 8, data.length, true);    // data size
    view.setUint32(base + 12, offsets[i], true);    // data offset
  });

  // Image data
  const bytes = new Uint8Array(buf);
  entries.forEach(({ data }, i) => bytes.set(data, offsets[i]));

  return new Blob([buf], { type: 'image/x-icon' });
}

import styles from './previewOverrides.module.css';

/**
 * Some tools don't show their real experience on their landing screen — image
 * tools open on an empty drop zone, and the countdown timer is just an input
 * until you start it. For those we render a representative "in-use" snapshot so
 * the hover preview conveys what the tool actually does.
 *
 * Map of tool id → preview node. Tools not listed use their live component.
 */

/** Shared sample photo (sky + sun + mountains). */
function SampleImage({ className }) {
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden="true">
      <rect width="160" height="100" rx="6" fill="#dbeafe" />
      <circle cx="122" cy="28" r="13" fill="#fbbf24" />
      <path d="M0 100 L46 46 L82 100 Z" fill="#34d399" />
      <path d="M54 100 L110 38 L160 100 Z" fill="#10b981" />
    </svg>
  );
}

/** Just the foreground subject (no sky) — for the "background removed" state. */
function SubjectImage({ className }) {
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden="true">
      <circle cx="122" cy="28" r="13" fill="#fbbf24" />
      <path d="M0 100 L46 46 L82 100 Z" fill="#34d399" />
      <path d="M54 100 L110 38 L160 100 Z" fill="#10b981" />
    </svg>
  );
}

const Arrow = () => <span className={styles.arrow}>→</span>;

function CountdownPreview() {
  const R = 52;
  const C = 2 * Math.PI * R;
  const progress = 0.68; // arbitrary "in progress" arc
  return (
    <div className={styles.countdown}>
      <div className={styles.ringWrap}>
        <svg viewBox="0 0 140 140" className={styles.ringSvg} aria-hidden="true">
          <circle cx="70" cy="70" r={R} className={styles.ringTrack} />
          <circle
            cx="70"
            cy="70"
            r={R}
            className={styles.ringProgress}
            style={{
              strokeDasharray: `${C * progress} ${C}`,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <span className={styles.time}>04:32</span>
      </div>
    </div>
  );
}

function ImageConverterPreview() {
  return (
    <div className={styles.imgtool}>
      <div className={styles.formatRow}>
        <span className={`${styles.pill} ${styles.pillActive}`}>PNG</span>
        <span className={styles.pill}>JPG</span>
        <span className={styles.pill}>WEBP</span>
      </div>
      <div className={styles.sample}><SampleImage className={styles.sampleSvg} /></div>
      <div className={styles.metaRow}>
        <span>240 KB JPG</span>
        <Arrow />
        <span>180 KB PNG</span>
        <span className={styles.saved}>−25%</span>
      </div>
    </div>
  );
}

function IcoCreatorPreview() {
  return (
    <div className={styles.imgtool}>
      <div className={styles.sample}><SampleImage className={styles.sampleSvg} /></div>
      <div className={styles.sizeRow}>
        <span className={styles.sizeChip} style={{ width: 16, height: 16 }} />
        <span className={styles.sizeChip} style={{ width: 22, height: 22 }} />
        <span className={styles.sizeChip} style={{ width: 30, height: 30 }} />
      </div>
      <div className={styles.metaRow}>
        <span>16 · 32 · 48</span>
        <Arrow />
        <span className={styles.strong}>favicon.ico</span>
      </div>
    </div>
  );
}

function ImageCropperPreview() {
  return (
    <div className={styles.imgtool}>
      <div className={styles.cropWrap}>
        <SampleImage className={styles.cropImg} />
        <div className={styles.cropBox}>
          <span className={`${styles.cropHandle} ${styles.chTL}`} />
          <span className={`${styles.cropHandle} ${styles.chTR}`} />
          <span className={`${styles.cropHandle} ${styles.chBL}`} />
          <span className={`${styles.cropHandle} ${styles.chBR}`} />
        </div>
      </div>
      <div className={styles.metaRow}><span>Drag to crop a region</span></div>
    </div>
  );
}

function ImageResizerPreview() {
  return (
    <div className={styles.imgtool}>
      <div className={styles.sample}><SampleImage className={styles.sampleSvg} /></div>
      <div className={styles.dimRow}>
        <span className={styles.dimField}>W 800</span>
        <span className={styles.dimX}>×</span>
        <span className={styles.dimField}>H 450</span>
      </div>
      <div className={styles.metaRow}>
        <span>1920×1080</span>
        <Arrow />
        <span className={styles.strong}>800×450</span>
      </div>
    </div>
  );
}

function PngMinifierPreview() {
  return (
    <div className={styles.imgtool}>
      <div className={styles.sample}><SampleImage className={styles.sampleSvg} /></div>
      <div className={styles.barTrack}><span className={styles.barFill} /></div>
      <div className={styles.metaRow}>
        <span>240 KB</span>
        <Arrow />
        <span>90 KB</span>
        <span className={styles.saved}>−62%</span>
      </div>
    </div>
  );
}

function RemoveBackgroundPreview() {
  return (
    <div className={styles.imgtool}>
      <div className={styles.baRow}>
        <div className={styles.baCell}><SampleImage className={styles.baImg} /></div>
        <Arrow />
        <div className={`${styles.baCell} ${styles.checker}`}>
          <SubjectImage className={styles.baImg} />
        </div>
      </div>
      <div className={styles.metaRow}><span>Background removed → transparent PNG</span></div>
    </div>
  );
}

function VideoToGifPreview() {
  return (
    <div className={styles.imgtool}>
      <div className={styles.baRow}>
        <div className={styles.videoFrame}>
          <SampleImage className={styles.baImg} />
          <span className={styles.playTri} />
        </div>
        <Arrow />
        <div className={styles.gifCell}>
          <SampleImage className={styles.baImg} />
          <span className={styles.gifTag}>GIF</span>
        </div>
      </div>
      <div className={styles.metaRow}>
        <span>MP4 / WebM</span>
        <Arrow />
        <span className={styles.strong}>animated GIF</span>
      </div>
    </div>
  );
}

export const PREVIEW_OVERRIDES = {
  'countdown-timer': <CountdownPreview />,
  'image-converter': <ImageConverterPreview />,
  'ico-creator': <IcoCreatorPreview />,
  'image-cropper': <ImageCropperPreview />,
  'image-resizer': <ImageResizerPreview />,
  'png-minifier': <PngMinifierPreview />,
  'remove-background': <RemoveBackgroundPreview />,
  'video-to-gif': <VideoToGifPreview />,
};

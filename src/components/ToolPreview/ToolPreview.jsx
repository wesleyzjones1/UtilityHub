import { useLayoutEffect, useRef, useState } from 'react';
import { PreviewContext } from '../../context/PreviewContext';
import { useLanguage } from '../../context/LanguageContext';
import { TOOL_COMPONENTS } from '../../registry/toolComponents';
import { PREVIEW_OVERRIDES } from './previewOverrides';
import styles from './ToolPreview.module.css';

const GAP = 10;
// The tool renders at this "desktop" width and we show this much of its height,
// then scale both down to fit. Card width = CONTENT_W × scale.
const CONTENT_W = 760;
const CONTENT_H = 480;

/** Bigger cards on wider screens so the content is easier to read. */
function pickScale(vw) {
  if (vw >= 1280) return 0.58;
  if (vw >= 992) return 0.5;
  return 0.4;
}

/**
 * Floating hover preview for navbar tool links. Renders a live, shrunk-down
 * snapshot of the actual tool (its interactive content only — header and
 * how-to are stripped via PreviewContext + PageShell), plus a short caption.
 * Tools that launch a full-screen view on submit (e.g. the countdown timer)
 * use a representative override from PREVIEW_OVERRIDES instead of their
 * landing screen. Positioned with `position: fixed`, preferring the right of
 * the hovered link and flipping left near the viewport edge. Decorative only.
 */
export default function ToolPreview({ page, rect }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);
  const { td, tt } = useLanguage();

  const scale = pickScale(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const width = Math.round(CONTENT_W * scale);
  const vpHeight = Math.round(CONTENT_H * scale);

  useLayoutEffect(() => {
    if (!rect) return;
    const height = ref.current ? ref.current.offsetHeight : 0;

    // Prefer the right of the anchor; flip to the left if it would overflow.
    let left = rect.right + GAP;
    if (left + width > window.innerWidth - GAP) {
      left = rect.left - GAP - width;
    }
    if (left < GAP) left = GAP;

    // Align to the anchor top, clamped into the viewport.
    let top = rect.top;
    if (top + height > window.innerHeight - GAP) {
      top = window.innerHeight - GAP - height;
    }
    if (top < GAP) top = GAP;

    setPos({ left, top });
  }, [rect, page, width]);

  if (!page) return null;

  const override = PREVIEW_OVERRIDES[page.id];
  const Component = TOOL_COMPONENTS[page.id];

  return (
    <div
      ref={ref}
      className={styles.card}
      style={{
        left: pos ? pos.left : (rect ? rect.right + GAP : 0),
        top: pos ? pos.top : (rect ? rect.top : 0),
        width: `${width}px`,
        '--vp-height': `${vpHeight}px`,
        '--scale': scale,
        visibility: pos ? 'visible' : 'hidden',
      }}
      aria-hidden="true"
    >
      <p className={styles.desc}>{td(page)}</p>
      <div className={styles.viewport}>
        {override ? (
          override
        ) : Component ? (
          <div className={styles.scaler}>
            <PreviewContext.Provider value={true}>
              <Component page={page} />
            </PreviewContext.Provider>
          </div>
        ) : (
          <div className={styles.fallback}>{tt(page)}</div>
        )}
      </div>
    </div>
  );
}

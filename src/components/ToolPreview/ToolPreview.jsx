import { useLayoutEffect, useRef, useState } from 'react';
import { PreviewContext } from '../../context/PreviewContext';
import { TOOL_COMPONENTS } from '../../registry/toolComponents';
import { PREVIEW_OVERRIDES } from './previewOverrides';
import styles from './ToolPreview.module.css';

const GAP = 10;
const WIDTH = 300;

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

  useLayoutEffect(() => {
    if (!rect) return;
    const height = ref.current ? ref.current.offsetHeight : 0;

    // Prefer the right of the anchor; flip to the left if it would overflow.
    let left = rect.right + GAP;
    if (left + WIDTH > window.innerWidth - GAP) {
      left = rect.left - GAP - WIDTH;
    }
    if (left < GAP) left = GAP;

    // Align to the anchor top, clamped into the viewport.
    let top = rect.top;
    if (top + height > window.innerHeight - GAP) {
      top = window.innerHeight - GAP - height;
    }
    if (top < GAP) top = GAP;

    setPos({ left, top });
  }, [rect, page]);

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
        visibility: pos ? 'visible' : 'hidden',
      }}
      aria-hidden="true"
    >
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
          <div className={styles.fallback}>{page.title}</div>
        )}
      </div>
      <p className={styles.desc}>{page.description}</p>
    </div>
  );
}

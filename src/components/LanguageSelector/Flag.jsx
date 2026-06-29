/**
 * Small inline SVG flags. Flag emoji (🇺🇸 etc.) do not render on Windows,
 * so we draw simplified, recognizable flags as SVG instead.
 * Rendered at a 4:3 ratio inside a rounded clip.
 */

const FLAGS = {
  en: (
    <>
      <rect width="24" height="18" fill="#fff" />
      <g fill="#b22234">
        <rect width="24" height="2" y="0" />
        <rect width="24" height="2" y="4" />
        <rect width="24" height="2" y="8" />
        <rect width="24" height="2" y="12" />
        <rect width="24" height="2" y="16" />
      </g>
      <rect width="11" height="10" fill="#3c3b6e" />
    </>
  ),
  es: (
    <>
      <rect width="24" height="18" fill="#c60b1e" />
      <rect width="24" height="9" y="4.5" fill="#ffc400" />
    </>
  ),
  fr: (
    <>
      <rect width="8" height="18" x="0" fill="#0055a4" />
      <rect width="8" height="18" x="8" fill="#fff" />
      <rect width="8" height="18" x="16" fill="#ef4135" />
    </>
  ),
  de: (
    <>
      <rect width="24" height="6" y="0" fill="#000" />
      <rect width="24" height="6" y="6" fill="#dd0000" />
      <rect width="24" height="6" y="12" fill="#ffce00" />
    </>
  ),
  zh: (
    <>
      <rect width="24" height="18" fill="#de2910" />
      <path
        d="M5 3.5l.9 2.8H9l-2.4 1.7.9 2.8L5 9.1 2.6 10.8l.9-2.8L1 6.3h3.1z"
        fill="#ffde00"
        transform="scale(0.6) translate(2 2)"
      />
    </>
  ),
  ja: (
    <>
      <rect width="24" height="18" fill="#fff" />
      <circle cx="12" cy="9" r="5" fill="#bc002d" />
    </>
  ),
};

export default function Flag({ code, className }) {
  const flag = FLAGS[code] ?? FLAGS.en;
  return (
    <svg
      className={className}
      width="20"
      height="15"
      viewBox="0 0 24 18"
      role="img"
      aria-hidden="true"
      style={{ borderRadius: 2, display: 'block', flexShrink: 0 }}
    >
      {flag}
    </svg>
  );
}

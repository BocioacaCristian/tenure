import "./CardBack.css";

/** A corner ornament's inset (in px from whichever edges apply) and rotation. */
interface Corner {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  rot: number;
}

/** Corner ornament placements for the face-down card frame. */
const CORNERS: Corner[] = [
  { top: 18, left: 18, rot: 0 },
  { top: 18, right: 18, rot: 90 },
  { bottom: 18, right: 18, rot: 180 },
  { bottom: 18, left: 18, rot: 270 },
];

/**
 * The face-down side of a card: a dark panel with a gilt seal, corner filigree, and the "Term"
 * wordmark. Shown on the cards stacked behind the active one and on the top card while it flips in.
 */
function CardBack() {
  return (
    <div className="card-back-face">
      <div className="card-back-face__frame" />

      {CORNERS.map((c, i) => (
        <div
          key={i}
          className="card-back-face__corner"
          style={{
            top: c.top,
            bottom: c.bottom,
            left: c.left,
            right: c.right,
            transform: `rotate(${c.rot}deg)`,
          }}
        >
          <svg
            viewBox="0 0 22 22"
            width="22"
            height="22"
            fill="none"
            stroke="rgba(201,161,74,.42)"
            strokeWidth="1"
            strokeLinecap="round"
          >
            <path d="M2 2 H10" />
            <path d="M2 2 V10" />
            <path d="M2 6 H6 V2" />
          </svg>
        </div>
      ))}

      <svg viewBox="0 0 120 120" width="170" height="170" className="card-back-face__seal">
        <defs>
          <radialGradient id="goldRing" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#d8b25c" />
            <stop offset="60%" stopColor="#a8852e" />
            <stop offset="100%" stopColor="#6e5520" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="52" stroke="url(#goldRing)" strokeWidth="1.2" fill="none" opacity=".85" />
        <circle cx="60" cy="60" r="48" stroke="rgba(201,161,74,.32)" strokeWidth=".6" fill="none" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const cx = 60 + Math.cos(a) * 44;
          const cy = 60 + Math.sin(a) * 44;
          return <circle key={i} cx={cx} cy={cy} r="0.7" fill="rgba(201,161,74,.55)" />;
        })}
        <path d="M22 64 Q34 86 60 92 Q86 86 98 64" stroke="rgba(201,161,74,.35)" strokeWidth=".8" fill="none" />
        <path d="M30 62 Q42 80 60 84 Q78 80 90 62" stroke="rgba(201,161,74,.22)" strokeWidth=".6" fill="none" />
        <g transform="translate(60 56)">
          <path
            d="M0 -18 L4.7 -5.7 L17.1 -5.7 L7.2 1.9 L11.5 14.6 L0 6.8 L-11.5 14.6 L-7.2 1.9 L-17.1 -5.7 L-4.7 -5.7 Z"
            fill="url(#goldRing)"
            stroke="rgba(0,0,0,.4)"
            strokeWidth=".4"
          />
        </g>
      </svg>

      <div className="card-back-face__wordmark">Term</div>
      <div className="card-back-face__grain" />
    </div>
  );
}

export default CardBack;

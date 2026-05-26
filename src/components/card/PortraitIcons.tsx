import * as React from "react";
import type { PortraitIcon } from "../../types";

/** Build the `d` for a 5-point star, so the multi-star rank icon comes from one source. */
function starPath(cx: number, cy: number, r: number): string {
  const ri = r * 0.42;
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : ri;
    d +=
      (i === 0 ? "M" : "L") +
      (cx + Math.cos(a) * rad).toFixed(2) +
      " " +
      (cy + Math.sin(a) * rad).toFixed(2) +
      " ";
  }
  return d + "Z";
}

/**
 * Role icons for portraits: single-colour line art on a 100×100 grid, content kept within the
 * inner ~22..78 area so every icon reads at the same scale. Stroke, weight, and joins are applied
 * by the parent `<g>` in {@link Portrait}; these fragments only describe geometry.
 */
export const PORTRAIT_ICON: Record<PortraitIcon, React.ReactElement> = {
  scroll: (
    <g>
      <ellipse cx="50" cy="26" rx="22" ry="3.5" />
      <ellipse cx="50" cy="74" rx="22" ry="3.5" />
      <line x1="28" y1="26" x2="28" y2="74" />
      <line x1="72" y1="26" x2="72" y2="74" />
      <line x1="38" y1="42" x2="62" y2="42" />
      <line x1="38" y1="50" x2="62" y2="50" />
      <line x1="38" y1="58" x2="62" y2="58" />
    </g>
  ),
  microphone: (
    <g>
      <rect x="40" y="22" width="20" height="32" rx="10" />
      <path d="M28 44 V50 Q28 64 50 64 Q72 64 72 50 V44" />
      <line x1="50" y1="64" x2="50" y2="76" />
      <line x1="40" y1="76" x2="60" y2="76" />
    </g>
  ),
  stars: (
    <g>
      <path d={starPath(26, 50, 8)} />
      <path d={starPath(50, 50, 10)} />
      <path d={starPath(74, 50, 8)} />
    </g>
  ),
  gavel: (
    <g>
      <rect x="42" y="20" width="36" height="14" rx="2" />
      <line x1="51" y1="20" x2="51" y2="34" />
      <line x1="69" y1="20" x2="69" y2="34" />
      <line x1="60" y1="34" x2="30" y2="64" />
      <rect x="20" y="66" width="32" height="10" rx="2" />
    </g>
  ),
  lightning: <path d="M54 20 L34 50 L46 50 L40 80 L66 46 L54 46 L60 22 Z" />,
  cross: <path d="M42 22 H58 V42 H78 V58 H58 V78 H42 V58 H22 V42 H42 Z" />,
  oliveBranch: (
    <g>
      <path d="M22 76 Q50 50 76 22" />
      <ellipse cx="36" cy="62" rx="3.5" ry="8" transform="rotate(-30 36 62)" />
      <ellipse cx="52" cy="46" rx="3.5" ry="8" transform="rotate(-30 52 46)" />
      <ellipse cx="44" cy="38" rx="3.5" ry="8" transform="rotate(60 44 38)" />
      <ellipse cx="60" cy="54" rx="3.5" ry="8" transform="rotate(60 60 54)" />
    </g>
  ),
  envelope: (
    <g>
      <rect x="22" y="32" width="56" height="36" rx="2" />
      <path d="M22 32 L50 54 L78 32" />
    </g>
  ),
  paperPlane: (
    <g>
      <path d="M22 50 L80 22 L62 78 L44 56 Z" />
      <line x1="44" y1="56" x2="80" y2="22" />
    </g>
  ),
  scales: (
    <g>
      <line x1="50" y1="22" x2="50" y2="76" />
      <line x1="22" y1="32" x2="78" y2="32" />
      <path d="M22 32 L14 52 L30 52 Z" />
      <path d="M78 32 L70 52 L86 52 Z" />
      <line x1="38" y1="76" x2="62" y2="76" />
      <circle cx="50" cy="22" r="2" />
    </g>
  ),
  openBook: (
    <g>
      <path d="M50 30 Q28 26 22 30 V70 Q28 66 50 70 Z" />
      <path d="M50 30 Q72 26 78 30 V70 Q72 66 50 70 Z" />
      <line x1="50" y1="30" x2="50" y2="70" />
    </g>
  ),
  leaf: (
    <g>
      <path d="M50 22 C32 28 22 50 30 76 C56 70 70 50 70 26 C64 22 56 22 50 22 Z" />
      <path d="M50 22 Q44 50 30 76" />
    </g>
  ),
  chartBars: (
    <g>
      <line x1="22" y1="78" x2="78" y2="78" />
      <rect x="26" y="52" width="11" height="22" />
      <rect x="44" y="34" width="11" height="40" />
      <rect x="62" y="44" width="11" height="30" />
    </g>
  ),
};

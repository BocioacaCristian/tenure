/** Pure, stateless math helpers shared across the engine and the UI. No React, no DOM. */

/** Clamp `value` into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation between `a` and `b` by `t` (0..1). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** How far `x` sits above `threshold`, remapped to 0..1 (0 at or below the threshold). */
export function remapAbove(threshold: number, x: number): number {
  return Math.max(0, (x - threshold) / (1 - threshold));
}

import type { PortraitStyle } from "../../types";
import { buildPortrait, pickDiscHue } from "./PortraitArt";

interface PortraitProps {
  portrait: PortraitStyle;
  size?: number;
}

/**
 * A character portrait: a flat-vector bust (composed in PortraitArt) on a hue-tinted disc, with a
 * thin gold ring, an upper-left highlight, and a bottom inner shadow that settles the figure into
 * the disc. Styling is inline so the disc stays self-contained.
 */
function Portrait({ portrait, size = 96 }: PortraitProps) {
  const { imageKey } = portrait;
  const hue = pickDiscHue(imageKey);
  const discBg = `radial-gradient(120% 100% at 30% 20%, hsl(${hue} 22% 22%) 0%, hsl(${hue} 18% 12%) 60%, hsl(${hue} 22% 6%) 100%)`;

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: discBg,
        position: "relative",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,.06), inset 0 -8px 16px rgba(0,0,0,.4), 0 6px 14px -6px rgba(0,0,0,.6)",
        overflow: "hidden",
        flex: "0 0 auto",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0, display: "block" }}
      >
        {buildPortrait(imageKey)}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1px rgba(201,161,74,.32)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -8,
          left: -8,
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,255,255,.16), rgba(255,255,255,0))",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(120% 80% at 50% 110%, rgba(0,0,0,.45), rgba(0,0,0,0) 60%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default Portrait;

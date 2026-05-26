import type { PortraitStyle } from "../../types";
import { PORTRAIT_ICON } from "./PortraitIcons";

interface PortraitProps {
  portrait: PortraitStyle;
  size?: number;
}

/**
 * A character portrait: a hue-tinted gradient disc carrying a uniform gold line-art role icon,
 * with a thin gold ring and a soft top-left highlight. Styling is inline so the disc stays
 * self-contained and does not depend on external CSS classes.
 */
function Portrait({ portrait, size = 96 }: PortraitProps) {
  const { hue, icon } = portrait;
  const bg = `radial-gradient(120% 100% at 30% 20%, hsl(${hue} 28% 28%) 0%, hsl(${hue} 22% 14%) 60%, hsl(${hue} 25% 8%) 100%)`;

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
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
        <g
          stroke="var(--color-gilt)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,.35))" }}
        >
          {PORTRAIT_ICON[icon]}
        </g>
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
    </div>
  );
}

export default Portrait;

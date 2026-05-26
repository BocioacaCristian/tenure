import { lerp, remapAbove } from "../../utils";
import "./SceneAtmosphere.css";

interface SceneAtmosphereProps {
  /** 0..1 crisis level; see `computeDanger`. Drives every layer's opacity/filter. */
  danger: number;
}

/**
 * The full-bleed ambient backdrop. Each layer's intensity is mapped from the single `danger`
 * scalar (some layers only switch on past a threshold). Long CSS transitions (~1.4s, in App.css)
 * smooth every change so danger fades in gradually rather than snapping.
 */
function SceneAtmosphere({ danger }: SceneAtmosphereProps) {
  const d = Math.max(0, Math.min(1, danger || 0));

  // Warm base scene loses saturation and dims as danger rises.
  const baseFilter = `saturate(${(1 - 0.7 * d).toFixed(3)}) brightness(${(1 - 0.18 * d).toFixed(3)})`;
  // Cold tint fades in across the whole range.
  const coldOpacity = 0.95 * d;
  // Red emergency wash only appears past mid-danger.
  const redOpacity = remapAbove(0.42, d) * 0.85;
  // Grain thickens from a faint baseline.
  const grainOpacity = lerp(0.07, 0.26, d);
  // Vignette tightens and darkens.
  const vigBg = `radial-gradient(${lerp(130, 90, d)}% ${lerp(95, 75, d)}% at 50% 45%,
    rgba(0,0,0,0) ${lerp(32, 18, d)}%,
    rgba(0,0,0,${(0.55 + 0.3 * d).toFixed(3)}) ${lerp(78, 65, d)}%,
    rgba(0,0,0,${(0.85 + 0.12 * d).toFixed(3)}) 100%)`;
  // Storm light and the unease drift are extreme-only.
  const stormOpacity = remapAbove(0.7, d) * 0.85;
  const uneaseOpacity = remapAbove(0.55, d) * 0.5;

  return (
    <div className="scene" aria-hidden>
      <div className="scene-base" style={{ filter: baseFilter }}>
        <div className="drapery" />
      </div>
      <div className="scene-cold" style={{ opacity: coldOpacity }} />
      <div className="scene-red" style={{ opacity: redOpacity }} />
      <div className="scene-storm" style={{ opacity: stormOpacity }}>
        <div className="scene-storm-inner" />
      </div>
      <div className="scene-unease" style={{ opacity: uneaseOpacity }} />
      <div className="scene-grain" style={{ opacity: grainOpacity }} />
      <div className="scene-vignette" style={{ background: vigBg }} />
    </div>
  );
}

export default SceneAtmosphere;

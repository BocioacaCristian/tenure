import * as React from "react";
import type { Effect, GameState, Resource } from "../../types";
import { RESOURCES } from "../../engine/game";
import { RESOURCE_ICON } from "./ResourceIcons";
import "./ResourceBar.css";

const SEGMENTS = 10;

const RESOURCE_LABELS: Record<Resource, string> = {
  approval: "Approval",
  treasury: "Treasury",
  military: "Military",
  media: "Media",
};
const RESOURCE_TOOLTIPS: Record<Resource, string> = {
  approval: "Public support. If it runs out, the people turn on you.",
  treasury: "The state's coffers. Empty them and the cabinet falls.",
  military: "Loyalty of the armed forces. Lose it and the generals act.",
  media: "Standing with the press. Lose it and the front pages turn.",
};

type ResourceMap = Record<Resource, number>;

/**
 * A smoothed copy of `target` that chases it via requestAnimationFrame, lagging ~`duration`ms with
 * ease-out-cubic. Compared by value-tuple so renders that don't change a resource don't re-tween.
 */
function useTweenedResources(target: ResourceMap, duration = 520): ResourceMap {
  const sig = RESOURCES.map((k) => target[k]).join("|");
  const [display, setDisplay] = React.useState<ResourceMap>(target);
  const displayRef = React.useRef<ResourceMap>(target);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    const from = { ...displayRef.current };
    const to = { ...target };
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const out = {} as ResourceMap;
      for (const k of RESOURCES) out[k] = from[k] + (to[k] - from[k]) * eased;
      displayRef.current = out;
      setDisplay(out);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        displayRef.current = { ...to };
        setDisplay({ ...to });
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, duration]);

  return display;
}

/** Dark tooltip above a meter icon, edge-clamped so it never overhangs the viewport. */
function Tooltip({ resource, open }: { resource: Resource; open: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shift, setShift] = React.useState(0);

  // Measure after commit, before paint, and translate so the tooltip stays on-screen. Adjusting
  // state from a layout measurement is the intended use of useLayoutEffect, hence the disable.
  React.useLayoutEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShift(0);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const m = 8;
    let delta = 0;
    if (rect.left < m) delta = m - rect.left;
    else if (rect.right > window.innerWidth - m) delta = window.innerWidth - m - rect.right;
    if (delta !== 0) setShift((prev) => prev + delta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, resource, shift === 0 ? 0 : 1]);

  React.useEffect(() => {
    if (!open) return;
    const onResize = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const unshiftedLeft = rect.left - shift;
      const unshiftedRight = rect.right - shift;
      const m = 8;
      let target = 0;
      if (unshiftedLeft < m) target = m - unshiftedLeft;
      else if (unshiftedRight > window.innerWidth - m) target = window.innerWidth - m - unshiftedRight;
      if (target !== shift) setShift(target);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, shift]);

  return (
    <div
      ref={ref}
      role="tooltip"
      aria-hidden={!open}
      style={{
        position: "absolute",
        bottom: "calc(100% + 10px)",
        left: "50%",
        transform: `translateX(calc(-50% + ${shift}px)) translateY(${open ? "0" : "4px"})`,
        width: 184,
        padding: "10px 12px 11px",
        background: "linear-gradient(180deg, rgba(28,30,36,.97), rgba(16,18,22,.97))",
        border: "1px solid rgba(201,161,74,.28)",
        borderRadius: "var(--radius-2)",
        boxShadow:
          "0 14px 30px -10px rgba(0,0,0,.7), 0 2px 6px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.04)",
        pointerEvents: "none",
        opacity: open ? 1 : 0,
        transition: "opacity 180ms ease",
        zIndex: 50,
        textAlign: "left",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: ".28em",
          textTransform: "uppercase",
          color: "var(--color-gilt)",
          marginBottom: 4,
          fontWeight: 500,
        }}
      >
        {RESOURCE_LABELS[resource]}
      </div>
      <div
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 11.5,
          lineHeight: 1.4,
          color: "var(--color-bone)",
          textWrap: "balance",
        }}
      >
        {RESOURCE_TOOLTIPS[resource]}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -5,
          left: `calc(50% - ${shift}px)`,
          width: 9,
          height: 9,
          marginLeft: -4.5,
          background: "linear-gradient(135deg, rgba(28,30,36,.97), rgba(16,18,22,.97))",
          borderRight: "1px solid rgba(201,161,74,.28)",
          borderBottom: "1px solid rgba(201,161,74,.28)",
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}

interface MeterProps {
  resource: Resource;
  value: number;
  displayValue: number;
  /** |effect| if the leaned choice touches this resource, else undefined. */
  stake?: number;
  isOpen: boolean;
  onOpen: (k: Resource) => void;
  onClose: () => void;
}

/** One resource gauge: icon (with tooltip) + a continuously-filling pip bar + the rounded value. */
function ResourceMeter({ resource, value, displayValue, stake, isOpen, onOpen, onClose }: MeterProps) {
  const isStake = stake != null && stake > 0;
  // Tier the at-stake magnitude into light/medium/heavy so the player feels size without seeing sign.
  const tier = !isStake ? 0 : stake >= 8 ? 3 : stake >= 4 ? 2 : 1;
  const dv = displayValue;
  const danger = dv <= 18 || dv >= 82;
  const animating = Math.abs(value - dv) > 0.3;

  const tierGlow = [0, 0.3, 0.55, 0.85][tier];
  const tierScale = [1, 1.012, 1.022, 1.035][tier];
  const tierLift = [0, 0.5, 1, 1.5][tier];
  const tierRing = [0, 0.3, 0.45, 0.65][tier];

  const onFill = isStake ? "var(--color-gilt)" : danger ? "var(--color-crimson)" : "var(--color-bone)";
  const onShadow = isStake ? "var(--color-gilt-soft)" : danger ? "var(--color-crimson-soft)" : "#8a8478";
  const iconColor = isStake ? "var(--color-gilt)" : danger ? "var(--color-crimson)" : "var(--color-bone)";

  const wrapperShadow = isStake
    ? `0 0 0 1px rgba(201,161,74,${tierRing}), 0 0 ${10 + tierGlow * 24}px -2px rgba(201,161,74,${tierGlow}), inset 0 1px 0 rgba(255,255,255,.04)`
    : danger
      ? "0 0 0 1px rgba(176,32,42,.55), 0 0 16px -4px rgba(176,32,42,.55), inset 0 1px 0 rgba(255,255,255,.04)"
      : "inset 0 1px 0 rgba(255,255,255,.04)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        background: "linear-gradient(180deg, rgba(34,37,45,.85), rgba(20,22,27,.85))",
        border: "1px solid rgba(255,255,255,.04)",
        borderRadius: "var(--radius-2)",
        boxShadow: wrapperShadow,
        transition: "box-shadow 360ms ease, transform 220ms ease",
        transform: `translateY(${-tierLift}px) scale(${tierScale})`,
        animation: danger && !isStake ? "dangerPulse 1.4s ease-in-out infinite" : "none",
      }}
    >
      <div
        data-meter-icon={resource}
        onMouseEnter={(e) => {
          if ((e.nativeEvent as PointerEvent).pointerType !== "touch") onOpen(resource);
        }}
        onMouseLeave={() => onClose()}
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) onClose();
          else onOpen(resource);
        }}
        style={{
          color: iconColor,
          display: "grid",
          placeItems: "center",
          position: "relative",
          cursor: "pointer",
          padding: 2,
          margin: -2,
          transition: "color 360ms ease",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {RESOURCE_ICON[resource]}
        <Tooltip resource={resource} open={isOpen} />
      </div>
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const fillRatio = Math.max(0, Math.min(1, dv / 10 - i));
          return (
            <div
              key={i}
              style={{
                position: "relative",
                flex: 1,
                height: 5,
                borderRadius: 1,
                background: "rgba(255,255,255,.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(180deg, ${onFill}, ${onShadow})`,
                  transformOrigin: "left center",
                  transform: `scaleX(${fillRatio})`,
                  boxShadow: isStake
                    ? `0 0 ${4 + tier * 2}px rgba(201,161,74,${0.35 + tierGlow * 0.5})`
                    : danger
                      ? "0 0 6px rgba(176,32,42,.6)"
                      : "none",
                  transition: "background 360ms ease, box-shadow 360ms ease",
                  willChange: "transform",
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: "var(--font-ui)",
          fontFeatureSettings: "'tnum'",
          fontSize: 11,
          fontWeight: 600,
          color: iconColor,
          minWidth: 22,
          textAlign: "right",
          transition: "color 360ms ease, transform 320ms cubic-bezier(.2,.7,.2,1)",
          transform: animating ? "scale(1.10)" : "scale(1)",
        }}
      >
        {Math.round(dv)}
      </div>
    </div>
  );
}

interface ResourceBarProps {
  state: GameState;
  /** Effect of the choice the player is leaning toward; |its values| are the at-stake magnitudes. */
  preview: Effect | null;
  /** Current term number, shown in the status line. */
  term: number;
  /** Whether the contingency fund is armed (shows a shield marker). */
  hasShield: boolean;
}

/** The top HUD: term/day status line plus the four resource gauges in a 2×2 grid. */
function ResourceBar({ state, preview, term, hasShield }: ResourceBarProps) {
  const resources: ResourceMap = {
    approval: state.approval,
    treasury: state.treasury,
    military: state.military,
    media: state.media,
  };
  const display = useTweenedResources(resources, 520);

  const [openTooltip, setOpenTooltip] = React.useState<Resource | null>(null);
  const open = (k: Resource) => setOpenTooltip(k);
  const close = () => setOpenTooltip(null);

  // Dismiss any open tooltip on an outside tap (mobile).
  React.useEffect(() => {
    if (openTooltip == null) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-meter-icon]")) close();
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, [openTooltip]);

  return (
    <div className="absolute inset-x-4 top-[calc(env(safe-area-inset-top,0px)+56px)] z-20">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="eyebrow">
          {hasShield && <span className="hud__shield" title="Contingency fund armed" />}
          Term {term} · In office
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone">
          Day <b className="font-medium text-gilt">{String(state.turn).padStart(2, "0")}</b>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {RESOURCES.map((k) => (
          <ResourceMeter
            key={k}
            resource={k}
            isOpen={openTooltip === k}
            onOpen={open}
            onClose={close}
            value={resources[k]}
            displayValue={display[k]}
            stake={preview ? Math.abs(preview[k] ?? 0) || undefined : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default ResourceBar;

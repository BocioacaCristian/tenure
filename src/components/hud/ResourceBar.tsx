import { motion } from "framer-motion";
import type { Effect, GameState, Resource } from "../../types";
import { RESOURCES } from "../../engine/game";
import { RESOURCE_ICON } from "./ResourceIcons";
import "./ResourceBar.css";

const SEGMENTS = 10;

interface MeterProps {
  resource: Resource;
  value: number;
  atStake: boolean;
  danger: boolean;
}

/** One resource gauge: icon + 10 pip segments + value. Glows gilt at stake, pulses crimson in danger. */
function ResourceMeter({ resource, value, atStake, danger }: MeterProps) {
  const tone = atStake ? "stake" : danger ? "danger" : "calm";
  const filled = Math.round((value / 100) * SEGMENTS);

  return (
    <div className={`meter meter--${tone}`}>
      <span className="meter__icon">{RESOURCE_ICON[resource]}</span>
      <div className="meter__pips">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <span key={i} className={`pip${i < filled ? " pip--on" : ""}`} />
        ))}
      </div>
      <motion.span
        className="meter__value"
        key={value}
        initial={{ scale: 1.25 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 480, damping: 16 }}
      >
        {value}
      </motion.span>
    </div>
  );
}

interface ResourceBarProps {
  state: GameState;
  /** Effect of the choice the player is leaning toward; its keys are the at-stake resources. */
  preview: Effect | null;
  /** Current term number, shown in the status line. */
  term: number;
  /** Whether the contingency fund is armed (shows a shield marker). */
  hasShield: boolean;
}

/** The top HUD: term/day status line plus the four resource gauges in a 2×2 grid. */
function ResourceBar({ state, preview, term, hasShield }: ResourceBarProps) {
  const atStake = new Set(preview ? Object.keys(preview) : []);

  return (
    <div className="absolute inset-x-4 top-[calc(env(safe-area-inset-top,0px)+40px)] z-20">
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
        {RESOURCES.map((key) => {
          const value = state[key];
          return (
            <ResourceMeter
              key={key}
              resource={key}
              value={value}
              atStake={atStake.has(key)}
              danger={value <= 18 || value >= 82}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ResourceBar;

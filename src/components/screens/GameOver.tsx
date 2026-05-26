import { motion } from "framer-motion";
import type { Resource } from "../../types";
import "./GameOver.css";

/** Cause-of-fall flavor, keyed by the resource that broke and its direction. */
const CAUSE_TEXT: Record<Resource, { low: string; high: string }> = {
  approval: {
    low: "The people turned. A vote of no confidence carried by dusk.",
    high: "Adored to excess. A cult of personality consumed the office.",
  },
  treasury: {
    low: "The treasury ran dry. Pensions went unpaid. The cabinet fell.",
    high: "An audit revealed unaccounted billions. The investigation took your office.",
  },
  military: {
    low: "The generals stopped returning your calls. Then they stopped asking permission.",
    high: "The army grew too loyal. A junta replaced you in the night.",
  },
  media: {
    low: "The press buried you for good. Every front page demanded resignation.",
    high: "The coverage adored you — until the documentary aired.",
  },
};

interface GameOverProps {
  cause: { resource: Resource; tooHigh: boolean } | null;
  /** Days this term lasted. */
  daysThisTerm: number;
  /** Cumulative days governed this run. */
  runDays: number;
  /** Best single term, ever. */
  longestTerm: number;
  onSucceed: () => void;
  onMenu: () => void;
}

/** Succession screen styled as a newspaper obituary; "New term" swears in a successor. */
function GameOver({ cause, daysThisTerm, runDays, longestTerm, onSucceed, onMenu }: GameOverProps) {
  const flavor = cause
    ? CAUSE_TEXT[cause.resource][cause.tooHigh ? "high" : "low"]
    : "Your term has ended.";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <motion.span
        className="eyebrow mb-[18px] text-crimson"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Term ended
      </motion.span>

      <motion.div
        className="obit"
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.22, type: "spring", stiffness: 280, damping: 26 }}
      >
        <div className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#5a4626]">
          The Daily Record
        </div>
        <div className="mt-2.5 mb-[18px] h-px bg-[#5a462655]" />
        <div className="text-center font-display text-[26px] font-medium italic leading-[1.15] tracking-[-0.02em] text-[#1a1611]">
          Your term ended
          <br />
          on day {daysThisTerm}.
        </div>
        <p className="mx-auto mt-[18px] max-w-[240px] text-center font-ui text-[13px] leading-[1.5] text-[#403725]">
          {flavor}
        </p>
        <div className="mx-auto mt-[22px] h-px w-9 bg-[#5a462666]" />
        <div className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#5a4626]">
          This run · {runDays} days · best term {Math.max(longestTerm, daysThisTerm)}
        </div>
      </motion.div>

      <motion.div
        className="mt-9 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button className="btn-outline" onClick={onSucceed}>
          New term
        </button>
        <button
          className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ash transition-colors hover:text-bone"
          onClick={onMenu}
        >
          Step down
        </button>
      </motion.div>
    </div>
  );
}

export default GameOver;

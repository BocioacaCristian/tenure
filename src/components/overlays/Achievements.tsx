import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "../../engine/achievements";

interface AchievementsProps {
  unlocked: string[];
  onClose: () => void;
}

/** Overlay listing every achievement, with earned ones highlighted and a progress count. */
function Achievements({ unlocked, onClose }: AchievementsProps) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-[rgba(5,6,8,0.72)] p-6 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="max-h-[88%] w-full max-w-[340px] overflow-y-auto rounded-3 bg-[linear-gradient(160deg,var(--color-obsidian-2),var(--color-obsidian))] px-5 py-[22px] shadow-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
      >
        <header className="mb-4 flex items-baseline justify-between">
          <h2 className="m-0 font-display text-[26px] font-medium italic text-parchment">
            Achievements
          </h2>
          <span className="font-mono text-[12px] tracking-[0.12em] text-gilt">
            {unlocked.length}/{ACHIEVEMENTS.length}
          </span>
        </header>

        <ul className="m-0 mb-4 flex list-none flex-col gap-2 p-0">
          {ACHIEVEMENTS.map((a) => {
            const earned = unlocked.includes(a.id);
            return (
              <li
                key={a.id}
                className={`flex items-center gap-3 rounded-2 border px-3 py-2.5 ${
                  earned
                    ? "border-gilt/40 bg-gilt/[0.08] opacity-100"
                    : "border-white/[0.04] bg-black/30 opacity-50"
                }`}
              >
                <span className="text-[1.4rem] leading-none">{earned ? a.icon : "🔒"}</span>
                <span className="flex flex-col text-left">
                  <strong className="font-ui text-[14px] font-semibold text-parchment">
                    {a.title}
                  </strong>
                  <small className="text-[12px] text-ash">{a.description}</small>
                </span>
              </li>
            );
          })}
        </ul>

        <button type="button" className="btn-outline" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

export default Achievements;

import { motion } from "framer-motion";
import type { Achievement } from "../../types";

interface ToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

/** Slide-in banner announcing a freshly unlocked achievement. */
function Toast({ achievement, onDismiss }: ToastProps) {
  return (
    <motion.button
      type="button"
      className="absolute left-1/2 top-[calc(env(safe-area-inset-top,0px)+16px)] z-50 flex -translate-x-1/2 items-center gap-3 rounded-2 bg-[linear-gradient(160deg,var(--color-obsidian-2),var(--color-ink-2))] px-4 py-3 text-parchment [box-shadow:0_0_0_1px_rgba(201,161,74,0.4),var(--shadow-soft)]"
      onClick={onDismiss}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <span className="text-[1.5rem] leading-none">{achievement.icon}</span>
      <span className="flex flex-col text-left">
        <small className="font-mono text-[9px] uppercase tracking-[0.22em] text-gilt">
          Achievement unlocked
        </small>
        <strong className="font-ui text-[14px] font-semibold">{achievement.title}</strong>
      </span>
    </motion.button>
  );
}

export default Toast;

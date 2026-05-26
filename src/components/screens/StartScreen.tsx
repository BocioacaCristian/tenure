import { motion, type Variants } from "framer-motion";
import "./StartScreen.css";

/** Container drives a staggered reveal of its children, top to bottom. */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
};

/** Each child rises and fades in; the stagger above spaces them out. */
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
};

interface StartScreenProps {
  best: number;
  unlockedCount: number;
  totalAchievements: number;
  onStart: () => void;
  onShowAchievements: () => void;
}

/** Title screen: a staggered reveal of the title and rules with a pulsing start button. */
function StartScreen({
  best,
  unlockedCount,
  totalAchievements,
  onStart,
  onShowAchievements,
}: StartScreenProps) {
  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center px-8 text-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="eyebrow text-gilt opacity-[0.85]" variants={item}>
        A swipe game of power
      </motion.div>

      <motion.h1
        className="mt-3.5 font-display text-[96px] font-medium italic leading-[0.9] tracking-[-0.04em] text-parchment [text-shadow:0_1px_0_rgba(0,0,0,0.6),0_20px_40px_rgba(0,0,0,0.5)]"
        variants={item}
      >
        Term
      </motion.h1>

      <motion.div className="rule my-5 w-[120px]" variants={item} />

      <motion.p className="mb-11 max-w-[280px] text-[15px] leading-[1.5] text-bone" variants={item}>
        Stay in office. Each turn brings one person, one question, two answers. Swipe to decide.
      </motion.p>

      <motion.div variants={item}>
        <button className="begin-btn" onClick={onStart}>
          Begin your term
        </button>
      </motion.div>

      <motion.div className="eyebrow mt-7" variants={item}>
        Personal best ·{" "}
        <b className="font-medium text-gilt">
          {best} {best === 1 ? "day" : "days"}
        </b>
      </motion.div>

      <motion.button
        className="eyebrow mt-3.5 transition-colors hover:text-gilt"
        variants={item}
        onClick={onShowAchievements}
      >
        Achievements · {unlockedCount}/{totalAchievements}
      </motion.button>
    </motion.div>
  );
}

export default StartScreen;

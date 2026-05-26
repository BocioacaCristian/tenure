import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type PanInfo,
} from "framer-motion";
import type { Card, Choice } from "../../types";
import Portrait from "./Portrait";
import CardBack from "./CardBack";
import "./GameCard.css";

/** Horizontal drag distance (px) past which a release commits the choice. */
const SWIPE_THRESHOLD = 90;
/** Smaller drag distance that starts previewing a choice (lighting up resources). */
const LEAN_THRESHOLD = 24;
/** Drag distance over which a choice overlay reaches full intensity. */
const LEAN_FULL = 110;
/** How far off-screen a committed card flies. */
const FLY_OFF = 560;
/** Duration of the rise-and-flip draw animation; input is gated until it finishes (ms). */
const DRAW_MS = 720;

/** Which way the player is leaning: -1 left, 0 undecided, 1 right. */
type Lean = -1 | 0 | 1;

interface GameCardProps {
  card: Card;
  onChoose: (choice: Choice) => void;
  /** Report the player's current lean so the HUD can preview at-stake resources. */
  onLean: (lean: Lean) => void;
}

/**
 * The draggable petitioner card. It is drawn face-down onto a short stack and flipped up each turn;
 * dragging tilts it, dims the portrait, and fades in the choice it is heading toward. Releasing past
 * the threshold (or pressing an arrow key) flies it off-screen and commits the choice.
 *
 * Mount with a `key` that changes each turn so the motion value and flip-in animation reset.
 */
function GameCard({ card, onChoose, onLean }: GameCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, (v) => v * 0.06);
  const y = useTransform(x, (v) => -Math.abs(v) * 0.05);

  // The header and prompt dim, and the hint fades, as a choice fades in over them.
  const headerOpacity = useTransform(x, [-LEAN_FULL, 0, LEAN_FULL], [0.45, 1, 0.45]);
  const promptOpacity = useTransform(x, [-LEAN_FULL, 0, LEAN_FULL], [0.75, 1, 0.75]);
  const hintOpacity = useTransform(x, [-LEAN_FULL, 0, LEAN_FULL], [0, 1, 0]);
  const leftOpacity = useTransform(x, [-LEAN_FULL, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, LEAN_FULL], [0, 1]);

  const [committing, setCommitting] = React.useState(false);
  const [entering, setEntering] = React.useState(true);
  const leanRef = React.useRef<Lean>(0);
  const committingRef = React.useRef(false);

  // Ignore input until the flip-in animation finishes.
  React.useEffect(() => {
    const t = setTimeout(() => setEntering(false), DRAW_MS);
    return () => clearTimeout(t);
  }, []);

  // Report lean in coarse buckets so the parent re-renders on direction changes, not every pixel.
  useMotionValueEvent(x, "change", (value) => {
    const bucket: Lean = value <= -LEAN_THRESHOLD ? -1 : value >= LEAN_THRESHOLD ? 1 : 0;
    if (bucket !== leanRef.current) {
      leanRef.current = bucket;
      onLean(bucket);
    }
  });

  function commit(choice: Choice, direction: -1 | 1) {
    if (committingRef.current || entering) return;
    committingRef.current = true;
    setCommitting(true);
    navigator.vibrate?.(12);
    animate(x, direction * FLY_OFF, {
      type: "tween",
      duration: 0.5,
      ease: [0.4, 0.1, 0.6, 0.9],
      onComplete: () => onChoose(choice),
    });
  }

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      commit(card.left, -1);
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      commit(card.right, 1);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 32 });
    }
  }

  // Keyboard play: arrow keys commit the matching choice.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        commit(card.left, -1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        commit(card.right, 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, entering]);

  return (
    <div className="card-deck">
      <div className="card-slot card-slot--behind2" aria-hidden>
        <CardBack />
      </div>
      <div className="card-slot card-slot--behind1" aria-hidden>
        <CardBack />
      </div>

      <motion.div
        className="card-slot card-slot--top"
        style={{ x, y, rotate }}
        drag={committing || entering ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
      >
        <div className="card-flip card-flip-in">
          <div className="card-face card-face--front">
            <div className="card__grain" aria-hidden />
            <div className="card__hairline" aria-hidden />

            <div className="card__body">
              <motion.div className="card__portrait" style={{ opacity: headerOpacity }}>
                <Portrait portrait={card.portrait} size={100} />
              </motion.div>
              <motion.div className="card__id" style={{ opacity: headerOpacity }}>
                <div className="card__name">{card.name}</div>
                <div className="card__role">{card.role}</div>
              </motion.div>
              <motion.p className="card__prompt" style={{ opacity: promptOpacity }}>
                <span className="card__quote">“</span>
                {card.prompt}
                <span className="card__quote">”</span>
              </motion.p>
              <motion.div className="card__hint" style={{ opacity: hintOpacity }}>
                ← swipe to decide →
              </motion.div>
            </div>

            <motion.div className="choice choice--left" style={{ opacity: leftOpacity }}>
              <div className="choice__inner">
                <div className="choice__lead">◀&nbsp;&nbsp;Left</div>
                <div className="choice__label">{card.left.label}</div>
              </div>
            </motion.div>
            <motion.div className="choice choice--right" style={{ opacity: rightOpacity }}>
              <div className="choice__inner">
                <div className="choice__lead">Right&nbsp;&nbsp;▶</div>
                <div className="choice__label">{card.right.label}</div>
              </div>
            </motion.div>
          </div>

          <div className="card-face card-face--back">
            <CardBack />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default GameCard;

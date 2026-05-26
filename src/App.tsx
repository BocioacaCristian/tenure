import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Choice, Effect } from "./types";
import { DECK } from "./data/cards";
import { computeDanger, getDeathCause } from "./engine/game";
import { ACHIEVEMENTS } from "./engine/achievements";
import { useGame } from "./hooks/useGame";
import Scene from "./components/scene/Scene";
import StartScreen from "./components/screens/StartScreen";
import ResourceBar from "./components/hud/ResourceBar";
import GameCard from "./components/card/GameCard";
import GameOver from "./components/screens/GameOver";
import Achievements from "./components/overlays/Achievements";
import Toast from "./components/overlays/Toast";

/** Lean direction the player is currently previewing: -1 left, 0 none, 1 right. */
type Lean = -1 | 0 | 1;

const screenMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 },
};

/** Root: the staged scene hosting the menu, the active term, and the succession screen. */
function App() {
  const game = useGame(DECK);
  const { state } = game;
  const [started, setStarted] = React.useState(false);
  const [lean, setLean] = React.useState<Lean>(0);
  const [showAchievements, setShowAchievements] = React.useState(false);

  // Derived from state, not stored separately.
  const screen = !started ? "menu" : state.isGameOver ? "over" : "playing";

  // 0 on the menu; at game over the fatal resource sits at an extreme, so this lands near 1.
  const danger = started ? computeDanger(state) : 0;

  const previewChoice: Choice | null =
    lean === -1 ? state.currentCard.left : lean === 1 ? state.currentCard.right : null;
  const preview: Effect | null = previewChoice ? previewChoice.effect : null;

  function startRun() {
    game.start();
    setStarted(true);
  }

  function handleChoose(choice: Choice) {
    setLean(0);
    game.choose(choice);
  }

  function succeed() {
    setLean(0);
    game.succeed();
  }

  function toMenu() {
    setLean(0);
    setStarted(false);
  }

  return (
    <Scene danger={danger}>
      <AnimatePresence>
        {game.toast && (
          <Toast key="toast" achievement={game.toast} onDismiss={game.dismissToast} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievements && (
          <Achievements
            key="achievements"
            unlocked={game.unlocked}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {screen === "menu" && (
          <motion.div key="menu" className="absolute inset-0 z-20 flex flex-col" {...screenMotion}>
            <StartScreen
              best={game.longestTerm}
              unlockedCount={game.unlocked.length}
              totalAchievements={ACHIEVEMENTS.length}
              onStart={startRun}
              onShowAchievements={() => setShowAchievements(true)}
            />
          </motion.div>
        )}

        {screen === "playing" && (
          <motion.div key="playing" className="absolute inset-0 z-20" {...screenMotion}>
            <ResourceBar
              state={state}
              preview={preview}
              term={game.term}
              hasShield={game.hasShield}
            />
            <div className="absolute inset-0 grid place-items-center">
              <GameCard
                key={state.turn}
                card={state.currentCard}
                onChoose={handleChoose}
                onLean={setLean}
              />
            </div>
            <div className="eyebrow pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+28px)] z-[5] text-center opacity-[0.55]">
              drag · or use ← →
            </div>
          </motion.div>
        )}

        {screen === "over" && (
          <motion.div key="over" className="absolute inset-0 z-20 flex flex-col" {...screenMotion}>
            <GameOver
              cause={getDeathCause(state)}
              daysThisTerm={state.turn}
              runDays={game.runDays}
              longestTerm={game.longestTerm}
              onSucceed={succeed}
              onMenu={toMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Scene>
  );
}

export default App;

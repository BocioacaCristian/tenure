import * as React from "react";
import type { Achievement, Card, Choice, GameState, Progress } from "../types";
import { applyChoice, createInitialState, SHIELD_FLAG } from "../engine/game";
import { ACHIEVEMENTS, emptyProgress, evaluate, recordState, recordTermEnd } from "../engine/achievements";

const PROGRESS_KEY = "reigns-progress";
const UNLOCKED_KEY = "reigns-achievements";
const TOAST_MS = 3500;

/** Read persisted lifetime progress, repairing/falling back on absent or corrupt storage. */
function loadProgress(): Progress {
  const base = emptyProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      ...base,
      ...parsed,
      peakResources: { ...base.peakResources, ...parsed.peakResources },
      seenCardIds: Array.isArray(parsed.seenCardIds) ? parsed.seenCardIds : base.seenCardIds,
    };
  } catch {
    return base;
  }
}

/** Read the persisted set of unlocked achievement ids. */
function loadUnlocked(): string[] {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/** Persist a value as JSON, swallowing storage errors (e.g. private mode). */
function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable; the session still works in memory.
  }
}

/** Everything the UI needs: the active term, run/lifetime stats, achievements, and the actions. */
export interface UseGame {
  state: GameState;
  /** Current term number within this run (resets when returning to the menu). */
  term: number;
  /** Cumulative days governed this run, including any term that has just ended. */
  runDays: number;
  /** Most days survived in a single term, ever. */
  longestTerm: number;
  /** Ids of unlocked achievements. */
  unlocked: string[];
  /** An achievement just unlocked, shown briefly as a toast. */
  toast: Achievement | null;
  /** Whether the rainy-day fund is currently armed. */
  hasShield: boolean;
  choose: (choice: Choice) => void;
  /** Swear in a successor: a fresh term, but the run (and its tally) continues. */
  succeed: () => void;
  /** Start a brand-new run at term 1 (used when leaving the menu). */
  start: () => void;
  dismissToast: () => void;
}

/**
 * Bind the pure engine to React and add succession, lifetime achievement tracking, and the unlock
 * toast. Progress and unlocks are written in the handler that changes them rather than in a render
 * effect, which keeps the render path free of state-syncing loops.
 */
export function useGame(deck: Card[]): UseGame {
  const [state, setState] = React.useState<GameState>(() => createInitialState(deck));
  const [term, setTerm] = React.useState(1);
  const [runDays, setRunDays] = React.useState(0);
  const [progress, setProgress] = React.useState<Progress>(loadProgress);
  const [unlocked, setUnlocked] = React.useState<string[]>(loadUnlocked);
  const [toast, setToast] = React.useState<Achievement | null>(null);

  /** Persist progress and surface any newly earned achievement as a toast. */
  const commitProgress = React.useCallback(
    (next: Progress) => {
      setProgress(next);
      save(PROGRESS_KEY, next);

      const earned = evaluate(next);
      const fresh = earned.filter((id) => !unlocked.includes(id));
      if (fresh.length === 0) return;

      const all = [...unlocked, ...fresh];
      setUnlocked(all);
      save(UNLOCKED_KEY, all);
      const achievement = ACHIEVEMENTS.find((a) => a.id === fresh[0]);
      if (achievement) setToast(achievement);
    },
    [unlocked],
  );

  const choose = React.useCallback(
    (choice: Choice) => {
      if (state.isGameOver) return;
      const next = applyChoice(state, choice, deck);
      setState(next);

      let advanced = recordState(progress, next);
      if (next.isGameOver) {
        advanced = recordTermEnd(advanced, next.turn);
        setRunDays((d) => d + next.turn);
      }
      commitProgress(advanced);
    },
    [state, deck, progress, commitProgress],
  );

  const succeed = React.useCallback(() => {
    const fresh = createInitialState(deck);
    setState(fresh);
    setTerm((t) => t + 1);
    commitProgress(recordState(progress, fresh));
  }, [deck, progress, commitProgress]);

  const start = React.useCallback(() => {
    const fresh = createInitialState(deck);
    setState(fresh);
    setTerm(1);
    setRunDays(0);
    commitProgress(recordState(progress, fresh));
  }, [deck, progress, commitProgress]);

  const dismissToast = React.useCallback(() => setToast(null), []);

  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return {
    state,
    term,
    runDays,
    longestTerm: progress.longestTerm,
    unlocked,
    toast,
    hasShield: state.flags.includes(SHIELD_FLAG),
    choose,
    succeed,
    start,
    dismissToast,
  };
}

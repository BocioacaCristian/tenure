import type { Achievement, GameState, Progress } from "../types";
import { RESOURCES } from "./game";

/** Sentinel for "no term has ended yet"; larger than any real term length. */
const NO_TERM = Number.MAX_SAFE_INTEGER;

/** A fresh, empty progress record. */
export function emptyProgress(): Progress {
  return {
    seenCardIds: [],
    termsServed: 0,
    longestTerm: 0,
    shortestTerm: NO_TERM,
    peakResources: { approval: 50, treasury: 50, military: 50, media: 50 },
  };
}

/** The achievement set. Kept small and condition-checkable from {@link Progress} alone. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "inaugurated",
    title: "Inaugurated",
    description: "Survive your first day in office.",
    icon: "🎖️",
    isUnlocked: (p) => p.longestTerm >= 1,
  },
  {
    id: "shooting-star",
    title: "Shooting Star",
    description: "Have a term end in under 3 days.",
    icon: "💫",
    isUnlocked: (p) => p.termsServed >= 1 && p.shortestTerm < 3,
  },
  {
    id: "statesman",
    title: "Statesman",
    description: "Survive 25 days in a single term.",
    icon: "🏆",
    isUnlocked: (p) => p.longestTerm >= 25,
  },
  {
    id: "peaceful-transfer",
    title: "Peaceful Transfer",
    description: "Hand power to a successor twice.",
    icon: "🏛️",
    isUnlocked: (p) => p.termsServed >= 2,
  },
  {
    id: "landslide",
    title: "Landslide",
    description: "Push Approval to 90 or higher.",
    icon: "🗳️",
    isUnlocked: (p) => p.peakResources.approval >= 90,
  },
  {
    id: "front-page",
    title: "Front Page",
    description: "Push Media to 90 or higher.",
    icon: "📰",
    isUnlocked: (p) => p.peakResources.media >= 90,
  },
  {
    id: "war-chest",
    title: "War Chest",
    description: "Push Treasury to 90 or higher.",
    icon: "💰",
    isUnlocked: (p) => p.peakResources.treasury >= 90,
  },
  {
    id: "full-cabinet",
    title: "Full Cabinet",
    description: "Meet 12 different petitioners.",
    icon: "🎭",
    isUnlocked: (p) => p.seenCardIds.length >= 12,
  },
];

/** Ids of every achievement currently earned by the given progress. */
export function evaluate(progress: Progress): string[] {
  return ACHIEVEMENTS.filter((a) => a.isUnlocked(progress)).map((a) => a.id);
}

/** Record the card now on screen and the resource highs from a state. Pure. */
export function recordState(progress: Progress, state: GameState): Progress {
  const seenCardIds = progress.seenCardIds.includes(state.currentCard.id)
    ? progress.seenCardIds
    : [...progress.seenCardIds, state.currentCard.id];

  const peakResources = { ...progress.peakResources };
  for (const r of RESOURCES) {
    if (state[r] > peakResources[r]) peakResources[r] = state[r];
  }
  return { ...progress, seenCardIds, peakResources };
}

/** Record that a term ended after `days`, updating term count and longest/shortest. Pure. */
export function recordTermEnd(progress: Progress, days: number): Progress {
  return {
    ...progress,
    termsServed: progress.termsServed + 1,
    longestTerm: Math.max(progress.longestTerm, days),
    shortestTerm: Math.min(progress.shortestTerm, days),
  };
}

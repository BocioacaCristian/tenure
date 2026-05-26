import type { Resource } from "./game";

/** Lifetime progress used to evaluate achievements. Persisted across sessions. */
export interface Progress {
  /** Distinct card ids the player has ever seen. */
  seenCardIds: string[];
  /** Number of terms that have ended (deaths). */
  termsServed: number;
  /** Most days survived in a single term. */
  longestTerm: number;
  /** Fewest days a term lasted (a large sentinel until the first term ends). */
  shortestTerm: number;
  /** Highest value each resource has ever reached. */
  peakResources: Record<Resource, number>;
}

/** A single unlockable goal, plus the predicate that decides if it's earned. */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: (progress: Progress) => boolean;
}

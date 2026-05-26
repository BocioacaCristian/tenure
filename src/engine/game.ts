import type { Card, Choice, Effect, GameState, Resource } from "../types";
import { clamp } from "../utils";

/** The four resources, in display order. Single source of truth for iteration. */
export const RESOURCES: Resource[] = ["approval", "treasury", "military", "media"];

/** Flag granted by the "rainy-day fund" card; consumed to survive one fatal extreme. */
export const SHIELD_FLAG = "rainy_day_fund";

const MIN = 0;
const MAX = 100;
const START_VALUE = 50;

/** Values a shielded resource is pulled back to when the fund saves the term. */
const SAFE_LOW = 18;
const SAFE_HIGH = 82;

/** Append items to a string list, keeping it free of duplicates. */
function addUnique(list: string[], items: string[]): string[] {
  const merged = [...list];
  for (const item of items) {
    if (!merged.includes(item)) merged.push(item);
  }
  return merged;
}

/** Current resource values as a lookup, for evaluating card conditions. */
type ResourceMap = Record<Resource, number>;

/** Is a card eligible to be drawn given the current resources, flags, and once-history? */
function isEligible(
  card: Card,
  resources: ResourceMap,
  flags: string[],
  used: string[],
): boolean {
  if (card.once && used.includes(card.id)) return false;
  const condition = card.condition;
  if (!condition) return true;

  if (condition.flags && !condition.flags.every((f) => flags.includes(f))) return false;
  if (condition.notFlags && condition.notFlags.some((f) => flags.includes(f))) return false;

  if (condition.resources) {
    for (const key of Object.keys(condition.resources) as Resource[]) {
      const range = condition.resources[key];
      if (!range) continue;
      if (range.min !== undefined && resources[key] < range.min) return false;
      if (range.max !== undefined && resources[key] > range.max) return false;
    }
  }
  return true;
}

/**
 * Choose the next card: an eligible queued follow-up takes priority (giving event chains their
 * cause-and-effect), otherwise a random eligible card, avoiding an immediate repeat. Returns the
 * card and the queue with any drawn follow-up removed.
 */
function selectNext(
  deck: Card[],
  resources: ResourceMap,
  flags: string[],
  used: string[],
  queue: string[],
  excludeId?: string,
): { card: Card; queue: string[] } {
  for (let i = 0; i < queue.length; i++) {
    const card = deck.find((c) => c.id === queue[i]);
    if (card && isEligible(card, resources, flags, used)) {
      return { card, queue: [...queue.slice(0, i), ...queue.slice(i + 1)] };
    }
  }

  const eligible = deck.filter((c) => isEligible(c, resources, flags, used));
  const pool = eligible.filter((c) => c.id !== excludeId);
  const source = pool.length > 0 ? pool : eligible;
  return { card: source[Math.floor(Math.random() * source.length)], queue };
}

/** Start a fresh term: all resources at 50, no flags/queue/history, first eligible card drawn. */
export function createInitialState(deck: Card[]): GameState {
  const resources: ResourceMap = {
    approval: START_VALUE,
    treasury: START_VALUE,
    military: START_VALUE,
    media: START_VALUE,
  };
  const { card } = selectNext(deck, resources, [], [], []);
  return {
    ...resources,
    turn: 0,
    currentCard: card,
    flags: [],
    queue: [],
    used: [],
    isGameOver: false,
  };
}

/** True if any resource has hit a fatal extreme (≤ 0 or ≥ 100). */
export function checkGameOver(state: GameState): boolean {
  return RESOURCES.some((r) => state[r] <= MIN || state[r] >= MAX);
}

/** The first resource at a fatal extreme and its direction, or null while the term continues. */
export function getDeathCause(
  state: GameState,
): { resource: Resource; tooHigh: boolean } | null {
  for (const r of RESOURCES) {
    if (state[r] <= MIN) return { resource: r, tooHigh: false };
    if (state[r] >= MAX) return { resource: r, tooHigh: true };
  }
  return null;
}

/**
 * Collapse the four resources into one 0..1 "danger" scalar for the ambient scene. Values around
 * the centre (roughly 35..65) read as 0; danger ramps toward 1 as the most extreme resource nears
 * a fatal edge (0 or 100). The worst of the four wins.
 */
export function computeDanger(state: GameState): number {
  let worst = 0;
  for (const r of RESOURCES) {
    const extremity = Math.abs(state[r] - START_VALUE) / START_VALUE; // 0 at centre, 1 at an edge
    const shaped = Math.max(0, (extremity - 0.3) / 0.7); // dead-band: 0 inside ~35..65
    if (shaped > worst) worst = shaped;
  }
  return Math.min(1, worst);
}

/** Spend the rainy-day fund: drop the flag and pull any failing resource back into a safe band. */
function applyShield(state: GameState): GameState {
  const rescued: GameState = { ...state, flags: state.flags.filter((f) => f !== SHIELD_FLAG) };
  for (const r of RESOURCES) {
    if (rescued[r] <= MIN) rescued[r] = SAFE_LOW;
    else if (rescued[r] >= MAX) rescued[r] = SAFE_HIGH;
  }
  return rescued;
}

/**
 * Apply a choice and return a new state without mutating the input: resources change and clamp,
 * the day advances, flags/queue/once-history update, the rainy-day fund spends itself to avert a
 * loss, and `isGameOver` is set if a resource still sits at a fatal extreme. On a loss the current
 * card stays on screen so the UI can show what ended the term.
 */
export function applyChoice(state: GameState, choice: Choice, deck: Card[]): GameState {
  const effect: Effect = choice.effect;
  const flags = choice.setFlags ? addUnique(state.flags, choice.setFlags) : state.flags;
  const queue = choice.unlocks ? addUnique(state.queue, choice.unlocks) : state.queue;
  const used = state.currentCard.once
    ? addUnique(state.used, [state.currentCard.id])
    : state.used;

  let next: GameState = {
    approval: clamp(state.approval + (effect.approval ?? 0), MIN, MAX),
    treasury: clamp(state.treasury + (effect.treasury ?? 0), MIN, MAX),
    military: clamp(state.military + (effect.military ?? 0), MIN, MAX),
    media: clamp(state.media + (effect.media ?? 0), MIN, MAX),
    turn: state.turn + 1,
    currentCard: state.currentCard,
    flags,
    queue,
    used,
    isGameOver: false,
  };

  if (checkGameOver(next) && next.flags.includes(SHIELD_FLAG)) {
    next = applyShield(next);
  }

  next.isGameOver = checkGameOver(next);
  if (!next.isGameOver) {
    const drawn = selectNext(
      deck,
      {
        approval: next.approval,
        treasury: next.treasury,
        military: next.military,
        media: next.media,
      },
      next.flags,
      next.used,
      next.queue,
      state.currentCard.id,
    );
    next.currentCard = drawn.card;
    next.queue = drawn.queue;
  }
  return next;
}

import type { PortraitStyle } from "./portrait";

/** The four resources, each in the range 0–100. */
export type Resource = "approval" | "treasury" | "military" | "media";

/** A change in resources applied by a choice. Positive values raise, negative lower. */
export interface Effect {
  approval?: number;
  treasury?: number;
  military?: number;
  media?: number;
}

/** A range a resource must fall within for a card to be eligible. Omit a bound to skip it. */
export interface Range {
  min?: number;
  max?: number;
}

/**
 * Eligibility rules for a card. A card is only drawn when every listed rule holds; omit
 * `condition` to make a card always eligible.
 */
export interface Condition {
  /** Resource thresholds that must currently hold. */
  resources?: Partial<Record<Resource, Range>>;
  /** Narrative flags that must all be set. */
  flags?: string[];
  /** Narrative flags that must NOT be set. */
  notFlags?: string[];
}

/** One of the two choices on a card (left / right swipe). */
export interface Choice {
  /** The answer text shown to the player. */
  label: string;
  /** What happens to the resources when this choice is taken. */
  effect: Effect;
  /** Card ids to queue as follow-ups, drawn before random cards (event chains). */
  unlocks?: string[];
  /** Narrative flags to set when this choice is taken. */
  setFlags?: string[];
}

/** One petitioner: a situation and two opposing choices. */
export interface Card {
  id: string;
  /** The person's name (e.g. "Arthur Vance"). */
  name: string;
  /** Their title or role (e.g. "Chief of Staff"). */
  role: string;
  /** Portrait styling: a gradient disc and a role icon. */
  portrait: PortraitStyle;
  /** The situation or request, shown in quotes. */
  prompt: string;
  /** Eligibility rules; absent means always eligible. */
  condition?: Condition;
  /** When true, the card is drawn at most once per term (story beats / chain steps). */
  once?: boolean;
  left: Choice;
  right: Choice;
}

/** The complete game state for a single term. Resources are 0–100; a term ends outside [1, 99]. */
export interface GameState {
  approval: number;
  treasury: number;
  military: number;
  media: number;
  /** Days survived in the current term (the per-term score). */
  turn: number;
  /** The card currently on screen. */
  currentCard: Card;
  /** Narrative flags accumulated this term. */
  flags: string[];
  /** Card ids unlocked as follow-ups, drawn ahead of random cards. */
  queue: string[];
  /** Ids of `once` cards already drawn this term. */
  used: string[];
  /** True when the current term has ended (a resource hit a fatal extreme). */
  isGameOver: boolean;
}

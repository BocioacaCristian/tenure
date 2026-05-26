import { describe, expect, it } from "vitest";
import type { Card, GameState, PortraitStyle } from "../types";
import {
  applyChoice,
  checkGameOver,
  computeDanger,
  createInitialState,
  getDeathCause,
  SHIELD_FLAG,
} from "./game";

/** Minimal portrait so test cards satisfy the type. */
const PORTRAIT: PortraitStyle = { hue: 0, icon: "scroll" };

const DECK: Card[] = [
  {
    id: "a",
    name: "A",
    role: "r",
    portrait: PORTRAIT,
    prompt: "?",
    left: { label: "L", effect: { treasury: -10 } },
    right: { label: "R", effect: { treasury: +10 } },
  },
  {
    id: "b",
    name: "B",
    role: "r",
    portrait: PORTRAIT,
    prompt: "?",
    left: { label: "L", effect: { military: -60 } },
    right: { label: "R", effect: { approval: +60 } },
  },
  {
    id: "chain",
    name: "C",
    role: "r",
    portrait: PORTRAIT,
    prompt: "follow-up",
    once: true,
    left: { label: "L", effect: {} },
    right: { label: "R", effect: {} },
  },
  {
    id: "gated",
    name: "G",
    role: "r",
    portrait: PORTRAIT,
    prompt: "rich-only",
    condition: { resources: { treasury: { min: 90 } } },
    left: { label: "L", effect: {} },
    right: { label: "R", effect: {} },
  },
];

/** Build a state with overridable fields. */
function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    approval: 50,
    treasury: 50,
    military: 50,
    media: 50,
    turn: 0,
    currentCard: DECK[0],
    flags: [],
    queue: [],
    used: [],
    isGameOver: false,
    ...overrides,
  };
}

describe("createInitialState", () => {
  it("starts every resource at 50 with turn 0 and a card drawn", () => {
    const state = createInitialState(DECK);
    expect(state).toMatchObject({
      approval: 50,
      treasury: 50,
      military: 50,
      media: 50,
      turn: 0,
      isGameOver: false,
      flags: [],
      queue: [],
      used: [],
    });
    expect(DECK).toContain(state.currentCard);
  });

  it("never opens on a card gated by an unmet condition", () => {
    for (let i = 0; i < 30; i++) {
      expect(createInitialState(DECK).currentCard.id).not.toBe("gated");
    }
  });
});

describe("applyChoice", () => {
  it("applies the effect and advances the turn", () => {
    const next = applyChoice(makeState(), DECK[0].right, DECK);
    expect(next.treasury).toBe(60);
    expect(next.turn).toBe(1);
    expect(next.isGameOver).toBe(false);
  });

  it("clamps resources into [0, 100]", () => {
    const next = applyChoice(makeState({ approval: 50 }), DECK[1].right, DECK);
    expect(next.approval).toBe(100);
  });

  it("ends the game when a resource hits a fatal extreme", () => {
    const next = applyChoice(makeState({ military: 50 }), DECK[1].left, DECK);
    expect(next.military).toBe(0);
    expect(next.isGameOver).toBe(true);
  });

  it("does not mutate the input state (purity)", () => {
    const state = makeState();
    const snapshot = structuredClone(state);
    applyChoice(state, DECK[0].left, DECK);
    expect(state).toEqual(snapshot);
  });

  it("queues an unlocked follow-up and draws it next", () => {
    const choice = { label: "L", effect: {}, unlocks: ["chain"] };
    const next = applyChoice(makeState(), choice, DECK);
    expect(next.currentCard.id).toBe("chain");
  });

  it("sets flags from a choice", () => {
    const choice = { label: "L", effect: {}, setFlags: ["coverup"] };
    const next = applyChoice(makeState(), choice, DECK);
    expect(next.flags).toContain("coverup");
  });

  it("spends the contingency fund to avert a loss instead of ending the term", () => {
    const next = applyChoice(
      makeState({ military: 50, flags: [SHIELD_FLAG] }),
      DECK[1].left,
      DECK,
    );
    expect(next.isGameOver).toBe(false);
    expect(next.military).toBeGreaterThan(0);
    expect(next.flags).not.toContain(SHIELD_FLAG);
  });
});

describe("getDeathCause", () => {
  it("reports the failing resource and direction", () => {
    expect(getDeathCause(makeState({ approval: 0 }))).toEqual({
      resource: "approval",
      tooHigh: false,
    });
    expect(getDeathCause(makeState({ media: 100 }))).toEqual({
      resource: "media",
      tooHigh: true,
    });
  });

  it("returns null while the term continues", () => {
    expect(getDeathCause(makeState())).toBeNull();
  });
});

describe("computeDanger", () => {
  it("reads as calm (0) at the resting centre", () => {
    expect(computeDanger(makeState())).toBe(0);
  });

  it("stays at 0 inside the comfortable dead-band", () => {
    expect(computeDanger(makeState({ approval: 60 }))).toBe(0);
    expect(computeDanger(makeState({ media: 40 }))).toBe(0);
  });

  it("ramps up as a resource nears a fatal edge, peaking at 1", () => {
    const mild = computeDanger(makeState({ treasury: 25 }));
    const severe = computeDanger(makeState({ treasury: 10 }));
    expect(mild).toBeGreaterThan(0);
    expect(severe).toBeGreaterThan(mild);
    expect(computeDanger(makeState({ treasury: 0 }))).toBe(1);
    expect(computeDanger(makeState({ military: 100 }))).toBe(1);
  });

  it("reports the worst of the four, not the average", () => {
    const state = makeState({ approval: 50, treasury: 50, military: 50, media: 8 });
    expect(computeDanger(state)).toBeCloseTo(computeDanger(makeState({ media: 8 })));
  });
});

describe("checkGameOver", () => {
  it("is false when all resources are within (0, 100)", () => {
    expect(checkGameOver(makeState())).toBe(false);
  });

  it("is true at either extreme", () => {
    expect(checkGameOver(makeState({ approval: 0 }))).toBe(true);
    expect(checkGameOver(makeState({ approval: 100 }))).toBe(true);
  });
});

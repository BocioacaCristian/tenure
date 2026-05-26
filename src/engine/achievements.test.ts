import { describe, expect, it } from "vitest";
import { emptyProgress, evaluate, recordState, recordTermEnd } from "./achievements";
import type { Card, GameState } from "../types";

const card: Card = {
  id: "x",
  name: "X",
  role: "r",
  portrait: { imageKey: "vance" },
  prompt: "?",
  left: { label: "L", effect: {} },
  right: { label: "R", effect: {} },
};

function state(overrides: Partial<GameState> = {}): GameState {
  return {
    approval: 50,
    treasury: 50,
    military: 50,
    media: 50,
    turn: 0,
    currentCard: card,
    flags: [],
    queue: [],
    used: [],
    isGameOver: false,
    ...overrides,
  };
}

describe("achievement progress", () => {
  it("unlocks nothing from an empty record", () => {
    expect(evaluate(emptyProgress())).toEqual([]);
  });

  it("tracks resource peaks and unlocks the matching achievement", () => {
    const p = recordState(emptyProgress(), state({ approval: 92 }));
    expect(p.peakResources.approval).toBe(92);
    expect(evaluate(p)).toContain("landslide");
  });

  it("records distinct seen cards without duplicates", () => {
    let p = recordState(emptyProgress(), state());
    p = recordState(p, state());
    expect(p.seenCardIds).toEqual(["x"]);
  });

  it("unlocks shooting-star only after a sub-3-day term ends", () => {
    const p = recordTermEnd(emptyProgress(), 2);
    expect(p.shortestTerm).toBe(2);
    expect(evaluate(p)).toContain("shooting-star");
  });
});

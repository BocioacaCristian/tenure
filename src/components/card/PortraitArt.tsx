import * as React from "react";
import type { PortraitKey } from "../../types";

/**
 * Flat-vector portrait system. Every character is composed from one shared feature library — flat
 * colours, a 3/4 bust, a warm key from camera-right — so the whole cast looks like one illustrator
 * drew them. `buildPortrait(key)` returns the SVG group for a character; `pickDiscHue(key)` gives a
 * stable disc tint. Drawn inside the disc by the Portrait component.
 */

// ── Colour tokens ───────────────────────────────────────────────
const SKIN = {
  fair: { base: "#e9c8a8", shade: "#c79f7a" },
  light: { base: "#dab28a", shade: "#b58961" },
  tan: { base: "#b78760", shade: "#8b6240" },
  brown: { base: "#8a5a3a", shade: "#5e3c24" },
  deep: { base: "#5e3a26", shade: "#3a2316" },
} as const;
const HAIR_C = {
  black: "#0e0a08",
  dark: "#1f1611",
  brown: "#4a311e",
  red: "#6b2f1a",
  blonde: "#c8a35a",
  grey: "#7c7770",
  silver: "#b7b1a2",
  white: "#d8d2c2",
} as const;
const CLOTH = {
  charcoal: "#1c1f25",
  ink: "#0e1014",
  navy: "#172238",
  burgundy: "#3a1418",
  sage: "#34433a",
  trench: "#7a6a52",
  white: "#e2dccb",
  saffron: "#a8662a",
  steel: "#3a4250",
  olive: "#3a3a24",
  violet: "#2a2238",
} as const;
const ACCENT = { gilt: "#c9a14a", crimson: "#b0202a", sage: "#6a8b6f" } as const;

type SkinKey = keyof typeof SKIN;
type HairColorKey = keyof typeof HAIR_C;
type BrowKey = "neutral" | "stern" | "tired" | "wry" | "smug";
type ExprKey = "neutral" | "smile" | "smirk" | "smirkR" | "frown" | "open";

// ── Feature primitives (100×100 SVG space) ──────────────────────
function head(skin: SkinKey) {
  const s = SKIN[skin] ?? SKIN.tan;
  return (
    <g>
      <path d="M44,68 L44,80 Q50,84 56,80 L56,68 Z" fill={s.shade} />
      <path d="M44,68 L44,80 Q50,84 56,80 L56,68 Q56,72 50,72 Q44,72 44,68 Z" fill={s.base} />
      <ellipse cx="50" cy="50" rx="20" ry="22" fill={s.base} />
      <path d="M30,52 Q30,68 44,72 L44,60 Q34,58 30,52 Z" fill={s.shade} opacity="0.85" />
      <ellipse cx="29" cy="52" rx="2.2" ry="3.4" fill={s.shade} />
    </g>
  );
}

function face(brow: BrowKey, expression: ExprKey) {
  const browL = {
    neutral: "M37,42 L43,42",
    stern: "M37,43 L43,41",
    tired: "M37,42 L43,43",
    wry: "M37,42 L43,41",
    smug: "M37,43 L43,42",
  }[brow];
  const browR = {
    neutral: "M57,42 L63,42",
    stern: "M57,41 L63,43",
    tired: "M57,43 L63,42",
    wry: "M57,42 L63,42",
    smug: "M57,42 L63,43",
  }[brow];
  const mouth = {
    neutral: "M46,62 Q50,63 54,62",
    smile: "M45,61 Q50,65 55,61",
    smirk: "M45,62 Q50,63 55,60",
    smirkR: "M45,60 Q50,63 55,62",
    frown: "M46,63 Q50,60 54,63",
    open: "M47,61 Q50,65 53,61",
  }[expression];
  return (
    <g stroke="#1a1208" strokeWidth="1.1" strokeLinecap="round" fill="none">
      <path d={browL} />
      <path d={browR} />
      <path d="M37,48 Q40,46 43,48 Q40,50 37,48 Z" fill="#1a1208" stroke="none" />
      <path d="M57,48 Q60,46 63,48 Q60,50 57,48 Z" fill="#1a1208" stroke="none" />
      <path d={mouth} />
    </g>
  );
}

type Shape = React.ReactElement;
const HAIR: Record<string, (c: string) => Shape> = {
  sweepBack: (c) => (
    <g fill={c}>
      <path d="M30,40 Q30,18 50,18 Q72,18 72,42 Q70,30 64,28 Q56,22 50,24 Q40,24 32,34 Z" />
    </g>
  ),
  parted: (c) => (
    <g fill={c}>
      <path d="M30,42 Q28,18 50,18 Q72,18 72,42 Q66,28 54,28 Q50,30 50,36 Q42,28 32,32 Z" />
    </g>
  ),
  short: (c) => (
    <g fill={c}>
      <path d="M32,38 Q32,22 50,22 Q70,22 70,38 Q62,30 50,30 Q38,30 32,38 Z" />
    </g>
  ),
  crew: (c) => (
    <g fill={c}>
      <path d="M34,36 Q34,28 50,28 Q66,28 66,36 Q60,32 50,32 Q40,32 34,36 Z" />
    </g>
  ),
  bun: (c) => (
    <g fill={c}>
      <path d="M32,40 Q32,22 50,22 Q70,22 70,40 Q64,30 50,30 Q36,30 32,40 Z" />
      <circle cx="50" cy="18" r="6" />
    </g>
  ),
  updo: (c) => (
    <g fill={c}>
      <path d="M30,38 Q26,20 50,18 Q72,16 72,40 Q60,28 50,30 Q42,28 30,38 Z" />
      <path d="M40,18 Q50,8 60,16 Q56,22 50,22 Q44,22 40,18 Z" />
    </g>
  ),
  long: (c) => (
    <g fill={c}>
      <path d="M22,86 Q22,18 50,18 Q78,18 78,86 Q74,40 70,34 Q60,30 50,32 Q40,30 30,34 Q26,40 22,86 Z" />
    </g>
  ),
  curly: (c) => (
    <g fill={c}>
      <ellipse cx="32" cy="34" rx="11" ry="12" />
      <ellipse cx="50" cy="24" rx="15" ry="11" />
      <ellipse cx="68" cy="34" rx="11" ry="12" />
      <ellipse cx="36" cy="44" rx="8" ry="6" />
      <ellipse cx="64" cy="44" rx="8" ry="6" />
    </g>
  ),
  child: (c) => (
    <g fill={c}>
      <path d="M30,40 Q30,22 50,22 Q70,22 70,40 Q66,38 50,38 Q34,38 30,40 Z" />
      <path d="M36,40 Q40,46 44,40 Z" />
    </g>
  ),
  wild: (c) => (
    <g fill={c}>
      <path d="M22,38 Q24,18 38,18 Q44,12 50,16 Q56,12 62,18 Q76,18 78,38 Q70,28 56,30 Q50,28 44,30 Q30,28 22,38 Z" />
    </g>
  ),
  spike: (c) => (
    <g fill={c}>
      <path d="M30,34 Q30,18 50,18 Q70,18 70,34 L66,30 L60,18 L54,28 L48,16 L42,28 L36,18 L30,30 Z" />
    </g>
  ),
};

const HAT = {
  cap: (band: string) => (
    <g>
      <path d="M22,30 Q22,16 50,16 Q78,16 78,30 L80,38 L20,38 Z" fill="#0e1014" />
      <rect x="20" y="34" width="60" height="5" fill={band} />
      <path d="M40,28 L50,22 L60,28 L60,30 L40,30 Z" fill={ACCENT.gilt} />
    </g>
  ),
  collar: () => <rect x="46" y="74" width="8" height="6" fill="#e2dccb" />,
};

const FX = {
  glasses: () => (
    <g fill="none" stroke="#0a0807" strokeWidth="1.3">
      <circle cx="40" cy="48" r="5.5" />
      <circle cx="60" cy="48" r="5.5" />
      <line x1="45.5" y1="48" x2="54.5" y2="48" />
      <line x1="34.5" y1="48" x2="30" y2="46" />
      <line x1="65.5" y1="48" x2="70" y2="46" />
    </g>
  ),
  scar: () => (
    <path d="M61,42 L65,55" stroke="#7a3a30" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  ),
  earringHoop: () => <circle cx="28.5" cy="54" r="1.6" fill="none" stroke={ACCENT.gilt} strokeWidth="1" />,
  pearls: () => (
    <g fill="#e6dccb">
      <circle cx="34" cy="74" r="1.5" />
      <circle cx="40" cy="76" r="1.5" />
      <circle cx="46" cy="77" r="1.5" />
      <circle cx="54" cy="77" r="1.5" />
      <circle cx="60" cy="76" r="1.5" />
      <circle cx="66" cy="74" r="1.5" />
    </g>
  ),
  pin: (c: string) => <circle cx="36" cy="86" r="1.6" fill={c} />,
  lanyard: () => (
    <g>
      <path d="M40,72 L36,100 L46,100 L46,80 Z" fill="#b0202a" />
      <rect x="38" y="92" width="14" height="6" fill="#e2dccb" stroke="#0a0807" strokeWidth="0.5" />
    </g>
  ),
};

const COAT = {
  suit: (primary: string, t = "#0a0807", shirt = "#e2dccb") => (
    <g>
      <path d="M14,100 L14,82 Q16,76 30,72 L50,82 L70,72 Q84,76 86,82 L86,100 Z" fill={primary} />
      <path d="M40,80 L50,98 L60,80 L50,84 Z" fill={shirt} />
      <path d="M47,82 L50,98 L53,82 L50,86 Z" fill={t} />
      <path d="M30,72 L42,82 L38,100" stroke="#0a0807" strokeWidth="0.7" fill="none" opacity="0.5" />
      <path d="M70,72 L58,82 L62,100" stroke="#0a0807" strokeWidth="0.7" fill="none" opacity="0.5" />
    </g>
  ),
  uniform: (primary: string) => (
    <g>
      <path d="M14,100 L14,82 Q16,76 30,72 L50,82 L70,72 Q84,76 86,82 L86,100 Z" fill={primary} />
      <line x1="50" y1="82" x2="50" y2="100" stroke={ACCENT.gilt} strokeWidth="1" />
      <circle cx="44" cy="86" r="1.4" fill={ACCENT.gilt} />
      <circle cx="44" cy="92" r="1.4" fill={ACCENT.gilt} />
      <circle cx="56" cy="86" r="1.4" fill={ACCENT.gilt} />
      <circle cx="56" cy="92" r="1.4" fill={ACCENT.gilt} />
      <rect x="32" y="84" width="3" height="4" fill={ACCENT.gilt} />
      <rect x="36" y="84" width="3" height="4" fill={ACCENT.crimson} />
      <rect x="32" y="89" width="3" height="4" fill={ACCENT.sage} />
      <rect x="36" y="89" width="3" height="4" fill={ACCENT.gilt} />
      <path d="M20,76 L28,72 L30,80 L22,84 Z" fill={ACCENT.gilt} />
      <path d="M80,76 L72,72 L70,80 L78,84 Z" fill={ACCENT.gilt} />
    </g>
  ),
  trench: () => (
    <g>
      <path d="M14,100 L14,82 Q16,76 30,72 L50,82 L70,72 Q84,76 86,82 L86,100 Z" fill={CLOTH.trench} />
      <path d="M30,72 L42,84 L40,100" stroke="#3a3424" strokeWidth="0.8" fill="none" />
      <path d="M70,72 L58,84 L60,100" stroke="#3a3424" strokeWidth="0.8" fill="none" />
      <path d="M42,80 L50,96 L58,80 L50,86 Z" fill="#3a3424" />
      <circle cx="46" cy="92" r="1.3" fill="#7a6a52" />
      <circle cx="54" cy="92" r="1.3" fill="#7a6a52" />
    </g>
  ),
  labCoat: () => (
    <g>
      <path d="M14,100 L14,82 Q16,76 30,72 L50,82 L70,72 Q84,76 86,82 L86,100 Z" fill="#dfd6c0" />
      <path d="M30,72 L44,84 L42,100" stroke="#b3a98a" strokeWidth="0.8" fill="none" />
      <path d="M70,72 L56,84 L58,100" stroke="#b3a98a" strokeWidth="0.8" fill="none" />
      <path d="M42,82 L50,96 L58,82 L50,86 Z" fill="#34433a" />
      <rect x="42" y="92" width="6" height="4" fill="#cfc6a8" />
    </g>
  ),
  hoodieBlazer: () => (
    <g>
      <path d="M14,100 L14,82 Q16,76 30,72 L50,82 L70,72 Q84,76 86,82 L86,100 Z" fill={CLOTH.charcoal} />
      <path d="M40,76 Q50,80 60,76 L62,86 Q50,90 38,86 Z" fill="#5a5246" />
    </g>
  ),
  childShirt: (c: string) => (
    <g>
      <path d="M18,100 L20,82 Q24,76 36,74 L50,80 L64,74 Q76,76 80,82 L82,100 Z" fill={c} />
      <path d="M50,80 L50,100" stroke="#1a1208" strokeWidth="0.5" opacity="0.4" />
    </g>
  ),
  loudShirt: () => (
    <g>
      <path d="M14,100 L14,82 Q16,76 30,72 L50,82 L70,72 Q84,76 86,82 L86,100 Z" fill="#7a2238" />
      <circle cx="30" cy="88" r="3" fill={ACCENT.gilt} />
      <circle cx="46" cy="92" r="3" fill={ACCENT.gilt} />
      <circle cx="62" cy="88" r="3" fill={ACCENT.gilt} />
      <circle cx="76" cy="94" r="3" fill={ACCENT.gilt} />
      <path d="M40,76 L50,82 L60,76 L60,82 L40,82 Z" fill="#5e1a2a" />
    </g>
  ),
  battle: () => (
    <g>
      <path d="M14,100 L14,82 Q16,76 30,72 L50,82 L70,72 Q84,76 86,82 L86,100 Z" fill="#3a3a24" />
      <path d="M30,72 L46,84 L46,100" stroke="#1f1f10" strokeWidth="0.8" fill="none" />
      <rect x="32" y="84" width="3" height="4" fill={ACCENT.crimson} />
      <rect x="36" y="84" width="3" height="4" fill={ACCENT.gilt} />
    </g>
  ),
};

interface CharacterConfig {
  skin: SkinKey;
  hair: { style: keyof typeof HAIR; color: HairColorKey };
  face: { brow: BrowKey; expression: ExprKey };
  coat: { kind: string; primary?: string; tie?: string; shirt?: string; color?: string };
  extras?: string[];
  hat?: { kind: "cap" | "collar"; band?: string };
}

// ── Character registry ──────────────────────────────────────────
const CHARACTERS: Record<PortraitKey, CharacterConfig> = {
  vance: {
    skin: "fair",
    hair: { style: "sweepBack", color: "silver" },
    face: { brow: "tired", expression: "smirk" },
    coat: { kind: "suit", primary: CLOTH.charcoal, tie: ACCENT.crimson },
    extras: ["pin"],
  },
  delacroix: {
    skin: "light",
    hair: { style: "long", color: "brown" },
    face: { brow: "wry", expression: "smirk" },
    coat: { kind: "trench" },
    extras: ["earringHoop"],
  },
  kano: {
    skin: "tan",
    hair: { style: "crew", color: "grey" },
    face: { brow: "stern", expression: "neutral" },
    coat: { kind: "uniform", primary: CLOTH.olive },
    hat: { kind: "cap", band: "#2a2a18" },
  },
  okafor: {
    skin: "brown",
    hair: { style: "parted", color: "black" },
    face: { brow: "smug", expression: "smile" },
    coat: { kind: "suit", primary: CLOTH.navy, tie: "#7a1a22" },
    extras: ["pin"],
  },
  thorne: {
    skin: "fair",
    hair: { style: "short", color: "blonde" },
    face: { brow: "smug", expression: "smirk" },
    coat: { kind: "suit", primary: "#2a221a", tie: ACCENT.gilt },
  },
  halverson: {
    skin: "fair",
    hair: { style: "updo", color: "grey" },
    face: { brow: "tired", expression: "neutral" },
    coat: { kind: "labCoat" },
    extras: ["glasses"],
  },
  ren: {
    skin: "light",
    hair: { style: "long", color: "black" },
    face: { brow: "neutral", expression: "smirkR" },
    coat: { kind: "suit", primary: "#1a1620", tie: "#7a1a22" },
  },
  boy: {
    skin: "light",
    hair: { style: "child", color: "brown" },
    face: { brow: "neutral", expression: "open" },
    coat: { kind: "childShirt", color: "#a86c2a" },
  },
  voss: {
    skin: "fair",
    hair: { style: "bun", color: "brown" },
    face: { brow: "stern", expression: "frown" },
    coat: { kind: "suit", primary: "#1a1a22", tie: "#1a1a22", shirt: "#e2dccb" },
    extras: ["glasses"],
  },
  mott: {
    skin: "fair",
    hair: { style: "sweepBack", color: "grey" },
    face: { brow: "neutral", expression: "smile" },
    coat: { kind: "suit", primary: CLOTH.ink, tie: CLOTH.ink, shirt: CLOTH.ink },
    hat: { kind: "collar" },
  },
  shah: {
    skin: "brown",
    hair: { style: "curly", color: "black" },
    face: { brow: "tired", expression: "open" },
    coat: { kind: "suit", primary: "#2a2632", tie: "#2a2632", shirt: "#e2dccb" },
    extras: ["lanyard"],
  },
  solberg: {
    skin: "light",
    hair: { style: "wild", color: "brown" },
    face: { brow: "neutral", expression: "neutral" },
    coat: { kind: "suit", primary: "#3a3024", tie: "#5e3a26", shirt: "#cfc6a8" },
    extras: ["glasses"],
  },
  greer: {
    skin: "tan",
    hair: { style: "spike", color: "red" },
    face: { brow: "smug", expression: "smile" },
    coat: { kind: "loudShirt" },
  },
  voro: {
    skin: "tan",
    hair: { style: "crew", color: "dark" },
    face: { brow: "stern", expression: "frown" },
    coat: { kind: "battle" },
    extras: ["scar"],
  },
  sandoval: {
    skin: "tan",
    hair: { style: "curly", color: "brown" },
    face: { brow: "neutral", expression: "neutral" },
    coat: { kind: "suit", primary: "#3a3a3e", tie: "#5a4626", shirt: "#e2dccb" },
  },
  karim: {
    skin: "deep",
    hair: { style: "parted", color: "black" },
    face: { brow: "tired", expression: "frown" },
    coat: { kind: "suit", primary: "#2a3038", tie: "#2a3038", shirt: "#e2dccb" },
  },
  park: {
    skin: "light",
    hair: { style: "short", color: "black" },
    face: { brow: "wry", expression: "smirk" },
    coat: { kind: "hoodieBlazer" },
  },
  vos: {
    skin: "fair",
    hair: { style: "updo", color: "silver" },
    face: { brow: "smug", expression: "smile" },
    coat: { kind: "suit", primary: "#241a1e", tie: "#241a1e", shirt: "#e2dccb" },
    extras: ["pearls"],
  },
  // --- Auditor, civil-liberties counsel, and single-figure stands-in for the collective cards ---
  calderon: {
    skin: "light",
    hair: { style: "bun", color: "dark" },
    face: { brow: "stern", expression: "neutral" },
    coat: { kind: "suit", primary: CLOTH.charcoal, tie: CLOTH.charcoal, shirt: "#e2dccb" },
    extras: ["glasses"],
  },
  frye: {
    skin: "tan",
    hair: { style: "long", color: "black" },
    face: { brow: "stern", expression: "neutral" },
    coat: { kind: "suit", primary: CLOTH.violet, tie: "#2a2238", shirt: "#e2dccb" },
  },
  garrison: {
    skin: "light",
    hair: { style: "crew", color: "dark" },
    face: { brow: "stern", expression: "frown" },
    coat: { kind: "uniform", primary: CLOTH.steel },
    hat: { kind: "cap", band: "#2a2a18" },
  },
  press: {
    skin: "light",
    hair: { style: "short", color: "brown" },
    face: { brow: "tired", expression: "frown" },
    coat: { kind: "suit", primary: CLOTH.charcoal, tie: "#3a4250", shirt: "#e2dccb" },
    extras: ["lanyard"],
  },
  square: {
    skin: "tan",
    hair: { style: "curly", color: "dark" },
    face: { brow: "stern", expression: "open" },
    coat: { kind: "hoodieBlazer" },
  },
};

/** Stable hash of a key → hue 0..360, so each character gets a distinct disc tint. */
export function pickDiscHue(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) & 0xffff;
  return h % 360;
}

/** Compose a character's full portrait as an SVG group, or null if the key is unknown. */
export function buildPortrait(imageKey: PortraitKey): Shape | null {
  const c = CHARACTERS[imageKey];
  if (!c) return null;
  const hairColor = HAIR_C[c.hair.color];
  const extras = c.extras ?? [];
  return (
    <g>
      <ellipse cx="50" cy="80" rx="42" ry="22" fill="#2a1f12" opacity="0.55" />

      {c.coat.kind === "suit" && COAT.suit(c.coat.primary ?? CLOTH.charcoal, c.coat.tie, c.coat.shirt ?? "#e2dccb")}
      {c.coat.kind === "uniform" && COAT.uniform(c.coat.primary ?? CLOTH.olive)}
      {c.coat.kind === "trench" && COAT.trench()}
      {c.coat.kind === "labCoat" && COAT.labCoat()}
      {c.coat.kind === "hoodieBlazer" && COAT.hoodieBlazer()}
      {c.coat.kind === "childShirt" && COAT.childShirt(c.coat.color ?? "#a86c2a")}
      {c.coat.kind === "loudShirt" && COAT.loudShirt()}
      {c.coat.kind === "battle" && COAT.battle()}

      {c.hat?.kind === "collar" && HAT.collar()}

      {head(c.skin)}
      {face(c.face.brow, c.face.expression)}

      {extras.includes("scar") && FX.scar()}
      {extras.includes("earringHoop") && FX.earringHoop()}
      {extras.includes("pearls") && FX.pearls()}
      {extras.includes("lanyard") && FX.lanyard()}
      {extras.includes("pin") && FX.pin(ACCENT.crimson)}
      {extras.includes("glasses") && FX.glasses()}

      {HAIR[c.hair.style]?.(hairColor)}

      {c.hat?.kind === "cap" && HAT.cap(c.hat.band ?? "#1a1d24")}

      <path d="M70,72 Q78,76 84,90 L84,100 L72,100 Z" fill={ACCENT.gilt} opacity="0.07" />
      <ellipse cx="64" cy="46" rx="8" ry="14" fill={ACCENT.gilt} opacity="0.05" />
    </g>
  );
}

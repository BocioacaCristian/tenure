import type { Card } from "../types";
import { SHIELD_FLAG } from "../engine/game";

/**
 * The card deck as data. The engine reads from this array and hard-codes no situations, so adding
 * content means adding an object here. `effect` shifts resources by roughly 2 to 12 points. Some
 * choices set `flags` and `unlocks` follow-up cards to form event chains; a `condition` keeps a
 * card from appearing until the right moment. Each portrait is a gradient disc (`hue`) carrying a
 * gold role `icon` (see PortraitIcons).
 */
export const DECK: Card[] = [
  {
    id: "vance",
    name: "Arthur Vance",
    role: "Chief of Staff",
    portrait: { hue: 28, icon: "scroll" },
    prompt: "The surveillance bill is on your desk. Half the cabinet wants it signed by midnight.",
    left: { label: "Veto it", effect: { approval: +8, military: -6, media: +4 } },
    right: { label: "Sign it", effect: { approval: -6, military: +9, media: -5 } },
  },
  {
    id: "delacroix",
    name: "Marielle Delacroix",
    role: "Senior Correspondent",
    portrait: { hue: 350, icon: "microphone" },
    prompt: "I have the leaked memo. I run it tonight — unless you give me something better, on the record.",
    left: { label: "Stay silent", effect: { media: -10, approval: -4 } },
    right: { label: "Hand her a story", effect: { media: +8, treasury: -3, approval: -2 } },
  },
  {
    id: "kano",
    name: "Gen. Kano Ito",
    role: "Joint Chiefs",
    portrait: { hue: 210, icon: "stars" },
    prompt: "The border province has gone dark. I can move a battalion in by dawn — quietly.",
    left: { label: "Hold the line", effect: { military: -7, approval: +3 } },
    right: {
      label: "Send them in",
      effect: { military: +8, treasury: -6, media: -4 },
      setFlags: ["war"],
      unlocks: ["war-escalates"],
    },
  },
  {
    id: "okafor",
    name: "Senator Okafor",
    role: "Opposition Whip",
    portrait: { hue: 280, icon: "gavel" },
    prompt: "Block the appointments and I deliver the rural vote. You'll need both, eventually.",
    left: { label: "Refuse", effect: { approval: -5, media: +5 } },
    right: { label: "Quiet deal", effect: { approval: +9, media: -7, military: -2 } },
  },
  {
    id: "thorne",
    name: "Walter Thorne",
    role: "Lobbyist, Energy Trust",
    portrait: { hue: 42, icon: "lightning" },
    prompt: "A modest amendment. Nobody reads page 412. The Trust would be... appreciative.",
    left: { label: "Show him out", effect: { treasury: -6, approval: +5, media: +3 } },
    right: { label: "Slip it in", effect: { treasury: +12, approval: -5, media: -6 } },
  },
  {
    id: "halverson",
    name: "Dr. Elin Halverson",
    role: "National Health Director",
    portrait: { hue: 160, icon: "cross" },
    prompt:
      "The outbreak is contained — for now. A nationwide advisory would calm the public. Or panic them.",
    left: { label: "Stay quiet", effect: { approval: +4, treasury: +2, media: -6 } },
    right: { label: "Go public", effect: { approval: -3, treasury: -7, media: +8 } },
  },
  {
    id: "ren",
    name: "Lin Ren",
    role: "Ambassador, Eastern Bloc",
    portrait: { hue: 0, icon: "oliveBranch" },
    prompt: "A trade pact. Generous terms. The general staff will, of course, hate it.",
    left: { label: "Decline", effect: { treasury: -6, military: +6 } },
    right: { label: "Sign", effect: { treasury: +10, military: -8, approval: +2 } },
  },
  {
    id: "boy",
    name: "A small boy",
    role: "Letter-writer, age 9",
    portrait: { hue: 50, icon: "paperPlane" },
    prompt: "Dear President — please make my dad come home from the war. I drew you a picture.",
    left: { label: "A polite reply", effect: { approval: -2, media: -3 } },
    right: { label: "Bring him home", effect: { approval: +10, military: -8, media: +6 } },
  },
  {
    id: "treasury",
    name: "Hanna Voss",
    role: "Treasury Secretary",
    portrait: { hue: 90, icon: "scales" },
    prompt: "We can cut the public payroll — or raise the tariff. Either way, someone is screaming by Friday.",
    left: { label: "Cut payroll", effect: { treasury: +9, approval: -8, media: -3 } },
    right: { label: "Raise tariff", effect: { treasury: +6, approval: -3, military: -2, media: -4 } },
  },
  {
    id: "preacher",
    name: "Rev. Caleb Mott",
    role: "Faith Coalition",
    portrait: { hue: 20, icon: "openBook" },
    prompt: "Bless our cause from the podium, Mr. President. The faithful are watching.",
    left: { label: "Keep distance", effect: { approval: -6, media: +5 } },
    right: { label: "Bless it", effect: { approval: +8, media: -6, treasury: -2 } },
  },
  {
    id: "intern",
    name: "Priya Shah",
    role: "Comms Intern",
    portrait: { hue: 320, icon: "envelope" },
    prompt: "There's an, um, photo. Of you. From years ago. I can bury it or… get ahead of it?",
    left: {
      label: "Bury it",
      effect: { media: -8, treasury: -4 },
      setFlags: ["coverup"],
      unlocks: ["tabloid"],
    },
    right: { label: "Get ahead of it", effect: { media: +6, approval: -5 } },
  },
  {
    id: "scientist",
    name: "Dr. Ari Solberg",
    role: "Chief Climate Advisor",
    portrait: { hue: 190, icon: "leaf" },
    prompt: "Open the strategic reserves now and we cool the markets. Save them and we cool the planet.",
    left: { label: "Save reserves", effect: { treasury: -5, approval: -4, media: +6 } },
    right: { label: "Open them", effect: { treasury: +8, approval: +5, media: -6 } },
  },

  // --- Chain: the photo scandal (follow-up to "intern" → "Bury it") ---
  {
    id: "tabloid",
    name: "Casey Greer",
    role: "Tabloid Editor",
    portrait: { hue: 330, icon: "microphone" },
    prompt: "That photo you buried? We have a copy. Front page tomorrow — unless we come to terms.",
    once: true,
    condition: { flags: ["coverup"] },
    left: { label: "Threaten to sue", effect: { media: -10, approval: -4 } },
    right: { label: "Pay for silence", effect: { treasury: -12, media: +2 } },
  },

  // --- Chain: the border war (follow-up to "kano" → "Send them in") ---
  {
    id: "war-escalates",
    name: "Field Marshal Voro",
    role: "Field Marshal",
    portrait: { hue: 215, icon: "stars" },
    prompt: "The skirmish is now a front. Commit the reserves, or pull our people back?",
    once: true,
    condition: { flags: ["war"] },
    left: { label: "Pull back", effect: { military: -12, approval: +6, media: +4 } },
    right: {
      label: "Commit reserves",
      effect: { military: +8, treasury: -10, approval: -6 },
      unlocks: ["war-ends"],
    },
  },
  {
    id: "war-ends",
    name: "Mira Sandoval",
    role: "Special Envoy",
    portrait: { hue: 170, icon: "oliveBranch" },
    prompt: "A ceasefire is on the table. Sign it — or press the advantage while we have it?",
    once: true,
    condition: { flags: ["war"] },
    left: { label: "Press on", effect: { military: +5, treasury: -8, media: -5 } },
    right: { label: "Sign the ceasefire", effect: { approval: +10, media: +8, military: -5 } },
  },

  // --- Conditional cards (surface only in the right circumstances) ---
  {
    id: "insolvency",
    name: "Yusuf Karim",
    role: "Emergency Treasury",
    portrait: { hue: 100, icon: "scales" },
    prompt: "We are insolvent, Mr. President. Austerity now — or an emergency bond issue?",
    condition: { resources: { treasury: { max: 24 } } },
    left: { label: "Impose austerity", effect: { approval: -12, treasury: +10 } },
    right: { label: "Issue bonds", effect: { treasury: +18, media: -6 } },
  },
  {
    id: "emergency-powers",
    name: "Quinn Park",
    role: "Pollster",
    portrait: { hue: 250, icon: "chartBars" },
    prompt: "Approval is historic. Seize emergency powers now, while the public would cheer it?",
    condition: { resources: { approval: { min: 80 } } },
    left: { label: "Resist the urge", effect: { approval: -4, media: +5 } },
    right: { label: "Seize them", effect: { military: +10, media: -10, approval: -5 } },
  },

  // --- Status effect: the contingency fund (one-time shield) ---
  {
    id: "contingency",
    name: "Sen. Galena Vos",
    role: "Party Elder",
    portrait: { hue: 30, icon: "openBook" },
    prompt: "Let me set aside a quiet contingency fund. Every president needs one rainy day covered.",
    once: true,
    condition: { notFlags: [SHIELD_FLAG] },
    left: { label: "We won't need it", effect: { approval: +4 } },
    right: { label: "Set it aside", effect: { treasury: -12 }, setFlags: [SHIELD_FLAG] },
  },
];

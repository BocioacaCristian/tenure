/** The available gold line-art role icons drawn on a portrait disc. */
export type PortraitIcon =
  | "scroll"
  | "microphone"
  | "stars"
  | "gavel"
  | "lightning"
  | "cross"
  | "oliveBranch"
  | "envelope"
  | "paperPlane"
  | "scales"
  | "openBook"
  | "leaf"
  | "chartBars";

/** Look of a card's portrait: a gradient disc tinted by `hue` carrying a gold role `icon`. */
export interface PortraitStyle {
  /** Base hue (0–360) for the portrait gradient disc. */
  hue: number;
  /** Which gold line-art role icon to draw on the disc. */
  icon: PortraitIcon;
}

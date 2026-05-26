/** Keys identifying each character's flat-vector portrait (see PortraitArt). */
export type PortraitKey =
  | "vance"
  | "delacroix"
  | "kano"
  | "okafor"
  | "thorne"
  | "halverson"
  | "ren"
  | "boy"
  | "voss"
  | "mott"
  | "shah"
  | "solberg"
  | "greer"
  | "voro"
  | "sandoval"
  | "karim"
  | "park"
  | "vos"
  | "calderon"
  | "frye"
  | "garrison"
  | "press"
  | "square";

/** A card's portrait: which character's flat-vector face to draw on the disc. */
export interface PortraitStyle {
  /** The character whose composed portrait this card shows. */
  imageKey: PortraitKey;
}

import * as React from "react";
import type { Resource } from "../../types";

/**
 * Inline SVG glyphs for each resource, on a 24×24 grid, inheriting `currentColor`. Shared style:
 * stroke 1.7, round caps/joins. Each glyph is concrete (a crowd, a coin stack, a shield, a mic) so
 * it reads instantly at HUD size.
 */
export const RESOURCE_ICON: Record<Resource, React.ReactElement> = {
  // Approval — a three-figure crowd reads as "public support".
  approval: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="2.6" />
      <path d="M6.5 21 C 6.5 17.5, 9 16, 12 16 S 17.5 17.5, 17.5 21" />
      <circle cx="5.2" cy="9" r="2" />
      <path d="M1.5 18.5 C 1.5 15.8, 3 14.6, 5.2 14.6" />
      <circle cx="18.8" cy="9" r="2" />
      <path d="M22.5 18.5 C 22.5 15.8, 21 14.6, 18.8 14.6" />
    </svg>
  ),
  // Treasury — a stack of three coins.
  treasury: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="6" rx="7" ry="2.4" />
      <path d="M5 6   V8.6  C5 9.9 8.1 11 12 11 S 19 9.9 19 8.6 V6" />
      <path d="M5 11.4 V14 C5 15.3 8.1 16.4 12 16.4 S 19 15.3 19 14 V11.4" />
      <path d="M5 16.8 V19.4 C5 20.7 8.1 21.8 12 21.8 S 19 20.7 19 19.4 V16.8" />
    </svg>
  ),
  // Military — a shield with a rank chevron.
  military: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.6 L20 5.4 V12 C20 16.6 16.6 19.8 12 21.4 C7.4 19.8 4 16.6 4 12 V5.4 Z" />
      <path d="M7.5 13 L12 9 L16.5 13" />
      <path d="M7.5 17 L12 13 L16.5 17" />
    </svg>
  ),
  // Media — a broadcast microphone.
  media: (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2.5" width="6" height="12" rx="3" />
      <path d="M5 11 V12.5 C5 16.1 8.1 19 12 19 S 19 16.1 19 12.5 V11" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8.5" y1="22" x2="15.5" y2="22" />
    </svg>
  ),
};

import * as React from "react";
import type { Resource } from "../../types";

/** Inline SVG glyphs for each resource, on a 24×24 grid, inheriting `currentColor`. */
export const RESOURCE_ICON: Record<Resource, React.ReactElement> = {
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
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="16.5" cy="9" r="2.4" />
      <path d="M14 19c0-2 1.5-3.5 3-3.5s3 1 3.5 2.5" />
    </svg>
  ),
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
      <path d="M4 9 L12 4 L20 9" />
      <path d="M5.5 9.5 V17" />
      <path d="M10 9.5 V17" />
      <path d="M14 9.5 V17" />
      <path d="M18.5 9.5 V17" />
      <path d="M3.5 19.5 H20.5" />
    </svg>
  ),
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
      <path d="M12 3 L19 6 V12 C19 16.5 15.5 19.5 12 21 C8.5 19.5 5 16.5 5 12 V6 Z" />
      <path d="M9 11 L11.2 13.2 L15 9" />
    </svg>
  ),
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
      <path d="M3 6 H17 V18 H5 A2 2 0 0 1 3 16 Z" />
      <path d="M17 9 H20 V16 A2 2 0 0 1 18 18 H17" />
      <path d="M6 9 H11 V13 H6 Z" />
      <path d="M13 9 H15 M13 11 H15 M6 15 H15" />
    </svg>
  ),
};

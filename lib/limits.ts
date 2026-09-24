/**
 * Limits shared by the UI and the API route. Client-safe: no secrets here.
 */

/** Maximum length of the notes a rep can submit, in characters. */
export const MAX_NOTES_LENGTH = 4000;

/** Maximum size of an incoming request body, in bytes. */
export const MAX_BODY_BYTES = 16 * 1024;

/** Maximum tokens the model may generate for a single extraction. */
export const MAX_OUTPUT_TOKENS = 1024;

/** Per-client request budget within a rolling window. */
export const PER_IP_LIMIT = 8;
export const PER_IP_WINDOW_MS = 60_000;

/** Whole-instance budget, a backstop against distributed abuse. */
export const GLOBAL_LIMIT = 120;
export const GLOBAL_WINDOW_MS = 60_000;

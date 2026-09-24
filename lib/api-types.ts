import type { LeadExtraction } from "./schema";

/** Why an extraction attempt failed. */
export type ExtractErrorKind =
  | "empty" // the rep pressed Extract with nothing in the textarea
  | "invalid_request" // the request body was missing or malformed
  | "validation" // the model returned something that failed schema validation
  | "upstream"; // the model call itself failed (network, rate limit, etc.)

export interface ExtractRequestBody {
  /** The rep's raw call notes. */
  notes: string;
}

/** The error payload shared by every failure mode. */
export interface ExtractError {
  kind: ExtractErrorKind;
  message: string;
  /** Raw model text, present only when `kind` is `validation`. */
  raw: string | null;
}

export interface ExtractSuccessResponse {
  data: LeadExtraction;
}

export interface ExtractErrorResponse extends ExtractError {
  error: true;
}

export type ExtractResponse = ExtractSuccessResponse | ExtractErrorResponse;

export function isExtractErrorResponse(
  value: ExtractResponse,
): value is ExtractErrorResponse {
  return "error" in value && value.error === true;
}

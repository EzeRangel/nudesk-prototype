import { NextResponse } from "next/server";

import type { ExtractErrorKind, ExtractErrorResponse } from "@/lib/api-types";
import { extractLead } from "@/lib/extract-lead";
import {
  GLOBAL_LIMIT,
  GLOBAL_WINDOW_MS,
  MAX_BODY_BYTES,
  MAX_NOTES_LENGTH,
  PER_IP_LIMIT,
  PER_IP_WINDOW_MS,
} from "@/lib/limits";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limits come first so abusive traffic never reaches the model.
  const perIp = checkRateLimit(
    `ip:${getClientIp(request)}`,
    PER_IP_LIMIT,
    PER_IP_WINDOW_MS,
  );
  if (!perIp.allowed) {
    return errorResponse(
      "rate_limited",
      429,
      "Too many requests from this client. Please wait a moment.",
      null,
      perIp.retryAfterSeconds,
    );
  }

  const global = checkRateLimit("global", GLOBAL_LIMIT, GLOBAL_WINDOW_MS);
  if (!global.allowed) {
    return errorResponse(
      "rate_limited",
      429,
      "The service is busy right now. Please try again shortly.",
      null,
      global.retryAfterSeconds,
    );
  }

  const rawBody = await request.text();
  if (byteLength(rawBody) > MAX_BODY_BYTES) {
    return errorResponse(
      "payload_too_large",
      413,
      "The request body is too large.",
      null,
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse(
      "invalid_request",
      400,
      "The request body must be valid JSON.",
      null,
    );
  }

  const notes =
    typeof body === "object" &&
    body !== null &&
    "notes" in body &&
    typeof (body as { notes: unknown }).notes === "string"
      ? (body as { notes: string }).notes
      : null;

  if (notes === null) {
    return errorResponse(
      "invalid_request",
      400,
      "The request must include a string `notes` field.",
      null,
    );
  }
  if (notes.trim() === "") {
    return errorResponse("empty", 400, "Add some notes before extracting.", null);
  }
  if (notes.length > MAX_NOTES_LENGTH) {
    return errorResponse(
      "too_long",
      422,
      `Notes are limited to ${MAX_NOTES_LENGTH} characters.`,
      null,
    );
  }

  const result = await extractLead(notes);

  if (result.ok) {
    return NextResponse.json({ data: result.data });
  }
  if (result.kind === "validation") {
    return errorResponse(
      "validation",
      422,
      "The model's response didn't match the expected shape.",
      result.raw,
    );
  }

  return errorResponse(
    "upstream",
    502,
    "The model call failed. Please try again.",
    null,
  );
}

/** The originating client IP, as set by the platform's proxy. */
function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const first = forwardedFor?.split(",")[0]?.trim();
  if (first) return first;
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

function errorResponse(
  kind: ExtractErrorKind,
  status: number,
  message: string,
  raw: string | null,
  retryAfterSeconds?: number,
) {
  const response = NextResponse.json<ExtractErrorResponse>(
    { error: true, kind, message, raw },
    { status },
  );
  if (retryAfterSeconds !== undefined) {
    response.headers.set("Retry-After", String(retryAfterSeconds));
  }
  return response;
}

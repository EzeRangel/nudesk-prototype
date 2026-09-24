import { NextResponse } from "next/server";

import type { ExtractErrorKind, ExtractErrorResponse } from "@/lib/api-types";
import { extractLead } from "@/lib/extract-lead";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
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

function errorResponse(
  kind: ExtractErrorKind,
  status: number,
  message: string,
  raw: string | null,
) {
  return NextResponse.json<ExtractErrorResponse>(
    { error: true, kind, message, raw },
    { status },
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ExtractionPanel } from "@/components/extraction-panel";
import type { ExtractionStatus } from "@/components/extraction-panel";
import { NotesInput } from "@/components/notes-input";
import {
  isExtractErrorResponse,
  type ExtractError,
  type ExtractResponse,
} from "@/lib/api-types";
import type { LeadExtraction } from "@/lib/schema";

export function NotesToCrm() {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ExtractionStatus>("idle");
  const [extraction, setExtraction] = useState<LeadExtraction | null>(null);
  const [error, setError] = useState<ExtractError | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [emptyNotice, setEmptyNotice] = useState(false);

  const isLoading = status === "loading";

  function handleNotesChange(next: string) {
    setNotes(next);
    if (emptyNotice) setEmptyNotice(false);
  }

  async function handleExtract() {
    if (notes.trim() === "") {
      setEmptyNotice(true);
      return;
    }

    setEmptyNotice(false);
    setConfirmed(false);
    setError(null);
    setExtraction(null);
    setStatus("loading");

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const payload = (await response.json()) as ExtractResponse;

      if (isExtractErrorResponse(payload)) {
        setError({
          kind: payload.kind,
          message: payload.message,
          raw: payload.raw,
        });
        setStatus("error");
        return;
      }

      setExtraction(payload.data);
      setStatus("success");
    } catch {
      setError({
        kind: "upstream",
        message: "Couldn't reach the server. Please try again.",
        raw: null,
      });
      setStatus("error");
    }
  }

  function handleClear() {
    setNotes("");
    setExtraction(null);
    setError(null);
    setConfirmed(false);
    setEmptyNotice(false);
    setStatus("idle");
  }

  function handleConfirm() {
    setConfirmed(true);
    toast.success("Extraction confirmed", {
      description:
        "Nothing was sent to a CRM — copy the JSON when you need it.",
    });
  }

  return (
    <div className="grid flex-1 items-start gap-6 md:grid-cols-2">
      <NotesInput
        notes={notes}
        onNotesChange={handleNotesChange}
        onExtract={handleExtract}
        onClear={handleClear}
        isLoading={isLoading}
        notice={emptyNotice}
      />
      <ExtractionPanel
        status={status}
        extraction={extraction}
        error={error}
        confirmed={confirmed}
        onExtractionChange={setExtraction}
        onConfirm={handleConfirm}
        onEditAgain={() => setConfirmed(false)}
      />
    </div>
  );
}

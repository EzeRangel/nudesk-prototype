"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ExtractionPanel } from "@/components/extraction-panel";
import type { ExtractionStatus } from "@/components/extraction-panel";
import { NotesInput } from "@/components/notes-input";
import type { ExtractError } from "@/lib/api-types";
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
      const next = await mockExtract();
      setExtraction(next);
      setStatus("success");
    } catch {
      setError({
        kind: "upstream",
        message: "Something went wrong while extracting. Please try again.",
        raw: null,
      });
      setStatus("error");
    }
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

/**
 * PHASE 1 MOCK — replaced by a POST /api/extract call in phase 2.
 * Returns a fixed extraction so the UI can be built and reviewed without a key.
 */
const MOCK_EXTRACTION: LeadExtraction = {
  clientName: "John Smith",
  company: "Acme Corp",
  budget: null,
  timeline: "~2 weeks",
  isDecisionMaker: false,
  objections: ["Price", "Already comparing with another tool"],
  competitors: ["Zendesk"],
  riskLevel: "medium",
  nextAction: null,
};

function mockExtract(): Promise<LeadExtraction> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(MOCK_EXTRACTION)), 700);
  });
}

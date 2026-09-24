"use client";

import { useState } from "react";
import {
  CheckIcon,
  ClipboardIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtractionForm } from "@/components/extraction-form";
import { RawJsonView } from "@/components/raw-json-view";
import type { ExtractError } from "@/lib/api-types";
import type { LeadExtraction } from "@/lib/schema";

export type ExtractionStatus = "idle" | "loading" | "success" | "error";

interface ExtractionPanelProps {
  status: ExtractionStatus;
  extraction: LeadExtraction | null;
  error: ExtractError | null;
  confirmed: boolean;
  onExtractionChange: (next: LeadExtraction) => void;
  onConfirm: () => void;
  onEditAgain: () => void;
}

export function ExtractionPanel({
  status,
  extraction,
  error,
  confirmed,
  onExtractionChange,
  onConfirm,
  onEditAgain,
}: ExtractionPanelProps) {
  const [showRawJson, setShowRawJson] = useState(false);
  const hasResult = status === "success" && extraction !== null;

  async function handleCopy() {
    if (!extraction) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(extraction, null, 2));
      toast.success("JSON copied to clipboard");
    } catch {
      toast.error("Couldn't copy — the browser blocked clipboard access.");
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Extraction</CardTitle>
          {hasResult && (
            <Badge variant={confirmed ? "default" : "secondary"}>
              {confirmed ? "Confirmed" : "Draft"}
            </Badge>
          )}
        </div>
        <CardDescription>
          Review and edit every field — nothing is final until you confirm it.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {status === "idle" && <IdleState />}
        {status === "loading" && <LoadingState />}
        {status === "error" && error && <ErrorState error={error} />}
        {hasResult && extraction && (
          <div className="grid gap-4">
            <ExtractionForm
              value={extraction}
              onChange={onExtractionChange}
              disabled={confirmed}
            />
            {showRawJson && (
              <div className="grid gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Raw JSON (current values)
                </p>
                <RawJsonView value={extraction} />
              </div>
            )}
          </div>
        )}
      </CardContent>

      {hasResult && extraction && (
        <CardFooter className="flex-col items-stretch gap-3">
          {confirmed && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-background px-3 py-2 text-xs text-muted-foreground ring-1 ring-foreground/10">
              <span>Confirmed — not sent to any CRM. Copying is manual.</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEditAgain}
              >
                <PencilIcon data-icon="inline-start" />
                Edit again
              </Button>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRawJson((current) => !current)}
            >
              {showRawJson ? (
                <EyeOffIcon data-icon="inline-start" />
              ) : (
                <EyeIcon data-icon="inline-start" />
              )}
              {showRawJson ? "Hide raw JSON" : "View raw JSON"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              <ClipboardIcon data-icon="inline-start" />
              Copy JSON
            </Button>
            {!confirmed && (
              <Button
                type="button"
                size="sm"
                onClick={onConfirm}
                className="sm:ml-auto"
              >
                <CheckIcon data-icon="inline-start" />
                Confirm
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

function IdleState() {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed p-6 text-center">
      <SparklesIcon className="size-5 text-muted-foreground" />
      <p className="text-sm font-medium">Nothing extracted yet</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Paste your notes and hit Extract — the structured fields will show up
        here.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-live="polite">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error }: { error: ExtractError }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Couldn&apos;t extract the notes</AlertTitle>
      <AlertDescription>
        <p>{error.message}</p>
        {error.raw && (
          <div className="mt-3 grid gap-1">
            <p className="text-xs font-medium text-foreground">
              Raw model output
            </p>
            <pre className="max-h-48 overflow-auto rounded-md border bg-background p-2 font-mono text-xs whitespace-pre-wrap">
              {error.raw}
            </pre>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

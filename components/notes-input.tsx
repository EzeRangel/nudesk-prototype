import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PRESETS } from "@/lib/presets";

interface NotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onExtract: () => void;
  isLoading: boolean;
}

export function NotesInput({
  notes,
  onNotesChange,
  onExtract,
  isLoading,
}: NotesInputProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Call notes</CardTitle>
        <CardDescription>
          Paste the raw notes from your call — typos, shorthand and all.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <Textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="e.g. call w/ john from acme, keen but price is a worry, decides in ~2 wks..."
          aria-label="Call notes"
          className="min-h-56 flex-1 resize-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try an example:</span>
          {PRESETS.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onNotesChange(preset.notes)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          onClick={onExtract}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <SparklesIcon data-icon="inline-start" />
          {isLoading ? "Extracting…" : "Extract"}
        </Button>
      </CardFooter>
    </Card>
  );
}

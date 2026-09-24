import type { LeadExtraction } from "@/lib/schema";

export function RawJsonView({ value }: { value: LeadExtraction }) {
  return (
    <pre className="max-h-80 overflow-auto rounded-md border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

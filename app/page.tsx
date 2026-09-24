import { NotesToCrm } from "@/components/notes-to-crm";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
      <header className="grid gap-1">
        <h1 className="font-heading text-2xl tracking-tight">Notes → CRM</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Paste your messy call notes. The fields are extracted for you, and you
          review and edit them before anything leaves this page.
        </p>
      </header>
      <NotesToCrm />
      <footer className="mt-auto grid gap-1 border-t pt-4 text-xs text-muted-foreground">
        <p>
          Demo only — nothing is sent to a CRM. Extractions are reviewed and
          edited by a human before use.
        </p>
        <p>
          Structured extraction powered by Gemini 3.5 Flash via the Vercel AI
          SDK.
        </p>
      </footer>
    </main>
  );
}

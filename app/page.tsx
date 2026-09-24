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
    </main>
  );
}

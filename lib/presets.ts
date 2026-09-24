/**
 * Canned, deliberately messy notes used for one-click demos.
 *
 * Each preset carries typos, shorthand, and at least one field that is missing
 * from the notes (so the `null` behaviour is visible). One of them mixes Spanish
 * and English, which is how some reps actually write.
 */
export interface Preset {
  id: string;
  label: string;
  notes: string;
}

export const PRESETS: Preset[] = [
  {
    id: "acme",
    label: "Example 1",
    notes:
      "called john smith from acme corp, super interested but worried abt price, says he's comparing w/ another similar tool (maybe Zendesk?), budget not confirmed yet, decides in ~2 weeks, he's NOT the final decision maker",
  },
  {
    id: "nortech",
    label: "Example 2",
    notes:
      "call con Marta Ruiz de Nortech — muy interesada, quiere el plan team para 12 seats. Le preocupa la integración con su ERP, dijo que HubSpot ya les cotizó algo parecido. No hablamos de precio todavía. Quedó de mandarme los reqs técnicos el lunes. Creo que ella decide pero no estoy seguro",
  },
  {
    id: "brightlabs",
    label: "Example 3",
    notes:
      "quick sync w/ Dave. very keen, wants to move fast — needs it live b4 Q3. main concern is their security review / SOC2. no competitors mentioned. pretty sure he signs off himself. next: intro call w/ their CTO thurs",
  },
];

"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { LeadExtraction } from "@/lib/schema";

interface ExtractionFormProps {
  value: LeadExtraction;
  onChange: (next: LeadExtraction) => void;
  disabled?: boolean;
}

/** Sentinel for the "Unknown" option, since Select values must be strings. */
const UNKNOWN = "unknown";

export function ExtractionForm({
  value,
  onChange,
  disabled = false,
}: ExtractionFormProps) {
  function set<K extends keyof LeadExtraction>(
    key: K,
    next: LeadExtraction[K],
  ) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <NullableTextField
          id="clientName"
          label="Client name"
          value={value.clientName}
          onChange={(next) => set("clientName", next)}
          disabled={disabled}
        />
        <NullableTextField
          id="company"
          label="Company"
          value={value.company}
          onChange={(next) => set("company", next)}
          disabled={disabled}
        />
        <NullableTextField
          id="budget"
          label="Budget"
          value={value.budget}
          onChange={(next) => set("budget", next)}
          disabled={disabled}
        />
        <NullableTextField
          id="timeline"
          label="Timeline"
          value={value.timeline}
          onChange={(next) => set("timeline", next)}
          disabled={disabled}
        />

        <div className="grid gap-2">
          <Label htmlFor="isDecisionMaker">Decision maker</Label>
          <Select
            value={
              value.isDecisionMaker === null
                ? UNKNOWN
                : value.isDecisionMaker
                  ? "yes"
                  : "no"
            }
            onValueChange={(next) =>
              set("isDecisionMaker", next === UNKNOWN ? null : next === "yes")
            }
            disabled={disabled}
          >
            <SelectTrigger id="isDecisionMaker" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value={UNKNOWN}>Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="riskLevel">Risk level</Label>
          <Select
            value={value.riskLevel}
            onValueChange={(next) =>
              set("riskLevel", next as LeadExtraction["riskLevel"])
            }
            disabled={disabled}
          >
            <SelectTrigger id="riskLevel" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <StringListField
        id="objections"
        label="Objections"
        value={value.objections}
        onChange={(next) => set("objections", next)}
        disabled={disabled}
        placeholder="Add an objection"
      />
      <StringListField
        id="competitors"
        label="Competitors"
        value={value.competitors}
        onChange={(next) => set("competitors", next)}
        disabled={disabled}
        placeholder="Add a competitor"
      />

      <div className="grid gap-2">
        <Label htmlFor="nextAction">Next action</Label>
        <Textarea
          id="nextAction"
          value={value.nextAction ?? ""}
          onChange={(event) =>
            set(
              "nextAction",
              event.target.value === "" ? null : event.target.value,
            )
          }
          disabled={disabled}
          placeholder="Not stated"
          className="min-h-16 resize-none"
        />
      </div>
    </div>
  );
}

interface NullableTextFieldProps {
  id: string;
  label: string;
  value: string | null;
  onChange: (next: string | null) => void;
  disabled: boolean;
}

function NullableTextField({
  id,
  label,
  value,
  onChange,
  disabled,
}: NullableTextFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value === "" ? null : event.target.value)
        }
        disabled={disabled}
        placeholder="Not stated"
      />
    </div>
  );
}

interface StringListFieldProps {
  id: string;
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  disabled: boolean;
  placeholder: string;
}

function StringListField({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: StringListFieldProps) {
  const [draft, setDraft] = useState("");

  function add() {
    const item = draft.trim();
    if (item === "") return;
    onChange([...value, item]);
    setDraft("");
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="outline"
          onClick={add}
          disabled={disabled || draft.trim() === ""}
        >
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, index) => (
            <Badge key={`${item}-${index}`} variant="secondary" className="gap-1">
              {item}
              {!disabled && (
                <button
                  type="button"
                  onClick={() =>
                    onChange(value.filter((_, i) => i !== index))
                  }
                  aria-label={`Remove ${item}`}
                  className="rounded-full outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <XIcon className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

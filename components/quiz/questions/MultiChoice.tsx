"use client";

import type { MultiChoiceQuestion } from "@/types/quiz";
import { Check } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: MultiChoiceQuestion;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  onAdvance: () => void;
}

export function MultiChoice({ question, value, onChange, onAdvance }: Props) {
  const selected = value ?? [];
  const max = question.maxSelections;
  const min = question.minSelections ?? (question.required ? 1 : 0);

  const toggle = (optValue: string) => {
    if (selected.includes(optValue)) {
      onChange(selected.filter((v) => v !== optValue));
      return;
    }
    if (max && selected.length >= max) return;
    onChange([...selected, optValue]);
  };

  const canAdvance = selected.length >= min;

  return (
    <div className="flex flex-col gap-3 mt-2">
      {max && (
        <span className="self-start rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          {selected.length} de {max} selecionado{max > 1 ? "s" : ""}
        </span>
      )}

      {question.options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const atMax =
          !!max && selected.length >= max && !isSelected;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            disabled={atMax}
            aria-pressed={isSelected}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-xl border bg-card px-5 py-4 text-left text-[15px] leading-snug text-foreground transition-colors min-h-[60px]",
              isSelected
                ? "border-primary bg-primary/10"
                : atMax
                  ? "cursor-not-allowed border-border opacity-40"
                  : "cursor-pointer border-border hover:border-primary/50",
            )}
          >
            <span>{opt.label}</span>
            <span
              aria-hidden="true"
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                isSelected ? "border-primary bg-primary" : "border-border",
              )}
            >
              {isSelected && (
                <Check className="size-3.5 text-primary-foreground" aria-hidden="true" />
              )}
            </span>
          </button>
        );
      })}

      <CTAButton
        type="button"
        onClick={onAdvance}
        disabled={!canAdvance}
        className="self-start mt-2"
      >
        Avançar
        <ArrowRight className="size-4" aria-hidden="true" />
      </CTAButton>
    </div>
  );
}

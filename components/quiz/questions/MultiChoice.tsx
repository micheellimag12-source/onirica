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
        <span className="text-xs text-muted-foreground">
          {selected.length} / {max} selecionado{max > 1 ? "s" : ""}
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
              "w-full text-left px-5 py-4 rounded-md border bg-card/30 transition-all min-h-[56px] flex items-center justify-between gap-3 text-foreground",
              isSelected
                ? "border-primary bg-primary/10"
                : atMax
                  ? "border-border opacity-40"
                  : "border-border hover:border-primary/40 hover:bg-card/50",
            )}
          >
            <span>{opt.label}</span>
            {isSelected && (
              <Check
                className="size-4 text-primary shrink-0"
                aria-hidden="true"
              />
            )}
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

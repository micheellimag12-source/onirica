"use client";

import type { ScaleQuestion as ScaleQuestionType } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface Props {
  question: ScaleQuestionType;
  value: number | undefined;
  onChange: (value: number) => void;
  onAdvance: () => void;
}

export function ScaleQuestion({ question, value, onChange, onAdvance }: Props) {
  const handleSelect = (n: number) => {
    onChange(n);
    window.setTimeout(onAdvance, 260);
  };

  const length = question.max - question.min + 1;
  const numbers = Array.from({ length }, (_, i) => question.min + i);

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
        {numbers.map((n) => {
          const isSelected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => handleSelect(n)}
              aria-pressed={isSelected}
              className={cn(
                "aspect-square cursor-pointer rounded-xl border text-sm font-medium transition-colors min-h-[48px]",
                isSelected
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Nada significam</span>
        <span>Carregam tudo</span>
      </div>
    </div>
  );
}

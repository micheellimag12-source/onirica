"use client";

import { useEffect, useRef } from "react";
import type { SingleChoiceQuestion } from "@/types/quiz";
import { CTAButton } from "@/components/CTAButton";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: SingleChoiceQuestion;
  value: string | undefined;
  /** When the selected option has an extraField, this is the extra text value. */
  extraValue?: string;
  onChange: (value: string) => void;
  onExtraChange?: (value: string) => void;
  onAdvance: () => void;
}

export function SingleChoice({
  question,
  value,
  extraValue,
  onChange,
  onExtraChange,
  onAdvance,
}: Props) {
  const extraRef = useRef<HTMLInputElement>(null);
  const selected = question.options.find((o) => o.value === value);
  const hasExtra = !!selected?.extraField;

  useEffect(() => {
    if (hasExtra) {
      extraRef.current?.focus();
    }
  }, [hasExtra]);

  const handleSelect = (optValue: string) => {
    const opt = question.options.find((o) => o.value === optValue);
    onChange(optValue);
    if (!opt?.extraField) {
      // Auto-advance for options without extra field
      window.setTimeout(onAdvance, 260);
    }
  };

  const canAdvanceWithExtra =
    !!extraValue && extraValue.trim().length > 0;

  return (
    <div className="flex flex-col gap-3 mt-2">
      {question.options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            aria-pressed={isSelected}
            className={cn(
              "w-full text-left px-5 py-4 rounded-md border bg-card/30 transition-all min-h-[56px] text-foreground",
              isSelected
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border hover:border-primary/40 hover:bg-card/50",
            )}
          >
            {opt.label}
          </button>
        );
      })}

      {hasExtra && selected?.extraField && (
        <>
          <input
            ref={extraRef}
            type="text"
            value={extraValue ?? ""}
            onChange={(e) => onExtraChange?.(e.target.value)}
            placeholder={selected.extraField.placeholder}
            className="w-full px-4 py-3 bg-card border border-border rounded-md text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition mt-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && canAdvanceWithExtra) {
                e.preventDefault();
                onAdvance();
              }
            }}
          />
          <CTAButton
            type="button"
            onClick={onAdvance}
            disabled={!canAdvanceWithExtra}
            className="self-start"
          >
            Avançar
            <ArrowRight className="size-4" aria-hidden="true" />
          </CTAButton>
        </>
      )}
    </div>
  );
}

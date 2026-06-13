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
              "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-card px-5 py-4 text-left text-[15px] leading-snug text-foreground transition-colors min-h-[60px]",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50",
            )}
          >
            <span>{opt.label}</span>
            <span
              aria-hidden="true"
              className={cn(
                "size-2.5 shrink-0 rounded-full border transition-colors",
                isSelected ? "border-primary bg-primary" : "border-border",
              )}
            />
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
            className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
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

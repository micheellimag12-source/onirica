"use client";

import { useEffect, useRef, useState } from "react";
import type { TextareaQuestion as TextareaQuestionType } from "@/types/quiz";
import { validateAnswer } from "@/lib/validation";
import { CTAButton } from "@/components/CTAButton";
import { ArrowRight } from "lucide-react";

interface Props {
  question: TextareaQuestionType;
  value: string | undefined;
  onChange: (value: string) => void;
  onAdvance: () => void;
}

export function TextareaQuestion({
  question,
  value,
  onChange,
  onAdvance,
}: Props) {
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [question.id]);

  const len = (value ?? "").length;
  const validationError = validateAnswer(question, value);
  const error = touched && validationError ? validationError : null;
  const canAdvance = !validationError;

  const limit = question.maxLength;
  const minimum = question.minLength;

  return (
    <div className="flex flex-col gap-3 mt-2">
      <textarea
        ref={ref}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={question.placeholder}
        maxLength={limit}
        rows={6}
        className="w-full resize-y rounded-xl border border-border bg-card px-4 py-3.5 text-base text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none min-h-[140px]"
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span className={error ? "text-destructive" : ""}>
          {error
            ? error
            : minimum && len < minimum
              ? `${len} / mínimo ${minimum}`
              : limit
                ? `${len} / ${limit}`
                : null}
        </span>
        {!question.required && (
          <span className="opacity-60">opcional</span>
        )}
      </div>
      <CTAButton
        type="button"
        onClick={() => {
          setTouched(true);
          if (canAdvance) onAdvance();
        }}
        disabled={!canAdvance}
        className="self-start"
      >
        Avançar
        <ArrowRight className="size-4" aria-hidden="true" />
      </CTAButton>
    </div>
  );
}

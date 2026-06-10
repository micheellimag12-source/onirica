"use client";

import { useEffect, useRef, useState } from "react";
import type { TextQuestion as TextQuestionType } from "@/types/quiz";
import { validateAnswer } from "@/lib/validation";
import { CTAButton } from "@/components/CTAButton";
import { ArrowRight } from "lucide-react";

interface Props {
  question: TextQuestionType;
  value: string | undefined;
  onChange: (value: string) => void;
  onAdvance: () => void;
}

export function TextQuestion({ question, value, onChange, onAdvance }: Props) {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [question.id]);

  const validationError = validateAnswer(question, value);
  const error = touched && validationError ? validationError : null;
  const canAdvance = !validationError;

  return (
    <div className="flex flex-col gap-4 mt-2">
      <input
        ref={inputRef}
        type={question.inputType}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canAdvance) {
            e.preventDefault();
            onAdvance();
          }
        }}
        placeholder={question.placeholder}
        autoComplete={question.inputType === "email" ? "email" : "off"}
        inputMode={question.inputType === "email" ? "email" : "text"}
        className="w-full px-4 py-3 bg-card border border-border rounded-md text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition"
      />
      {error && (
        <span className="text-sm text-destructive">{error}</span>
      )}
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

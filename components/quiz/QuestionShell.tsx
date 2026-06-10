"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type {
  AnswerField,
  AnswerValue,
  Question,
  QuizAnswers,
  SingleChoiceQuestion,
} from "@/types/quiz";
import { BLOCKS } from "@/lib/quiz-config";
import { TextQuestion } from "./questions/TextQuestion";
import { TextareaQuestion } from "./questions/TextareaQuestion";
import { SingleChoice } from "./questions/SingleChoice";
import { MultiChoice } from "./questions/MultiChoice";
import { ScaleQuestion } from "./questions/ScaleQuestion";

interface Props {
  question: Question;
  answers: QuizAnswers;
  onAnswer: (field: AnswerField, value: AnswerValue) => void;
  onAdvance: () => void;
  onBack: () => void;
}

function getExtraField(q: SingleChoiceQuestion, selectedValue: string | undefined) {
  if (!selectedValue) return null;
  const opt = q.options.find((o) => o.value === selectedValue);
  return opt?.extraField ?? null;
}

export function QuestionShell({
  question,
  answers,
  onAnswer,
  onAdvance,
  onBack,
}: Props) {
  const block = BLOCKS.find((b) => b.id === question.block);
  const raw = answers[question.field];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-[600px] mx-auto px-6 py-10 md:py-14 flex flex-col gap-7"
    >
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Voltar
      </button>

      {block && block.title && (
        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[0.2em] text-primary/80">
            {block.title}
          </span>
          {block.subtitle && (
            <span className="text-sm text-muted-foreground">
              {block.subtitle}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl md:text-3xl text-foreground leading-snug">
          {question.text}
        </h2>
        {question.subtext && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {question.subtext}
          </p>
        )}
      </div>

      {question.type === "text" && (
        <TextQuestion
          question={question}
          value={typeof raw === "string" ? raw : undefined}
          onChange={(v) => onAnswer(question.field, v)}
          onAdvance={onAdvance}
        />
      )}

      {question.type === "textarea" && (
        <TextareaQuestion
          question={question}
          value={typeof raw === "string" ? raw : undefined}
          onChange={(v) => onAnswer(question.field, v)}
          onAdvance={onAdvance}
        />
      )}

      {question.type === "single" && (() => {
        const selected = typeof raw === "string" ? raw : undefined;
        const extra = getExtraField(question, selected);
        const extraValue = extra
          ? (answers[extra.field] as string | undefined)
          : undefined;
        return (
          <SingleChoice
            question={question}
            value={selected}
            extraValue={extraValue}
            onChange={(v) => onAnswer(question.field, v)}
            onExtraChange={
              extra ? (v) => onAnswer(extra.field, v) : undefined
            }
            onAdvance={onAdvance}
          />
        );
      })()}

      {question.type === "multi" && (
        <MultiChoice
          question={question}
          value={Array.isArray(raw) ? (raw as string[]) : undefined}
          onChange={(v) => onAnswer(question.field, v)}
          onAdvance={onAdvance}
        />
      )}

      {question.type === "scale" && (
        <ScaleQuestion
          question={question}
          value={typeof raw === "number" ? raw : undefined}
          onChange={(v) => onAnswer(question.field, v)}
          onAdvance={onAdvance}
        />
      )}
    </motion.div>
  );
}

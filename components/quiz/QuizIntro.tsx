"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QUIZ_INTRO_CONTENT } from "@/lib/quiz-config";
import { CTAButton } from "@/components/CTAButton";

interface Props {
  onBegin: () => void;
  onBack: () => void;
}

export function QuizIntro({ onBegin, onBack }: Props) {
  return (
    <motion.div
      key="quiz-intro"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-[600px] mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center gap-8"
    >
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Voltar
      </button>

      <div className="flex flex-col items-center gap-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-primary/80">
          Antes de começar
        </span>
        <h2 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
          {QUIZ_INTRO_CONTENT.title}
        </h2>
      </div>

      <div className="flex max-w-[500px] flex-col gap-4 text-pretty leading-relaxed text-foreground/85">
        {QUIZ_INTRO_CONTENT.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <CTAButton type="button" onClick={onBegin}>
        {QUIZ_INTRO_CONTENT.cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </CTAButton>
    </motion.div>
  );
}

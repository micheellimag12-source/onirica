"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { QuizAnswers } from "@/types/quiz";
import type { Interstitial } from "@/lib/storytelling";
import { CTAButton } from "@/components/CTAButton";

interface Props {
  interstitial: Interstitial;
  answers: QuizAnswers;
  onContinue: () => void;
  onBack: () => void;
}

/**
 * A "mirror" screen between quiz blocks. Reflects the user's own answers back
 * to her to validate the pain and open a curiosity loop. Content is built from
 * config in lib/storytelling.ts.
 */
export function StorytellingInterstitial({
  interstitial,
  answers,
  onContinue,
  onBack,
}: Props) {
  const eyebrow = interstitial.eyebrow?.(answers);
  const title = interstitial.title(answers);
  const body = interstitial.body(answers);

  return (
    <motion.div
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
        {eyebrow && (
          <span className="text-[11px] uppercase tracking-[0.25em] text-primary/80">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
          {title}
        </h2>
      </div>

      <div className="flex max-w-[520px] flex-col gap-4 text-pretty leading-relaxed text-foreground/85">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <CTAButton type="button" onClick={onContinue}>
        {interstitial.cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </CTAButton>
    </motion.div>
  );
}

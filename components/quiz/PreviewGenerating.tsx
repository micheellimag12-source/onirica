"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type {
  PreviewContent,
  PreviewResponse,
  QuizAnswers,
  QuizSubmissionResponse,
} from "@/types/quiz";
import { OniricaMark } from "@/components/OniricaMark";
import { CTAButton } from "@/components/CTAButton";

interface Props {
  answers: QuizAnswers;
  error: string | null;
  onGenerateStart: () => void;
  onGenerateError: (message: string) => void;
  onPreviewReady: (preview: PreviewContent, analysisId: string) => void;
  onReset: () => void;
}

const STAGES = [
  "Lendo o seu sonho...",
  "Cruzando os símbolos...",
  "Ouvindo o que ele tenta dizer...",
  "Consultando as três lentes...",
  "Escrevendo a sua prévia...",
  "Quase pronto...",
];
const STAGE_INTERVAL = 2300;

export function PreviewGenerating({
  answers,
  error,
  onGenerateStart,
  onGenerateError,
  onPreviewReady,
  onReset,
}: Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (error) return;

    let cancelled = false;

    // Cosmetic staged messages while the AI works — advance and hold on the last.
    const interval = window.setInterval(() => {
      if (cancelled) return;
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, STAGE_INTERVAL);

    const run = async () => {
      onGenerateStart();
      try {
        // 1. Register the submission (returns analysis_id).
        const quizRes = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        });
        if (!quizRes.ok) {
          const b = (await quizRes.json().catch(() => ({}))) as { error?: string };
          throw new Error(b.error ?? "Falha ao enviar suas respostas.");
        }
        const quizData: QuizSubmissionResponse = await quizRes.json();
        if (!quizData.analysis_id) throw new Error("Resposta inválida do servidor.");

        // 2. Generate the personalized preview with AI.
        const prevRes = await fetch("/api/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        });
        if (!prevRes.ok) {
          const b = (await prevRes.json().catch(() => ({}))) as { error?: string };
          throw new Error(b.error ?? "Não consegui preparar sua prévia agora.");
        }
        const prevData: PreviewResponse = await prevRes.json();
        if (!prevData.preview) throw new Error("Prévia indisponível no momento.");

        if (cancelled) return;
        onPreviewReady(prevData.preview, quizData.analysis_id);
      } catch (e) {
        if (cancelled) return;
        onGenerateError(
          e instanceof Error ? e.message : "Algo não saiu como esperado.",
        );
      }
    };

    run();
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[520px] mx-auto px-6 py-20 flex flex-col items-center text-center gap-7"
      >
        <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
          Algo não foi como esperado.
        </h2>
        <p className="text-muted-foreground leading-relaxed">{error}</p>
        <CTAButton type="button" onClick={onReset}>
          Tentar novamente
        </CTAButton>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[520px] mx-auto px-6 py-24 flex flex-col items-center text-center gap-8"
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="text-primary"
      >
        <OniricaMark size={48} />
      </motion.div>

      <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
        Preparando sua prévia...
      </h2>

      <motion.p
        key={stage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-sm text-muted-foreground"
      >
        {STAGES[stage]}
      </motion.p>
    </motion.div>
  );
}

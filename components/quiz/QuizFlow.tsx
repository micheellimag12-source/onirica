"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { quizReducer, INITIAL_STATE } from "@/lib/quiz-state";
import { QUESTIONS } from "@/lib/quiz-config";
import { getInterstitial } from "@/lib/storytelling";
import { fbEvent } from "@/lib/fbq";
import {
  clearQuizState,
  loadQuizState,
  saveQuizState,
} from "@/lib/storage";
import { LandingHero } from "@/components/landing/LandingHero";
import { QuizIntro } from "./QuizIntro";
import { StorytellingInterstitial } from "./StorytellingInterstitial";
import { QuestionShell } from "./QuestionShell";
import { PreviewGenerating } from "./PreviewGenerating";
import { PreviewReveal } from "./PreviewReveal";
import { ResumeModal } from "./ResumeModal";
import { ProgressBar } from "./ProgressBar";
import type { LandingVariant } from "@/lib/ab";

export function QuizFlow({ variant = "a" }: { variant?: LandingVariant } = {}) {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const leadCaptured = useRef(false);

  // Detect resumable state on mount
  useEffect(() => {
    const payload = loadQuizState();
    if (
      payload &&
      payload.step.kind !== "initial" &&
      Object.keys(payload.answers).length > 0
    ) {
      setShowResume(true);
    }
    setHydrated(true);
  }, []);

  // Persist on changes (after hydration, and not while resume modal is up).
  // The generating/preview steps are NOT persisted — they depend on AI content
  // that lives only in memory, so resuming into them would show a blank screen.
  useEffect(() => {
    if (!hydrated || showResume) return;
    if (state.step.kind === "generating" || state.step.kind === "preview") return;
    if (
      state.step.kind === "initial" &&
      Object.keys(state.answers).length === 0
    ) {
      return;
    }
    saveQuizState(state.step, state.answers);
  }, [state.step, state.answers, hydrated, showResume]);

  // Lead capture: dispara uma vez quando nome + e-mail válido estão presentes.
  // O e-mail é a última pergunta do quiz, então o Lead representa quem chegou ao fim.
  useEffect(() => {
    if (leadCaptured.current) return;
    if (state.step.kind !== "question") return;

    const { nome, email, identificacao_espiritual } = state.answers;
    if (!nome || !email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    leadCaptured.current = true;
    fbEvent("Lead", { user: { em: email } });
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, identificacao_espiritual }),
      keepalive: true,
    }).catch(() => {
      // Non-blocking — silent on failure
    });
  }, [state.step, state.answers]);

  const handleResume = () => {
    const payload = loadQuizState();
    if (payload) {
      dispatch({
        type: "HYDRATE",
        step: payload.step,
        answers: payload.answers,
      });
    }
    setShowResume(false);
  };

  const handleStartFresh = () => {
    clearQuizState();
    leadCaptured.current = false;
    setShowResume(false);
  };

  const handleRetry = () => {
    // From the generate-error screen: go back to the last question and clear error.
    dispatch({ type: "RESET" });
  };

  const showProgress =
    state.step.kind === "question" || state.step.kind === "interstitial";

  return (
    <>
      {showResume && (
        <ResumeModal onResume={handleResume} onStartFresh={handleStartFresh} />
      )}

      {showProgress && (
        <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-sm pt-6 pb-4 px-6">
          <ProgressBar step={state.step} />
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {state.step.kind === "initial" && (
          <LandingHero
            key="initial"
            variant={variant}
            onStart={() => dispatch({ type: "START" })}
          />
        )}

        {state.step.kind === "intro" && (
          <QuizIntro
            key="intro"
            onBegin={() => dispatch({ type: "BEGIN_QUIZ" })}
            onBack={() => dispatch({ type: "BACK" })}
          />
        )}

        {state.step.kind === "question" && (
          <QuestionShell
            key={QUESTIONS[state.step.index].id}
            question={QUESTIONS[state.step.index]}
            answers={state.answers}
            onAnswer={(field, value) =>
              dispatch({ type: "ANSWER", field, value })
            }
            onAdvance={() => dispatch({ type: "NEXT" })}
            onBack={() => dispatch({ type: "BACK" })}
          />
        )}

        {state.step.kind === "interstitial" &&
          (() => {
            const interstitial = getInterstitial(state.step.id);
            if (!interstitial) return null;
            return (
              <StorytellingInterstitial
                key={interstitial.id}
                interstitial={interstitial}
                answers={state.answers}
                onContinue={() => dispatch({ type: "NEXT" })}
                onBack={() => dispatch({ type: "BACK" })}
              />
            );
          })()}

        {state.step.kind === "generating" && (
          <PreviewGenerating
            key="generating"
            answers={state.answers}
            error={state.generateError}
            onGenerateStart={() => dispatch({ type: "GENERATE_START" })}
            onGenerateError={(message) =>
              dispatch({ type: "GENERATE_ERROR", message })
            }
            onPreviewReady={(preview, analysisId) =>
              dispatch({ type: "PREVIEW_READY", preview, analysisId })
            }
            onReset={handleRetry}
          />
        )}

        {state.step.kind === "preview" && state.preview && (
          <PreviewReveal
            key="preview"
            preview={state.preview}
            analysisId={state.analysisId}
          />
        )}
      </AnimatePresence>
    </>
  );
}

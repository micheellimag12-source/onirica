"use client";

import { notFound } from "next/navigation";
import { QUESTIONS } from "@/lib/quiz-config";
import type { Question, QuizAnswers } from "@/types/quiz";
import { QuizIntro } from "@/components/quiz/QuizIntro";
import { QuestionShell } from "@/components/quiz/QuestionShell";
import { StorytellingInterstitial } from "@/components/quiz/StorytellingInterstitial";
import { INTERSTITIALS } from "@/lib/storytelling";

// PREVIEW DE DESENVOLVIMENTO das telas do quiz — remover antes de produção.
const noop = () => {};
const byField = (f: string) => QUESTIONS.find((q) => q.field === f) as Question;

const ANSWERS: QuizAnswers = {
  idade: "31-35",
  areas_de_vida: ["carreira", "autoconhecimento"],
  sonho_descricao:
    "Eu estava na casa da minha infância, mas a água começava a subir, escura, e eu tentava chegar numa escada que levava a uma porta no topo.",
  nivel_crenca: 7,
  estado_emocional: "confusa",
  elementos_simbolicos: ["agua", "casas", "luz_escuridao"],
  emocao_durante_sonho: "angustia",
  nome: "Mariana",
};

function Screen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div data-screen={label} className="border-b border-border/60">
      <p className="mx-auto max-w-[600px] px-6 pt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
        {label}
      </p>
      {children}
    </div>
  );
}

export default function QuizPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="min-h-screen bg-background">
      <Screen label="Intro">
        <QuizIntro onBegin={noop} onBack={noop} />
      </Screen>

      <Screen label="Pergunta · escolha única">
        <QuestionShell
          question={byField("idade")}
          answers={ANSWERS}
          onAnswer={noop}
          onAdvance={noop}
          onBack={noop}
        />
      </Screen>

      <Screen label="Pergunta · múltipla escolha">
        <QuestionShell
          question={byField("areas_de_vida")}
          answers={ANSWERS}
          onAnswer={noop}
          onAdvance={noop}
          onBack={noop}
        />
      </Screen>

      <Screen label="Pergunta · texto longo">
        <QuestionShell
          question={byField("sonho_descricao")}
          answers={ANSWERS}
          onAnswer={noop}
          onAdvance={noop}
          onBack={noop}
        />
      </Screen>

      <Screen label="Pergunta · escala">
        <QuestionShell
          question={byField("nivel_crenca")}
          answers={ANSWERS}
          onAnswer={noop}
          onAdvance={noop}
          onBack={noop}
        />
      </Screen>

      <Screen label="Interstitial (storytelling)">
        <StorytellingInterstitial
          interstitial={INTERSTITIALS[2]}
          answers={ANSWERS}
          onContinue={noop}
          onBack={noop}
        />
      </Screen>
    </div>
  );
}

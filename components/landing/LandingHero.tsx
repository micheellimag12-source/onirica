"use client";

import { motion } from "motion/react";
import { ArrowRight, Brain, Headphones, Microscope } from "lucide-react";
import { BenefitCard } from "./BenefitCard";
import { CTAButton } from "@/components/CTAButton";
import { OniricaMark } from "@/components/OniricaMark";

interface Props {
  onStart: () => void;
}

export function LandingHero({ onStart }: Props) {
  return (
    <motion.main
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="flex flex-1 flex-col items-center px-6"
    >
      {/* Marca */}
      <div className="mt-8 flex items-center gap-2 md:mt-12">
        <OniricaMark size={22} />
        <span className="font-display text-xl tracking-wide text-primary">
          Onírica
        </span>
      </div>

      {/* Hero */}
      <section className="mt-20 flex w-full max-w-[620px] flex-col items-center text-center md:mt-28">
        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-primary/80">
          Análise onírica personalizada
        </p>

        <h1 className="text-pretty font-display text-[1.75rem] font-normal leading-[1.15] text-foreground sm:text-4xl md:text-5xl lg:text-[3.4rem]">
          Em 6 minutos, descubra o que seu sonho está realmente te dizendo.
        </h1>

        <p className="mt-7 max-w-[480px] text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
          A primeira análise onírica brasileira que une neurociência, psicologia
          profunda e fé numa experiência feita só pra você, com seu nome, seu
          sonho e seu momento de vida.
        </p>

        <div className="mt-9">
          <CTAButton type="button" onClick={onStart}>
            Começar minha análise
            <ArrowRight className="size-4" aria-hidden="true" />
          </CTAButton>
        </div>

        <div className="mt-5 flex flex-col items-center gap-1.5 text-sm text-muted-foreground">
          <span>Gratuito pra começar · 6 minutos</span>
          <span className="text-xs opacity-80">
            Mais de 1.200 pessoas analisaram seus sonhos esta semana
          </span>
        </div>
      </section>

      {/* Por que confiar */}
      <section className="mt-24 w-full max-w-[960px] md:mt-32">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-primary/80">
          Por que a Onírica é diferente
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <BenefitCard
            icon={Brain}
            title="Não é horóscopo"
            body="Cada interpretação é construída a partir do SEU sonho, do SEU contexto e da SUA pergunta."
          />
          <BenefitCard
            icon={Microscope}
            title="Não é misticismo vago"
            body="Toda análise é fundamentada em ciência, psicologia profunda e tradição bíblica."
          />
          <BenefitCard
            icon={Headphones}
            title="Não é texto chato"
            body="Você recebe um Mapa Onírico visual e um diário de 7 dias, e pode ouvir tudo narrado na voz da Onírica."
          />
        </div>
      </section>

      {/* Manifesto + CTA final */}
      <section className="mt-28 mb-24 flex w-full max-w-[620px] flex-col items-center text-center md:mt-36">
        <blockquote className="font-display text-2xl italic leading-snug text-foreground md:text-[1.75rem]">
          &ldquo;Toda noite, sua mente, sua alma e o Espírito tentam falar com
          você. A Onírica é a chave que traduz.&rdquo;
        </blockquote>

        <div className="mt-10">
          <CTAButton type="button" onClick={onStart}>
            Começar minha análise gratuitamente
            <ArrowRight className="size-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </section>
    </motion.main>
  );
}

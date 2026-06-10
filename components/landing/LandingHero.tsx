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
      className="flex flex-1 flex-col items-center px-6 py-10 md:py-16"
    >
      <div className="flex items-center gap-2 mb-16 md:mb-24">
        <OniricaMark className="text-primary" size={20} />
        <span className="font-display text-primary text-xl tracking-wide">
          Onírica
        </span>
      </div>

      <section className="w-full max-w-[600px] flex flex-col items-center text-center gap-7">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.15] text-foreground">
          Em 6 minutos, descubra o que seu sonho está realmente te dizendo.
        </h1>

        <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-[520px]">
          A primeira análise onírica brasileira que une neurociência,
          psicologia profunda e fé numa experiência personalizada — feita só
          pra você, com seu nome, seu sonho e seu momento de vida.
        </p>

        <CTAButton type="button" onClick={onStart}>
          Começar minha análise
          <ArrowRight className="size-4" aria-hidden="true" />
        </CTAButton>

        <div className="flex flex-col gap-1.5 items-center text-sm text-muted-foreground">
          <span>Gratuito pra começar · 6 minutos</span>
          <span className="text-xs opacity-80">
            Mais de 1.200 pessoas analisaram seus sonhos esta semana
          </span>
        </div>
      </section>

      <section className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 md:mt-28">
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
          body="Você recebe um Mapa Onírico visual e um diário de 7 dias — e pode ouvir tudo narrado na voz da Onírica."
        />
      </section>

      <section className="w-full max-w-[600px] flex flex-col items-center text-center gap-10 mt-24 md:mt-32">
        <blockquote className="font-display italic text-2xl md:text-3xl text-foreground leading-snug">
          &ldquo;Toda noite, sua mente, sua alma e o Espírito tentam falar com
          você. A Onírica é a chave que traduz.&rdquo;
        </blockquote>

        <CTAButton type="button" onClick={onStart}>
          Começar minha análise gratuitamente
          <ArrowRight className="size-4" aria-hidden="true" />
        </CTAButton>
      </section>
    </motion.main>
  );
}

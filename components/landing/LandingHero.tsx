"use client";

import { motion } from "motion/react";
import { ArrowRight, Brain, Headphones, Microscope } from "lucide-react";
import { BenefitCard } from "./BenefitCard";
import { Cenarios } from "./Cenarios";
import { DreamVisual } from "./DreamVisual";
import { Faq } from "./Faq";
import { HowItWorks } from "./HowItWorks";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { Testimonials } from "./Testimonials";
import { CTAButton } from "@/components/CTAButton";
import { OniricaMark } from "@/components/OniricaMark";
import { landingCopy, type LandingVariant } from "@/lib/ab";

interface Props {
  onStart: () => void;
  /** Variante do teste A/B da headline, decidida no proxy. */
  variant?: LandingVariant;
}

export function LandingHero({ onStart, variant = "a" }: Props) {
  const copy = landingCopy(variant);

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
      <section className="relative mt-20 flex w-full max-w-[620px] flex-col items-center text-center md:mt-28">
        {/* Aura atrás do título, puramente atmosférica */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 -z-1 h-[420px] w-[620px] max-w-[130vw] -translate-x-1/2 opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(212,167,68,0.13), rgba(212,167,68,0) 70%)",
          }}
        />

        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-primary/80">
          {copy.eyebrow}
        </p>

        <h1 className="text-pretty font-display text-[1.75rem] font-normal leading-[1.15] text-foreground sm:text-4xl md:text-5xl lg:text-[3.4rem]">
          {copy.titulo}
        </h1>

        <p className="mt-7 max-w-[480px] text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
          {copy.subtitulo}
        </p>

        <div className="mt-9">
          <CTAButton type="button" onClick={onStart}>
            {copy.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </CTAButton>
        </div>

        {/* Sem contador até existir número real para mostrar. Ver SocialProof. */}
        <SocialProof />
      </section>

      {/* Peça visual */}
      <Reveal className="mt-16 w-full max-w-[360px] md:mt-20 md:max-w-[420px]">
        <DreamVisual className="w-full" />
      </Reveal>

      {/* Por que confiar */}
      <Reveal className="w-full max-w-[960px]">
        <section className="mt-16 w-full md:mt-20">
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
      </Reveal>

      {/* Como funciona */}
      <Reveal className="w-full max-w-[960px]">
        <HowItWorks />
      </Reveal>

      {/* Situações que o produto resolve (identificação, não depoimento) */}
      <Reveal className="w-full max-w-[960px]">
        <Cenarios />
      </Reveal>

      {/* Depoimentos: não renderiza enquanto não houver depoimentos reais */}
      <Reveal className="w-full max-w-[960px]">
        <Testimonials />
      </Reveal>

      {/* Manifesto + CTA final */}
      <Reveal className="w-full max-w-[620px]">
        <section className="mt-28 flex w-full flex-col items-center text-center md:mt-36">
          <blockquote className="font-display text-2xl italic leading-snug text-foreground md:text-[1.75rem]">
            &ldquo;Toda noite, sua mente, sua alma e o Espírito tentam falar com
            você. A Onírica é a chave que traduz.&rdquo;
          </blockquote>

          <div className="mt-10">
            <CTAButton type="button" onClick={onStart}>
              {copy.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </CTAButton>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Sem cadastro para começar. Você vê uma prévia antes de decidir, e a
            análise completa tem garantia de 7 dias.
          </p>
        </section>
      </Reveal>

      {/* FAQ */}
      <Reveal className="mb-24 w-full max-w-[620px]">
        <Faq />
      </Reveal>
    </motion.main>
  );
}

"use client";

import { motion } from "motion/react";
import { ArrowRight, Lock, Headphones, Map, BookOpen, FileText, Sparkles } from "lucide-react";
import type { PreviewContent } from "@/types/quiz";
import { CTAButton } from "@/components/CTAButton";
import { OniricaMark } from "@/components/OniricaMark";

interface Props {
  preview: PreviewContent;
  analysisId: string | null;
}

// Core product (incluído). O áudio é um order bump oferecido no checkout Cakto.
const DELIVERABLES = [
  { icon: FileText, label: "Sua análise completa, escrita em profundidade" },
  { icon: Map, label: "Mapa Onírico visual com os símbolos do seu sonho" },
  { icon: BookOpen, label: "Diário guiado de 7 dias para aprofundar a mensagem" },
];

function buildCheckoutUrl(analysisId: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL;
  if (!base) return null;
  if (!analysisId) return base;
  try {
    const url = new URL(base);
    url.searchParams.set("ref", analysisId);
    return url.toString();
  } catch {
    return base;
  }
}

export function PreviewReveal({ preview, analysisId }: Props) {
  const checkoutUrl = buildCheckoutUrl(analysisId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[600px] mx-auto px-6 py-12 md:py-16 flex flex-col gap-8"
    >
      {/* Greeting + symbolic title */}
      <div className="flex flex-col items-center text-center gap-3">
        <OniricaMark className="text-primary" size={32} />
        <p className="text-foreground/80">{preview.saudacao}</p>
        <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
          {preview.titulo}
        </h1>
      </div>

      {/* Mirror — validates her feeling */}
      <p className="text-foreground/85 leading-relaxed text-lg font-display">
        {preview.espelho}
      </p>

      {/* The one free insight */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary/90">
          <Sparkles className="size-3.5" aria-hidden="true" /> Uma primeira leitura
        </span>
        <p className="text-foreground/90 leading-relaxed">{preview.insight}</p>
      </div>

      {/* Open loop — what's still hidden */}
      <p className="text-foreground/80 leading-relaxed">{preview.gancho}</p>

      {/* Locked: the full analysis */}
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-primary/30 bg-card p-6 md:p-8">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40"
          aria-hidden="true"
        />
        <div className="flex items-center gap-2 text-primary">
          <Lock className="size-4" aria-hidden="true" />
          <span className="text-sm font-medium tracking-wide">
            Sua análise completa
          </span>
        </div>

        <ul className="flex flex-col gap-4">
          {preview.itens_bloqueados.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-foreground/90">
              <span className="mt-1.5 size-1.5 rounded-full bg-primary/70 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        <div className="h-px bg-border my-1" />

        <ul className="flex flex-col gap-3">
          {DELIVERABLES.map(({ icon: Icon, label }, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
              <Icon className="size-4 text-primary/80 shrink-0" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-3 text-sm text-primary/90 border-t border-border pt-4">
          <Headphones className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="leading-relaxed">
            <span className="font-medium">Opcional no checkout:</span> ouça sua
            análise narrada na voz da Onírica.
          </span>
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="flex flex-col items-center gap-3">
        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-medium text-primary-foreground transition-all hover:brightness-110"
          >
            Desbloquear minha análise completa
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        ) : (
          <>
            <CTAButton type="button" disabled>
              Desbloquear minha análise completa
              <ArrowRight className="size-4" aria-hidden="true" />
            </CTAButton>
            <span className="text-xs text-muted-foreground">
              Checkout em configuração, disponível em breve.
            </span>
          </>
        )}
        <span className="text-xs text-muted-foreground text-center max-w-[360px]">
          Acesso imediato após o pagamento · Pagamento seguro
        </span>
      </div>
    </motion.div>
  );
}

"use client";

import { Clock, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Reforço logo abaixo do CTA. Não usa avatares nem depoimentos fictícios:
 * apenas dá peso visual às informações que a Onírica já afirma.
 *
 * `contagem` é OPCIONAL de propósito. Só passe um número que dê para provar
 * consultando `public.analyses`. Contador inflado é a afirmação mais fácil de
 * desmentir de uma página inteira.
 */
export function SocialProof({ contagem }: { contagem?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Chip icon={Sparkles}>Gratuito pra começar</Chip>
        <Chip icon={Clock}>6 minutos</Chip>
      </div>

      {contagem && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-1.5">
            {!reduce && (
              <motion.span
                className="absolute inset-0 rounded-full bg-onirica-success"
                animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <span className="relative size-1.5 rounded-full bg-onirica-success" />
          </span>
          {contagem}
        </p>
      )}
    </div>
  );
}

function Chip({
  icon: Icon,
  children,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-foreground/80">
      <Icon className="size-3.5 text-primary" strokeWidth={1.5} aria-hidden="true" />
      {children}
    </span>
  );
}

import { MessageCircleHeart, Sparkles, ScrollText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  titulo: string;
  body: string;
}

const STEPS: Step[] = [
  {
    icon: MessageCircleHeart,
    titulo: "Você conta seu sonho",
    body: "Perguntas curtas sobre o que você sonhou, o que sentiu e o momento de vida que está vivendo agora.",
  },
  {
    icon: Sparkles,
    titulo: "A Onírica interpreta",
    body: "Sua resposta é lida à luz da neurociência do sono, da psicologia profunda e da tradição bíblica, sempre a partir do seu contexto.",
  },
  {
    icon: ScrollText,
    titulo: "Você recebe sua análise",
    body: "Análise completa, seu Mapa Onírico visual e um diário de 7 dias para acompanhar o que vier depois.",
  },
];

export function HowItWorks() {
  return (
    <section className="mt-24 w-full max-w-[960px] md:mt-32">
      <p className="mb-10 text-center text-xs uppercase tracking-[0.25em] text-primary/80">
        Como funciona
      </p>

      <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        {/* Fio que conecta as etapas no desktop */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[16%] top-6 hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent md:block"
        />

        {STEPS.map((step, i) => (
          <li key={step.titulo} className="relative flex flex-col items-center text-center">
            <span className="relative z-1 flex size-12 items-center justify-center rounded-full border border-primary/25 bg-card">
              <step.icon className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {i + 1}
              </span>
            </span>

            <h3 className="mt-5 font-display text-lg leading-tight text-foreground">
              {step.titulo}
            </h3>
            <p className="mt-2.5 max-w-[280px] text-sm leading-relaxed text-foreground/70">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

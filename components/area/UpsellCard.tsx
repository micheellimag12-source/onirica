import { Headphones, Moon, Lock, ArrowRight, Check } from "lucide-react";

type Kind = "audio" | "meditation";

const CONFIG: Record<
  Kind,
  { eyebrow: string; titulo: string; preco: string; icon: typeof Headphones; intro: string; bullets: string[] }
> = {
  audio: {
    eyebrow: "Complemento",
    titulo: "Áudio narrado",
    preco: "R$37",
    icon: Headphones,
    intro:
      "Ouça sua análise completa na voz da Onírica, de olhos fechados, talvez antes de dormir.",
    bullets: [
      "Sua análise inteira narrada em áudio",
      "Ideal para ouvir e absorver com calma",
      "Acesso no mesmo lugar, junto da sua análise",
    ],
  },
  meditation: {
    eyebrow: "Complemento",
    titulo: "Meditação & sono",
    preco: "R$29",
    icon: Moon,
    intro:
      "Uma meditação guiada ligada à mensagem do seu sonho, com um guia prático de higiene do sono.",
    bullets: [
      "Meditação guiada para antes de dormir",
      "Práticas de higiene do sono personalizadas",
      "Feito a partir da leitura do seu sonho",
    ],
  },
};

/** Seção de upsell de um bump ainda não comprado. */
export function UpsellCard({
  kind,
  checkoutUrl,
}: {
  kind: Kind;
  checkoutUrl: string | null;
}) {
  const c = CONFIG[kind];
  const Icon = c.icon;
  return (
    <section className="pt-6">
      <div className="mb-8 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary/80">
          {c.eyebrow}
        </p>
        <h2 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
          Desbloqueie {c.titulo.toLowerCase()}
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/30 bg-card">
        <div className="flex flex-col items-center gap-4 border-b border-border px-6 py-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
            <Icon className="size-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h3 className="font-display text-2xl text-foreground">{c.titulo}</h3>
          <p className="max-w-[420px] leading-relaxed text-foreground/80">{c.intro}</p>
        </div>

        <div className="px-6 py-7">
          <ul className="flex flex-col gap-3">
            {c.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground/85">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col items-center gap-3">
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="inline-flex min-h-[52px] w-full max-w-[360px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-all hover:brightness-110"
              >
                Adquirir por {c.preco}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="size-4" aria-hidden="true" /> Em breve
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Pagamento seguro · liberado aqui mesmo após a compra
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Quote } from "lucide-react";
import { DEPOIMENTOS, type Depoimento } from "@/lib/depoimentos";

export type { Depoimento };

/**
 * Prova social em duas formas:
 *
 * - `grid` (padrão): seção completa da landing.
 * - `compact`: faixa enxuta para usar junto do CTA de pagamento, onde a dúvida
 *   ("isso vale mesmo?") é maior e o espaço é curto.
 *
 * Sem depoimentos reais cadastrados, não renderiza nada. Ver `lib/depoimentos.ts`.
 */
export function Testimonials({
  items = DEPOIMENTOS,
  variant = "grid",
  titulo = "Quem já sonhou com a Onírica",
}: {
  items?: Depoimento[];
  variant?: "grid" | "compact";
  titulo?: string;
}) {
  if (items.length === 0) return null;

  if (variant === "compact") {
    return (
      <section className="flex flex-col gap-3">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-primary/80">
          {titulo}
        </p>
        <div className="flex flex-col gap-3">
          {items.map((d) => (
            <figure
              key={d.autor}
              className="flex gap-3 rounded-xl border border-border bg-card/60 p-4"
            >
              <Quote
                className="size-4 shrink-0 text-primary/70"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-2">
                <blockquote className="text-sm leading-relaxed text-foreground/85">
                  {d.texto}
                </blockquote>
                <figcaption className="text-xs text-muted-foreground">
                  <span className="text-foreground/90">{d.autor}</span>
                  {d.contexto && <span className="opacity-70"> · {d.contexto}</span>}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-24 w-full max-w-[960px] md:mt-32">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-primary/80">
        {titulo}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((d) => (
          <figure
            key={d.autor}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <Quote
              className="size-5 shrink-0 text-primary/70"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <blockquote className="text-sm leading-relaxed text-foreground/80">
              {d.texto}
            </blockquote>
            <figcaption className="mt-auto text-xs text-muted-foreground">
              <span className="text-foreground/90">{d.autor}</span>
              {d.contexto && <span className="opacity-70"> · {d.contexto}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

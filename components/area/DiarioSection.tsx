import type { Journal } from "@/lib/deliverables";
import { SectionHeader } from "./AreaShell";

/** Seção do diário guiado de 7 dias. */
export function DiarioSection({ journal }: { journal: Journal }) {
  return (
    <section id="diario" className="scroll-mt-20 pt-20">
      <SectionHeader eyebrow="Entregável" title="Diário de 7 dias" />

      <p className="mb-10 text-lg leading-relaxed text-foreground/85">
        {journal.intro}
      </p>

      <div className="space-y-5">
        {journal.dias.map((d) => (
          <article
            key={d.dia}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-sm uppercase tracking-[0.2em] text-primary/80">
                Dia {d.dia}
              </span>
              <h3 className="font-display text-xl text-foreground">{d.tema}</h3>
            </div>

            <p className="mt-3 leading-relaxed text-foreground/85">{d.texto}</p>

            <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
                Pergunta do dia
              </p>
              <p className="mt-1.5 leading-relaxed text-foreground/90">
                {d.pergunta}
              </p>
            </div>

            <div className="mt-3 flex gap-3">
              <span className="text-xs uppercase tracking-[0.18em] text-primary/80">
                Prática
              </span>
              <p className="flex-1 text-sm leading-relaxed text-foreground/75">
                {d.pratica}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 text-lg leading-relaxed text-foreground/80">
        {journal.fechamento}
      </p>
    </section>
  );
}

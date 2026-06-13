import type { Meditation } from "@/lib/deliverables";
import { SectionHeader } from "./AreaShell";
import { Paragraphs } from "./Paragraphs";

/** Seção de meditação guiada + higiene do sono (order bump). */
export function MeditacaoSection({ meditation }: { meditation: Meditation }) {
  return (
    <section id="meditacao" className="scroll-mt-20 pt-20">
      <SectionHeader eyebrow="Order bump" title="Meditação & sono" />

      <p className="mb-10 text-lg leading-relaxed text-foreground/85">
        {meditation.intro}
      </p>

      {/* Meditação guiada */}
      <div className="rounded-2xl border border-border bg-card p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
          Meditação guiada
        </p>
        <h3 className="mt-1 font-display text-2xl text-foreground">
          {meditation.meditacao.titulo}
        </h3>
        <Paragraphs
          text={meditation.meditacao.roteiro}
          className="mt-5 text-foreground/85"
        />
      </div>

      {/* Higiene do sono */}
      <div className="mt-10">
        <h3 className="mb-2 font-display text-2xl text-foreground">
          Higiene do sono
        </h3>
        <p className="mb-6 leading-relaxed text-foreground/80">
          {meditation.higiene_sono.intro}
        </p>
        <div className="space-y-4">
          {meditation.higiene_sono.praticas.map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <h4 className="font-display text-lg text-primary">{p.titulo}</h4>
              <p className="mt-2 leading-relaxed text-foreground/85">
                {p.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-lg leading-relaxed text-foreground/80">
        {meditation.fechamento}
      </p>
    </section>
  );
}

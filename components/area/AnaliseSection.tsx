import type { FullAnalysis } from "@/lib/deliverables";

/** Seção da análise completa (entregável principal). */
export function AnaliseSection({ analysis }: { analysis: FullAnalysis }) {
  return (
    <section id="analise" className="scroll-mt-20 pt-16">
      {/* Hero */}
      <div className="border-b border-border pb-12 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-primary/80">
          Sua análise onírica
        </p>
        <h1 className="font-display text-4xl leading-tight text-primary md:text-5xl">
          {analysis.titulo}
        </h1>
        <p className="mt-6 font-display text-xl italic text-foreground/90">
          {analysis.saudacao}
        </p>
      </div>

      {/* Abertura */}
      <p className="mt-12 text-lg leading-relaxed text-foreground/90">
        {analysis.abertura}
      </p>

      {/* Símbolos */}
      <div className="mt-14">
        <h3 className="mb-6 font-display text-2xl text-foreground">
          Os símbolos do seu sonho
        </h3>
        <div className="space-y-5">
          {analysis.simbolos.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h4 className="font-display text-xl text-primary">{s.nome}</h4>
              <p className="mt-1 text-sm italic text-foreground/60">
                {s.significado_curto}
              </p>
              <p className="mt-3 leading-relaxed text-foreground/85">
                {s.significado_completo}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resposta à pergunta */}
      <div className="mt-14 rounded-2xl border border-primary/30 bg-primary/5 p-7">
        <h3 className="mb-4 font-display text-2xl text-foreground">
          A resposta à sua pergunta
        </h3>
        <p className="text-lg leading-relaxed text-foreground/90">
          {analysis.resposta_pergunta}
        </p>
      </div>

      {/* As três lentes */}
      <div className="mt-14">
        <h3 className="mb-6 font-display text-2xl text-foreground">
          Lido por três lentes
        </h3>
        <div className="space-y-4">
          <Lente titulo="Neurociência" texto={analysis.lente_neurociencia} />
          <Lente titulo="Psicologia profunda" texto={analysis.lente_psicologia} />
          {analysis.lente_espiritual ? (
            <Lente titulo="Dimensão espiritual" texto={analysis.lente_espiritual} />
          ) : null}
        </div>
      </div>

      {/* Mensagem central */}
      <blockquote className="mt-14 border-l-2 border-primary pl-6">
        <p className="font-display text-2xl italic leading-snug text-foreground md:text-3xl">
          {analysis.mensagem_central}
        </p>
      </blockquote>

      {/* Orientações */}
      <div className="mt-14">
        <h3 className="mb-6 font-display text-2xl text-foreground">
          O que levar para a vida
        </h3>
        <ol className="space-y-4">
          {analysis.orientacao.map((o, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-display text-2xl leading-none text-primary">
                {i + 1}
              </span>
              <p className="leading-relaxed text-foreground/85">{o}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Fechamento */}
      <p className="mt-14 text-lg leading-relaxed text-foreground/80">
        {analysis.fechamento}
      </p>
    </section>
  );
}

function Lente({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary/80">
        {titulo}
      </p>
      <p className="leading-relaxed text-foreground/85">{texto}</p>
    </div>
  );
}

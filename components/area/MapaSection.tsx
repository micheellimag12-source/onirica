import { SectionHeader } from "./AreaShell";

/** Seção do Mapa Onírico — pôster SVG inline + download. */
export function MapaSection({ svg }: { svg: string }) {
  const href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return (
    <section id="mapa" className="scroll-mt-20 pt-20">
      <SectionHeader eyebrow="Entregável" title="Seu Mapa Onírico" />

      <div
        className="mx-auto w-full max-w-[460px] overflow-hidden rounded-2xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.4)] [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <div className="mt-6 text-center">
        <a
          href={href}
          download="mapa-onirico.svg"
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-sm text-primary transition-colors hover:bg-primary/10"
        >
          Baixar o mapa
        </a>
      </div>
    </section>
  );
}

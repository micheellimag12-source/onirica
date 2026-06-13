import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAnalysisByToken } from "@/lib/analyses";
import { renderDreamMapSVG } from "@/lib/deliverables";
import { OniricaMark } from "@/components/OniricaMark";
import { AreaShell, type NavItem } from "@/components/area/AreaShell";
import { AnaliseSection } from "@/components/area/AnaliseSection";
import { MapaSection } from "@/components/area/MapaSection";
import { DiarioSection } from "@/components/area/DiarioSection";
import { AudioSection } from "@/components/area/AudioSection";
import { MeditacaoSection } from "@/components/area/MeditacaoSection";
import { AutoRefresh } from "@/components/area/AutoRefresh";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sua análise · Onírica",
  robots: { index: false, follow: false },
};

export default async function MinhaAnalisePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const row = await getAnalysisByToken(token);
  if (!row) notFound();

  // Ainda preparando (ou deu erro) — tela de espera que recarrega sozinha.
  if (row.status !== "ready" || !row.analysis) {
    return <Preparando nome={row.nome} error={row.status === "error"} />;
  }

  const nome = row.nome ?? "";
  const analysis = row.analysis;
  const mapaSvg = renderDreamMapSVG({
    nome,
    titulo: analysis.titulo,
    palavraGuia: analysis.palavra_guia,
    simbolos: analysis.simbolos.map((s) => ({
      nome: s.nome,
      significadoCurto: s.significado_curto,
    })),
  });

  const hasAudio = row.bump_audio && !!row.narration;
  const hasMeditation = row.bump_meditation && !!row.meditation;

  const nav: NavItem[] = [
    { id: "analise", label: "Análise" },
    { id: "mapa", label: "Mapa" },
    ...(row.journal ? [{ id: "diario", label: "Diário" }] : []),
    ...(hasAudio ? [{ id: "audio", label: "Áudio" }] : []),
    ...(hasMeditation ? [{ id: "meditacao", label: "Meditação" }] : []),
  ];

  return (
    <AreaShell nome={nome} nav={nav}>
      <AnaliseSection analysis={analysis} />
      <MapaSection svg={mapaSvg} />
      {row.journal ? <DiarioSection journal={row.journal} /> : null}
      {hasAudio ? (
        <AudioSection narration={row.narration!} audioUrl={row.audio_url} />
      ) : null}
      {hasMeditation ? <MeditacaoSection meditation={row.meditation!} /> : null}
    </AreaShell>
  );
}

function Preparando({ nome, error }: { nome: string | null; error: boolean }) {
  const primeiroNome = (nome ?? "").trim().split(/\s+/)[0] || "";
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-6 py-20 text-center text-foreground">
      {!error ? <AutoRefresh /> : null}
      <div className="flex max-w-[520px] flex-col items-center gap-6">
        <OniricaMark size={44} />
        {error ? (
          <>
            <h1 className="font-display text-3xl leading-tight md:text-4xl">
              Tivemos um contratempo
            </h1>
            <p className="leading-relaxed text-foreground/80">
              Algo falhou ao preparar sua análise. Já estamos cuidando disso,
              tente recarregar em alguns minutos. Se persistir, fale com a gente
              em contato@metodoonirica.com.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80">
              Quase lá
            </p>
            <h1 className="font-display text-3xl leading-tight md:text-4xl">
              {primeiroNome
                ? `${primeiroNome}, sua análise está sendo preparada`
                : "Sua análise está sendo preparada"}
            </h1>
            <p className="leading-relaxed text-foreground/80">
              Estamos lendo seu sonho com cuidado e montando sua análise
              completa, o Mapa Onírico e o diário de 7 dias. Isto leva alguns
              minutos e esta página atualiza sozinha.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

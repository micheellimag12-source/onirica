import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAnalysisByToken } from "@/lib/analyses";
import { renderDreamMapSVG } from "@/lib/deliverables";
import { OniricaMark } from "@/components/OniricaMark";
import { AreaTabs, type AreaTab } from "@/components/area/AreaTabs";
import { AnaliseSection } from "@/components/area/AnaliseSection";
import { MapaSection } from "@/components/area/MapaSection";
import { DiarioSection } from "@/components/area/DiarioSection";
import { AudioSection } from "@/components/area/AudioSection";
import { MeditacaoSection } from "@/components/area/MeditacaoSection";
import { UpsellCard } from "@/components/area/UpsellCard";
import { AutoRefresh } from "@/components/area/AutoRefresh";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sua análise · Onírica",
  robots: { index: false, follow: false },
};

/** Monta a URL de checkout de um bump (upsell), carregando o src da análise. */
function bumpCheckout(base: string | undefined, analysisId: string): string | null {
  if (!base) return null;
  try {
    const u = new URL(base);
    u.searchParams.set("src", analysisId);
    return u.toString();
  } catch {
    return base;
  }
}

export default async function MinhaAnalisePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const row = await getAnalysisByToken(token);
  if (!row) notFound();

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

  const audioCheckout = bumpCheckout(
    process.env.NEXT_PUBLIC_CAKTO_AUDIO_URL,
    row.id,
  );
  const meditationCheckout = bumpCheckout(
    process.env.NEXT_PUBLIC_CAKTO_MEDITATION_URL,
    row.id,
  );

  const tabs: AreaTab[] = [
    { id: "analise", label: "Análise", node: <AnaliseSection analysis={analysis} /> },
    { id: "mapa", label: "Mapa", node: <MapaSection svg={mapaSvg} /> },
  ];
  if (row.journal) {
    tabs.push({ id: "diario", label: "Diário", node: <DiarioSection journal={row.journal} /> });
  }
  tabs.push(
    hasAudio
      ? {
          id: "audio",
          label: "Áudio",
          node: <AudioSection narration={row.narration!} audioUrl={row.audio_url} />,
        }
      : {
          id: "audio",
          label: "Áudio",
          locked: true,
          node: <UpsellCard kind="audio" checkoutUrl={audioCheckout} />,
        },
  );
  tabs.push(
    hasMeditation
      ? {
          id: "meditacao",
          label: "Meditação",
          node: <MeditacaoSection meditation={row.meditation!} />,
        }
      : {
          id: "meditacao",
          label: "Meditação",
          locked: true,
          node: <UpsellCard kind="meditation" checkoutUrl={meditationCheckout} />,
        },
  );

  return <AreaTabs nome={nome} tabs={tabs} />;
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

import { readFileSync } from "node:fs";
import { notFound } from "next/navigation";
import { renderDreamMapSVG } from "@/lib/deliverables";
import type {
  FullAnalysis,
  Journal,
  Narration,
  Meditation,
} from "@/lib/deliverables";
import { stripDashesDeep } from "@/lib/deliverables/sanitize";
import { AreaShell, type NavItem } from "@/components/area/AreaShell";
import { AnaliseSection } from "@/components/area/AnaliseSection";
import { MapaSection } from "@/components/area/MapaSection";
import { DiarioSection } from "@/components/area/DiarioSection";
import { AudioSection } from "@/components/area/AudioSection";
import { MeditacaoSection } from "@/components/area/MeditacaoSection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PREVIEW DE DESENVOLVIMENTO — lê o exemplo gerado em /tmp. Remover antes de prod
// (a versão real será /minha-analise/[token] lendo do banco).
const DIR = "/tmp/onirica-deliverables";
const read = <T,>(f: string): T =>
  stripDashesDeep(JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")) as T);

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ only?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { only } = await searchParams;
  const show = (id: string) => !only || only === id;
  const nome = "Mariana Alves";
  const analysis = read<FullAnalysis>("analysis.json");
  const journal = read<Journal>("journal.json");
  const narration = read<Narration>("narration.json");
  const meditation = read<Meditation>("meditation.json");

  const mapaSvg = renderDreamMapSVG({
    nome,
    titulo: analysis.titulo,
    palavraGuia: analysis.palavra_guia,
    simbolos: analysis.simbolos.map((s) => ({
      nome: s.nome,
      significadoCurto: s.significado_curto,
    })),
  });

  const nav: NavItem[] = [
    { id: "analise", label: "Análise" },
    { id: "mapa", label: "Mapa" },
    { id: "diario", label: "Diário" },
    { id: "audio", label: "Áudio" },
    { id: "meditacao", label: "Meditação" },
  ];

  return (
    <AreaShell nome={nome} nav={nav}>
      {show("analise") ? <AnaliseSection analysis={analysis} /> : null}
      {show("mapa") ? <MapaSection svg={mapaSvg} /> : null}
      {show("diario") ? <DiarioSection journal={journal} /> : null}
      {show("audio") ? <AudioSection narration={narration} audioUrl={null} /> : null}
      {show("meditacao") ? <MeditacaoSection meditation={meditation} /> : null}
    </AreaShell>
  );
}

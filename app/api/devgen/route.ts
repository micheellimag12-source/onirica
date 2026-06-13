import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { generateFullAnalysis, type FullAnalysis } from "@/lib/deliverables/full-analysis";
import { renderDreamMapSVG } from "@/lib/deliverables/dream-map-svg";
import { generateJournal } from "@/lib/deliverables/journal";
import { generateNarration } from "@/lib/deliverables/narration";
import { generateMeditation } from "@/lib/deliverables/meditation";
import { SAMPLE_ANSWERS } from "@/lib/deliverables/sample";

export const runtime = "nodejs";
export const maxDuration = 300;
const DIR = "/tmp/onirica-deliverables";

// ROTA TEMPORÁRIA DE DESENVOLVIMENTO — remover antes de produção.
//   (sem params)        → gera análise completa + Mapa
//   ?cached=1           → re-renderiza o Mapa a partir da análise salva
//   ?with=journal,narration,meditation → gera os derivados (usa análise salva)
export async function GET(req: NextRequest) {
  // Rota só de desenvolvimento — inerte em produção.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const sp = req.nextUrl.searchParams;
  const cached = sp.get("cached");
  const withParam = sp.get("with");
  const want = new Set((withParam ?? "").split(",").map((s) => s.trim()).filter(Boolean));

  mkdirSync(DIR, { recursive: true });

  const analysis: FullAnalysis =
    cached || want.size
      ? JSON.parse(readFileSync(`${DIR}/analysis.json`, "utf8"))
      : await generateFullAnalysis(SAMPLE_ANSWERS);

  const out: Record<string, unknown> = {};

  if (!want.size) {
    const svg = renderDreamMapSVG({
      nome: SAMPLE_ANSWERS.nome ?? "",
      titulo: analysis.titulo,
      palavraGuia: analysis.palavra_guia,
      simbolos: analysis.simbolos.map((s) => ({
        nome: s.nome,
        significadoCurto: s.significado_curto,
      })),
    });
    writeFileSync(`${DIR}/analysis.json`, JSON.stringify(analysis, null, 2));
    writeFileSync(`${DIR}/mapa.svg`, svg);
    out.analysis = analysis;
  }

  if (want.has("journal")) {
    const journal = await generateJournal(SAMPLE_ANSWERS, analysis);
    writeFileSync(`${DIR}/journal.json`, JSON.stringify(journal, null, 2));
    out.journal = journal;
  }
  if (want.has("narration")) {
    const narration = await generateNarration(SAMPLE_ANSWERS, analysis);
    writeFileSync(`${DIR}/narration.json`, JSON.stringify(narration, null, 2));
    out.narration = narration;
  }
  if (want.has("meditation")) {
    const meditation = await generateMeditation(SAMPLE_ANSWERS, analysis);
    writeFileSync(`${DIR}/meditation.json`, JSON.stringify(meditation, null, 2));
    out.meditation = meditation;
  }

  return NextResponse.json({ ok: true, ...out });
}

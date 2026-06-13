import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { generateFullAnalysis, type FullAnalysis } from "@/lib/deliverables/full-analysis";
import { renderDreamMapSVG } from "@/lib/deliverables/dream-map-svg";
import { generateJournal } from "@/lib/deliverables/journal";
import { generateNarration } from "@/lib/deliverables/narration";
import { generateMeditation } from "@/lib/deliverables/meditation";
import { generateAndStoreAudio } from "@/lib/deliverables/audio";
import { SAMPLE_ANSWERS } from "@/lib/deliverables/sample";
import { supabaseAdmin } from "@/lib/supabase/server";

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

  // ?seed=<token>&audio=0|1&meditation=0|1 → insere uma linha "ready" com os
  // entregáveis de exemplo e as flags de bump indicadas, para testar a trava
  // de entrega da página real /minha-analise/[token].
  const seed = sp.get("seed");
  if (seed) {
    const bumpAudio = sp.get("audio") === "1";
    const bumpMeditation = sp.get("meditation") === "1";
    const read = (f: string) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"));
    const db = supabaseAdmin();
    await db.from("analyses").delete().eq("token", seed);
    const { error } = await db.from("analyses").insert({
      token: seed,
      status: "ready",
      nome: SAMPLE_ANSWERS.nome ?? null,
      email: SAMPLE_ANSWERS.email ?? null,
      answers: SAMPLE_ANSWERS,
      analysis: read("analysis.json"),
      journal: read("journal.json"),
      bump_audio: bumpAudio,
      bump_meditation: bumpMeditation,
      narration: bumpAudio ? read("narration.json") : null,
      meditation: bumpMeditation ? read("meditation.json") : null,
      generated_at: new Date().toISOString(),
    });
    if (error) return NextResponse.json({ ok: false, error: error.message });
    return NextResponse.json({
      ok: true,
      url: `/minha-analise/${seed}`,
      bump_audio: bumpAudio,
      bump_meditation: bumpMeditation,
    });
  }

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
  if (want.has("audio")) {
    const narration = JSON.parse(readFileSync(`${DIR}/narration.json`, "utf8"));
    const url = await generateAndStoreAudio({
      token: "devtest-onirica",
      text: narration.roteiro,
    });
    out.audioUrl = url;
  }

  return NextResponse.json({ ok: true, ...out });
}

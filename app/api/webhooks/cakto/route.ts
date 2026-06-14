import { NextRequest, NextResponse, after } from "next/server";
import { getAnalysisById, updateAnalysis } from "@/lib/analyses";
import {
  generateDeliverables,
  generateAudioBump,
  generateMeditationBump,
} from "@/lib/deliverables/orchestrate";
import { sendAccessLink } from "@/lib/email";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

// Mapa offer.id → bump (confirmado pelo payload real da Cakto).
//   zoc2o3p = produto principal (base)
const OFFER_AUDIO = "9wqepsa"; // Áudio narrado
const OFFER_MEDITATION = "av72q7s"; // Meditação + Higiene do sono

// A Cakto dispara 1 evento por item (modo Individual), quase simultâneos.
// Esperamos um pouco para consolidar as flags dos bumps antes de gerar.
const SETTLE_MS = 20_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** O `src` (id da análise) vem dentro de data.checkoutUrl. */
function extractSrc(url: unknown): string | null {
  if (typeof url !== "string") return null;
  try {
    return new URL(url).searchParams.get("src");
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "payload inválido" }, { status: 400 });
  }

  const expected = process.env.CAKTO_WEBHOOK_SECRET;
  const secretValid = !expected || payload.secret === expected;

  // Guarda o evento (auditoria/depuração).
  if (supabaseConfigured()) {
    try {
      await supabaseAdmin().from("webhook_events").insert({
        source: "cakto",
        event: typeof payload.event === "string" ? payload.event : null,
        payload,
        headers: { "x-secret-valid": String(secretValid) },
      });
    } catch (e) {
      console.error("[cakto] falha ao guardar evento:", e);
    }
  }

  if (!secretValid) {
    return NextResponse.json({ ok: false, error: "secret inválido" }, { status: 401 });
  }

  const data = (payload.data ?? {}) as Record<string, any>;
  if (payload.event !== "purchase_approved" || data.status !== "paid") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const src = extractSrc(data.checkoutUrl);
  if (!src) {
    console.warn("[cakto] evento sem src no checkoutUrl");
    return NextResponse.json({ ok: true, noSrc: true });
  }

  const row = await getAnalysisById(src);
  if (!row) {
    console.warn("[cakto] análise não encontrada para src:", src);
    return NextResponse.json({ ok: true, notFound: true });
  }

  // Marca a flag do item comprado (idempotente).
  const offerId: unknown = data.offer?.id;
  const patch: Record<string, unknown> = {
    cakto_order_id: String(data.id ?? row.cakto_order_id ?? "") || null,
  };
  if (offerId === OFFER_AUDIO) patch.bump_audio = true;
  if (offerId === OFFER_MEDITATION) patch.bump_meditation = true;
  await updateAnalysis(src, patch);

  // Claim atômico: transiciona pending → generating. Só UM evento casa o
  // status 'pending' (os irmãos já veem 'generating'), então só um dispara.
  const db = supabaseAdmin();
  const { data: claimed } = await db
    .from("analyses")
    .update({ status: "generating" })
    .eq("id", src)
    .eq("status", "pending")
    .select("id");

  const emails = [...new Set([data.customer?.email, row.email].filter(Boolean))] as string[];

  if (claimed && claimed.length > 0) {
    // Compra inicial: gera tudo.
    after(async () => {
      // 1) Manda o link de acesso (canal garantido).
      for (const email of emails) {
        try {
          await sendAccessLink({
            to: email,
            nome: row.nome ?? data.customer?.name ?? null,
            token: row.token,
          });
        } catch (e) {
          console.error("[cakto] falha ao enviar e-mail para", email, e);
        }
      }
      // 2) Espera consolidar as flags dos bumps e gera com o estado fresco.
      await sleep(SETTLE_MS);
      const fresh = await getAnalysisById(src);
      if (fresh && fresh.status === "generating") {
        try {
          await generateDeliverables(fresh);
        } catch (e) {
          console.error("[cakto] geração falhou:", e);
        }
      }
    });
  } else {
    // Não é o primeiro evento de uma análise 'pending'. Pode ser um UPSELL:
    // a análise já está pronta e a pessoa comprou um bump depois.
    const fresh = await getAnalysisById(src);
    if (fresh && fresh.status === "ready" && fresh.analysis) {
      if (offerId === OFFER_AUDIO && !fresh.narration) {
        after(() =>
          generateAudioBump(fresh).catch((e) =>
            console.error("[cakto] upsell áudio falhou:", e),
          ),
        );
      }
      if (offerId === OFFER_MEDITATION && !fresh.meditation) {
        after(() =>
          generateMeditationBump(fresh).catch((e) =>
            console.error("[cakto] upsell meditação falhou:", e),
          ),
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}

// Alguns painéis fazem um GET ao salvar a URL.
export async function GET() {
  return NextResponse.json({ ok: true, webhook: "cakto" });
}

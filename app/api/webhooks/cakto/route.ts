import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Webhook da Cakto.
 *
 * FASE ATUAL (captura): valida o `secret` se já configurado, guarda o payload
 * em `webhook_events` para inspeção e responde 200. O processamento real
 * (achar a análise pelo `src`, marcar bumps e disparar a geração) entra depois
 * que confirmarmos o formato exato com um evento de teste.
 */
export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "payload inválido" }, { status: 400 });
  }

  // Valida o segredo se ele já estiver configurado no ambiente.
  const expected = process.env.CAKTO_WEBHOOK_SECRET;
  if (expected && payload.secret !== expected) {
    return NextResponse.json({ ok: false, error: "secret inválido" }, { status: 401 });
  }

  // Guarda o evento para inspeção (não falha a resposta se o banco estiver off).
  if (supabaseConfigured()) {
    try {
      await supabaseAdmin().from("webhook_events").insert({
        source: "cakto",
        event: typeof payload.event === "string" ? payload.event : null,
        payload,
        headers: {
          "content-type": req.headers.get("content-type"),
          "user-agent": req.headers.get("user-agent"),
        },
      });
    } catch (e) {
      console.error("[webhook/cakto] falha ao guardar evento:", e);
    }
  }

  return NextResponse.json({ ok: true });
}

// Alguns painéis fazem um GET de teste ao salvar a URL.
export async function GET() {
  return NextResponse.json({ ok: true, webhook: "cakto" });
}

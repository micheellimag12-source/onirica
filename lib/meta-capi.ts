import crypto from "node:crypto";

// Conversions API (server-side) do Meta. Usado para o Purchase, que acontece
// no checkout da Cakto (fora do nosso domínio), então não tem Pixel de
// navegador nosso ali — mandamos o evento direto do backend.
const PIXEL_ID = "993747943400984";
const API_VERSION = "v21.0";

const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest("hex");
const norm = (v: string) => v.trim().toLowerCase();

function hashEmail(email: string): string {
  return sha256(norm(email));
}

function hashPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  return digits ? sha256(digits) : null;
}

export interface PurchaseInput {
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  /** Cookie _fbp do navegador (não vai com hash). */
  fbp?: string | null;
  /** Cookie _fbc do navegador, vindo do clique de anúncio (não vai com hash). */
  fbc?: string | null;
  value: number;
  currency?: string;
  /** Chave de deduplicação. Use o id do pedido da Cakto. */
  eventId: string;
  eventSourceUrl?: string | null;
  /** Só em teste; em produção deixe vazio. */
  testEventCode?: string | null;
}

/**
 * Envia um evento Purchase ao Conversions API do Meta.
 * Dados de usuário (email, telefone, nome) vão com hash SHA-256, como o Meta exige.
 * Retorna true se o Meta aceitou o evento.
 */
export async function sendPurchaseEvent(input: PurchaseInput): Promise<boolean> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.warn("[meta-capi] META_CAPI_TOKEN ausente; Purchase não enviado");
    return false;
  }

  const user_data: Record<string, unknown> = {};
  if (input.email) user_data.em = [hashEmail(input.email)];
  if (input.phone) {
    const ph = hashPhone(input.phone);
    if (ph) user_data.ph = [ph];
  }
  if (input.name) {
    const parts = norm(input.name).split(/\s+/).filter(Boolean);
    if (parts.length > 0) {
      user_data.fn = [sha256(parts[0])];
      if (parts.length > 1) user_data.ln = [sha256(parts[parts.length - 1])];
    }
  }
  // fbp/fbc vão sem hash (são identificadores do navegador, não PII).
  if (input.fbp) user_data.fbp = input.fbp;
  if (input.fbc) user_data.fbc = input.fbc;

  const event: Record<string, unknown> = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: "website",
    user_data,
    custom_data: { currency: input.currency ?? "BRL", value: input.value },
  };
  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl;

  const body: Record<string, unknown> = { data: [event] };
  if (input.testEventCode) body.test_event_code = input.testEventCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      console.error("[meta-capi] Purchase falhou:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[meta-capi] erro ao enviar Purchase:", e);
    return false;
  }
}

/** Meta Pixel (navegador) + dataLayer (para a Conversions API server-side via GTM/Stape). */

import { AB_COOKIE } from "@/lib/ab";

type FbUserData = { em?: string };

/** Lê um cookie do navegador; null fora do browser ou se não existir. */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function newEventId(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Dispara um evento no Pixel do navegador (com eventID) e empurra o MESMO evento
 * no dataLayer, para o Data Tag (GTM Web) enviar ao servidor de tagging, que por
 * sua vez manda pro Conversions API. O `event_id` compartilhado entre navegador e
 * servidor é o que permite a deduplicação no Meta.
 */
export function fbEvent(
  name: string,
  opts: { custom?: Record<string, unknown>; user?: FbUserData } = {},
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  };
  const eventId = newEventId();
  // A variante da headline viaja em todo evento, para dar para comparar
  // conversão por variante no Gerenciador de Eventos e no GTM.
  const variante = readCookie(AB_COOKIE);
  const custom = {
    ...(opts.custom ?? {}),
    ...(variante ? { lp_variant: variante } : {}),
  };
  if (typeof w.fbq === "function") {
    w.fbq("track", name, custom, { eventID: eventId });
  }
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "fb_event",
    fb_name: name,
    fb_event_id: eventId,
    ...(variante ? { lp_variant: variante } : {}),
    ...(opts.user?.em ? { em: opts.user.em } : {}),
  });
}

/** Compat: mantém a assinatura antiga (sem dados de usuário). */
export function fbqTrack(event: string, params?: Record<string, unknown>): void {
  fbEvent(event, { custom: params });
}

/**
 * Lê os cookies `_fbp` e `_fbc` que o Pixel grava no navegador. Guardamos eles
 * junto da análise para enriquecer o Purchase server-side (sobe o match quality).
 * `_fbc` só existe quando a pessoa chegou por um clique de anúncio (fbclid).
 */
export function getFbCookies(): { fbp: string | null; fbc: string | null } {
  return { fbp: readCookie("_fbp"), fbc: readCookie("_fbc") };
}

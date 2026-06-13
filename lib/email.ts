import { Resend } from "resend";

/**
 * Envio de e-mail via Resend. Gracioso: se RESEND_API_KEY não estiver setada,
 * vira no-op (loga e retorna), pra não quebrar o fluxo em ambientes sem config.
 */

// `||` (não `??`): trata string vazia como ausente, caindo no padrão correto.
const FROM = process.env.RESEND_FROM || "Onírica <contato@metodoonirica.com>";
const SITE_URL = process.env.SITE_URL || "https://metodoonirica.com";

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

function client(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY não configurada.");
  return new Resend(key);
}

/** E-mail de entrega: manda o link de acesso à área da análise. */
export async function sendAccessLink(opts: {
  to: string;
  nome?: string | null;
  token: string;
}): Promise<{ id: string | null; skipped?: boolean }> {
  if (!emailConfigured()) {
    console.warn("[email] RESEND_API_KEY ausente — envio pulado.");
    return { id: null, skipped: true };
  }
  const primeiroNome = (opts.nome ?? "").trim().split(/\s+/)[0] || "";
  const saudacao = primeiroNome ? `${primeiroNome}, ` : "";
  const link = `${SITE_URL}/minha-analise/${opts.token}`;

  const { data, error } = await client().emails.send({
    from: FROM,
    to: opts.to,
    subject: "Sua análise onírica está pronta",
    html: accessLinkHtml({ saudacao, link }),
    text:
      `${saudacao}sua análise onírica está pronta.\n\n` +
      `Acesse aqui: ${link}\n\n` +
      `Este link é pessoal e dá acesso à sua análise completa, ao Mapa Onírico e ao diário de 7 dias.\n\nOnírica`,
  });
  if (error) throw error;
  return { id: data?.id ?? null };
}

function accessLinkHtml({ saudacao, link }: { saudacao: string; link: string }): string {
  return `<!doctype html>
<html lang="pt-BR">
<body style="margin:0;background:#0B1733;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B1733;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#152244;border:1px solid rgba(212,167,68,0.2);border-radius:16px;padding:40px 32px;">
        <tr><td align="center" style="padding-bottom:8px;">
          <span style="font-size:13px;letter-spacing:4px;color:#D4A744;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Onírica</span>
        </td></tr>
        <tr><td align="center" style="padding:8px 0 20px;">
          <h1 style="margin:0;font-size:26px;line-height:1.25;color:#F5F1E8;font-weight:normal;">Sua análise está pronta</h1>
        </td></tr>
        <tr><td style="font-size:16px;line-height:1.6;color:#F5F1E8;opacity:0.9;padding-bottom:28px;font-family:Helvetica,Arial,sans-serif;">
          ${saudacao}o que seu sonho guardava já está esperando por você: sua análise completa, o Mapa Onírico visual e o diário de 7 dias.
        </td></tr>
        <tr><td align="center" style="padding-bottom:28px;">
          <a href="${link}" style="display:inline-block;background:#D4A744;color:#0B1733;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:12px;font-family:Helvetica,Arial,sans-serif;">Abrir minha análise</a>
        </td></tr>
        <tr><td style="font-size:13px;line-height:1.6;color:#9CA3AF;font-family:Helvetica,Arial,sans-serif;">
          Este link é pessoal e dá acesso à sua experiência completa. Se o botão não abrir, copie e cole no navegador:<br>
          <a href="${link}" style="color:#D4A744;word-break:break-all;">${link}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

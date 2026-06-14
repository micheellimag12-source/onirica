import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAnalysisById, getAnalysisByCaktoOrder } from "@/lib/analyses";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";
import { OniricaMark } from "@/components/OniricaMark";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acesso · Onírica",
  robots: { index: false, follow: false },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Página de entrega pós-compra (URL configurada na Cakto como "Área de membros
 * Externa"). Varre todos os parâmetros da URL e, achando algo que case com uma
 * análise (pelo id/`src` ou pelo id do pedido Cakto), manda a pessoa direto pra
 * área dela. Senão, orienta a checar o e-mail (canal garantido, via Resend).
 */
export default async function AcessoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const values = Object.values(sp)
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .filter((v): v is string => !!v);

  let token: string | null = null;
  for (const v of values) {
    if (UUID.test(v)) {
      try {
        const row = await getAnalysisById(v);
        if (row) {
          token = row.token;
          break;
        }
      } catch {
        // ignora
      }
    }
    try {
      const row = await getAnalysisByCaktoOrder(v);
      if (row) {
        token = row.token;
        break;
      }
    } catch {
      // ignora
    }
  }

  if (token) redirect(`/minha-analise/${token}`);

  // DEBUG temporário: registra o que a Cakto mandou quando não identificamos,
  // para mapear o parâmetro de redirecionamento. Remover depois.
  if (supabaseConfigured()) {
    try {
      await supabaseAdmin().from("webhook_events").insert({
        source: "acesso-miss",
        event: "redirect",
        payload: { params: sp },
      });
    } catch {
      // ignora
    }
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-6 py-20 text-center text-foreground">
      <div className="flex max-w-[520px] flex-col items-center gap-6">
        <OniricaMark size={44} />
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">
          Pagamento confirmado
        </p>
        <h1 className="font-display text-3xl leading-tight md:text-4xl">
          Sua análise está a caminho
        </h1>
        <p className="leading-relaxed text-foreground/80">
          Estamos preparando sua análise completa, o Mapa Onírico e o diário de 7
          dias. Em alguns minutos enviamos o link de acesso para o seu e-mail.
          Confira também a caixa de spam, e qualquer coisa fale com a gente em
          contato@metodoonirica.com.
        </p>
      </div>
    </main>
  );
}

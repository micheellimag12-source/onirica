import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAnalysisById } from "@/lib/analyses";
import { OniricaMark } from "@/components/OniricaMark";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acesso · Onírica",
  robots: { index: false, follow: false },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Página de entrega pós-compra (URL configurada na Cakto).
 * Se a Cakto repassar o `src` (id da análise) no redirecionamento, manda a
 * pessoa direto para a área dela. Senão, orienta a checar o e-mail (canal
 * garantido, enviado pelo webhook).
 */
export default async function AcessoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const id = sp.src || sp.ref || sp.s || sp.order || sp.transaction;

  if (id && UUID.test(id)) {
    try {
      const row = await getAnalysisById(id);
      if (row) redirect(`/minha-analise/${row.token}`);
    } catch {
      // ignora e cai no fallback abaixo
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

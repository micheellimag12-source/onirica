import type { Metadata } from "next";
import { OniricaMark } from "@/components/OniricaMark";

export const metadata: Metadata = {
  title: "Preparando sua análise — Onírica",
};

interface PreparandoPageProps {
  params: Promise<{ analysis_id: string }>;
}

export default async function PreparandoPage({ params }: PreparandoPageProps) {
  const { analysis_id } = await params;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-[520px] flex flex-col items-center gap-7">
        <OniricaMark className="text-primary" size={40} />
        <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
          Sua análise está sendo preparada.
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Recebemos seu pagamento. Sua experiência Onírica completa — áudio, Mapa
          Onírico e diário de 7 dias — está sendo gerada e aparecerá aqui em
          instantes.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-4">
          Referência: {analysis_id}
        </p>
      </div>
    </main>
  );
}

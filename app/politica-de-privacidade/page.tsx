import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Onírica",
};

export default function PoliticaDePrivacidade() {
  return (
    <main className="flex flex-1 flex-col px-6 py-16 max-w-[680px] mx-auto w-full">
      <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">
        Política de Privacidade
      </h1>
      <div className="space-y-4 text-foreground/80 leading-relaxed">
        <p>
          [Placeholder] A Onírica respeita a sua privacidade. As informações
          que você compartilha no quiz são confidenciais e utilizadas apenas
          para preparar a sua análise personalizada.
        </p>
        <p>O conteúdo completo desta política será publicado em breve.</p>
      </div>
    </main>
  );
}

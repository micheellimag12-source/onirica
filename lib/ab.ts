/**
 * Teste A/B da headline da landing.
 *
 * A variante é sorteada uma vez no `proxy.ts` e gravada em cookie, então a
 * pessoa vê sempre a mesma página, e a página chega pronta do servidor (sem
 * piscar a headline errada). O valor viaja junto dos eventos do Pixel para dar
 * para segmentar conversão por variante no Gerenciador de Eventos.
 */

export const AB_COOKIE = "onirica_lp";
export const AB_MAX_AGE = 60 * 60 * 24 * 90; // 90 dias

export type LandingVariant = "a" | "b";

export function isVariant(v: string | undefined): v is LandingVariant {
  return v === "a" || v === "b";
}

export interface LandingCopy {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  cta: string;
}

export const LANDING_COPY: Record<LandingVariant, LandingCopy> = {
  // A: nega o acaso. É a afirmação mais forte que o produto sustenta, porque é
  // a própria tese das três lentes. O ganho fica no subtítulo, o título bate curto.
  a: {
    eyebrow: "Análise onírica personalizada",
    titulo: "Aquele sonho não foi aleatório.",
    subtitulo:
      "Conte ele em 6 minutos e receba a leitura do que a sua mente tentou te dizer, com o seu nome, o seu momento de vida e a sua pergunta respondida.",
    cta: "Descobrir o que meu sonho quer dizer",
  },
  // B: promete tradução, não adivinhação. Mais ousada e mais próxima do
  // manifesto ("a Onírica é a chave que traduz").
  b: {
    eyebrow: "Análise onírica personalizada",
    titulo: "Seu sonho já te respondeu. Você só ainda não sabe ler.",
    subtitulo:
      "A Onírica traduz. Em 6 minutos, aquilo que ficou marcado em você vira uma leitura clara, feita a partir do seu sonho e da fase que você está vivendo agora.",
    cta: "Quero ler o meu sonho",
  },
};

export function landingCopy(variant: LandingVariant): LandingCopy {
  return LANDING_COPY[variant];
}

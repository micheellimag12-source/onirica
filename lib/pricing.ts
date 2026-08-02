/**
 * Fonte única dos preços da oferta.
 *
 * O preço de verdade é o que está cadastrado na Cakto: estes números existem
 * para o rastreamento (valor do Purchase/InitiateCheckout no Meta) e para a
 * copy dos upsells. Ao mudar o preço na Cakto, mudar aqui também, senão o Meta
 * otimiza com valor errado.
 */

export const PRICES = {
  /** Produto principal: análise completa + Mapa Onírico + diário de 7 dias. */
  core: 19.97,
  /** Order bump 1: áudio narrado. */
  audio: 14.97,
  /** Order bump 2: meditação guiada + higiene do sono. */
  meditation: 11.97,
} as const;

export const CURRENCY = "BRL";

/** Formata para exibição na copy: 14.97 -> "R$14,97". */
export function formatPrice(value: number): string {
  return `R$${value.toFixed(2).replace(".", ",")}`;
}

/**
 * Fonte única dos depoimentos, usada na landing e na tela de prévia (antes do
 * pagamento). Enquanto o array estiver vazio, as duas seções simplesmente não
 * renderizam, então é seguro deixá-las montadas.
 *
 * REGRA: só entra aqui depoimento REAL, de pessoa que passou pela análise e
 * autorizou o uso. Depoimento inventado numa página de venda é propaganda
 * enganosa, e é o tipo de coisa que derruba a confiança justamente no momento
 * em que ela mais importa. Se você tiver prints de WhatsApp, comentários ou
 * mensagens de quem já recebeu a análise, é só me passar que eu formato.
 *
 * Para ativar, preencha assim:
 *
 *   {
 *     texto: "Frase exata que a pessoa disse, sem 'melhorar' a escrita.",
 *     autor: "Ana C., 34 anos",
 *     contexto: "sonhou com água",
 *   }
 */

export interface Depoimento {
  /** Texto exato dito pela pessoa. Não editar para "melhorar". */
  texto: string;
  /** Como a pessoa autorizou ser identificada. Ex: "Ana C., 34 anos". */
  autor: string;
  /** Opcional: cidade, profissão, ou o sonho que ela analisou. */
  contexto?: string;
}

export const DEPOIMENTOS: Depoimento[] = [];

/** Os N primeiros, para a versão compacta perto do checkout. */
export function depoimentosDestaque(n = 2): Depoimento[] {
  return DEPOIMENTOS.slice(0, n);
}

import type { FullAnalysis } from "./full-analysis";

/**
 * Compacta a análise gerada num bloco de contexto curto, para alimentar os
 * geradores derivados (diário, narração, meditação) sem reenviar tudo.
 */
export function analysisContext(a: FullAnalysis): string {
  const simbolos = a.simbolos
    .map((s) => `- ${s.nome}: ${s.significado_curto}`)
    .join("\n");
  const orientacoes = a.orientacao.map((o) => `- ${o}`).join("\n");
  return [
    `Título do sonho: ${a.titulo}`,
    `Palavra-guia: ${a.palavra_guia}`,
    `Mensagem central: ${a.mensagem_central}`,
    `Símbolos:\n${simbolos}`,
    `Resposta à pergunta dela: ${a.resposta_pergunta}`,
    `Orientações dadas:\n${orientacoes}`,
  ].join("\n\n");
}

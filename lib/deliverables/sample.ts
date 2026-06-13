import type { QuizAnswers } from "@/types/quiz";

/** Resposta de exemplo (realista) para testar a geração dos entregáveis. */
export const SAMPLE_ANSWERS: QuizAnswers = {
  nome: "Mariana Alves",
  idade: "31-35",
  identificacao_espiritual: "crista_nao_praticante",
  email: "mariana@exemplo.com",

  areas_de_vida: ["carreira", "autoconhecimento"],
  evento_recente: "mudancas_relevantes",
  contexto_pessoal:
    "Recebi uma proposta para mudar de cidade e assumir um cargo maior, mas isso significa deixar pra trás a casa onde cresci e ficar longe da minha família. Tenho duas semanas pra decidir.",
  estado_emocional: "confusa",

  quando_sonhou: "ultimos_3_dias",
  sonho_descricao:
    "Eu estava na casa da minha infância, mas a água começava a subir, escura, vinda de algum lugar que eu não via. Eu tentava chegar numa escada que levava a uma porta no topo, e dessa porta vinha uma luz quente. Conforme eu subia, a água me puxava pra baixo. No meio da escada, minha avó, que já faleceu, aparecia sentada, calma, me olhando sem dizer nada. Eu acordei antes de chegar na porta.",
  emocao_durante_sonho: "angustia",
  sensacao_ao_acordar: "inquieta",
  personagens: ["apenas_eu", "falecidas"],
  elementos_simbolicos: ["agua", "casas", "luz_escuridao", "estradas"],

  recorrencia: "algumas_vezes",
  frequencia_lembranca: "frequentemente",
  tema_recorrente_geral: "água subindo, casas antigas",
  padrao_recente: "mais_intensos",

  pergunta_principal:
    "O que esse sonho está tentando me dizer sobre a decisão de mudar de cidade e seguir minha carreira?",
  expectativas: ["significado_simbolico", "orientacao_decisao", "compreensao_emocional"],
  nivel_crenca: 7,
  informacoes_adicionais:
    "Minha avó foi a pessoa que mais me incentivou a estudar e crescer.",
};

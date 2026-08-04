import type { BlockConfig, Question } from "@/types/quiz";

/**
 * Quiz enxuto (8 perguntas), focado em conversão:
 * - O sonho vem cedo (a pessoa investe no que veio buscar).
 * - O e-mail fica por último ("pra onde enviamos sua análise").
 * - Telas de espelho (storytelling) entre os blocos seguram o engajamento.
 *
 * Os campos mantêm os MESMOS nomes do gerador (formatAnswersForPrompt), então
 * a análise continua consistente, montada a partir do texto do sonho + contexto.
 */

export const BLOCKS: BlockConfig[] = [
  { id: 1, title: "Você e seu sonho", subtitle: "Pra começar, queremos te conhecer" },
  { id: 2, title: "O sonho", subtitle: "Conte com o máximo de detalhes que lembrar" },
  { id: 3, title: "Sua pergunta", subtitle: "Quase lá. Essa é a parte mais importante." },
];

export const QUESTIONS: Question[] = [
  // BLOCO 1 — Você e seu sonho
  {
    id: "q1",
    block: 1,
    blockOrder: 1,
    field: "nome",
    type: "text",
    inputType: "text",
    text: "Como podemos te chamar?",
    placeholder: "Seu primeiro nome",
    minLength: 2,
    required: true,
  },
  {
    id: "q2",
    block: 1,
    blockOrder: 2,
    field: "identificacao_espiritual",
    type: "single",
    text: "Como você se identifica espiritualmente hoje?",
    required: true,
    options: [
      {
        value: "crista_praticante",
        label: "Pratico minha fé cristã (evangélica, católica, etc.)",
      },
      {
        value: "crista_nao_praticante",
        label: "Acredito no cristianismo, mas não pratico",
      },
      {
        value: "espiritualizada",
        label: "Tenho espiritualidade sem religião definida",
      },
      { value: "em_busca", label: "Em busca / descobrindo" },
      { value: "cetica", label: "Sem religião / tenho visão cética" },
      {
        value: "outra",
        label: "Outra",
        extraField: {
          field: "identificacao_espiritual_outra",
          placeholder: "Conte um pouco...",
        },
      },
    ],
  },
  {
    id: "q3",
    block: 1,
    blockOrder: 3,
    field: "quando_sonhou",
    type: "single",
    text: "Quando você teve esse sonho?",
    required: true,
    options: [
      { value: "esta_noite", label: "Esta noite / madrugada" },
      { value: "ultimos_3_dias", label: "Nos últimos 3 dias" },
      { value: "ultima_semana", label: "Na última semana" },
      { value: "ultimo_mes", label: "No último mês" },
      { value: "ha_mais_tempo", label: "Há mais tempo, mas ele ficou marcado" },
    ],
  },

  // BLOCO 2 — O sonho
  {
    id: "q4",
    block: 2,
    blockOrder: 1,
    field: "sonho_descricao",
    type: "textarea",
    text: "Conte o seu sonho.",
    subtext:
      "Pode ser do seu jeito, sem se preocupar em escrever bonito. Quanto mais detalhe (quem aparecia, onde era, o que aconteceu), mais profunda fica a análise.",
    placeholder: "Comece descrevendo o que você lembra...",
    minLength: 40,
    maxLength: 3000,
    required: true,
  },
  {
    id: "q5",
    block: 2,
    blockOrder: 2,
    field: "emocao_durante_sonho",
    type: "single",
    text: "Qual foi a emoção mais forte que você sentiu durante o sonho?",
    required: true,
    options: [
      { value: "medo", label: "Medo / terror" },
      { value: "angustia", label: "Angústia / aflição" },
      { value: "tristeza", label: "Tristeza / luto" },
      { value: "confusao", label: "Confusão / estranheza" },
      { value: "alegria", label: "Alegria / paz" },
      { value: "curiosidade", label: "Curiosidade / fascínio" },
      { value: "raiva", label: "Raiva / frustração" },
      { value: "vergonha", label: "Vergonha / culpa" },
      { value: "amor", label: "Amor / conexão" },
    ],
  },
  {
    id: "q6",
    block: 2,
    blockOrder: 3,
    field: "sensacao_ao_acordar",
    type: "single",
    text: "E ao acordar, como você se sentiu?",
    required: true,
    options: [
      { value: "aliviada", label: "Com alívio por ter acordado" },
      {
        value: "triste_terminou",
        label: "Triste, como se algo bom tivesse terminado",
      },
      { value: "confusa", label: "Em confusão, sem entender" },
      {
        value: "inquieta",
        label: "Com inquietação, sem conseguir tirar o sonho da cabeça",
      },
      { value: "em_paz", label: "Em paz, com sensação de mensagem" },
      { value: "real_demais", label: "Sentindo que era “real demais”" },
    ],
  },

  // BLOCO 3 — Sua pergunta + e-mail
  {
    id: "q7",
    block: 3,
    blockOrder: 1,
    field: "pergunta_principal",
    type: "textarea",
    text: "Se você pudesse fazer UMA pergunta ao seu sonho, qual seria?",
    subtext: "Sua análise vai responder essa pergunta diretamente.",
    placeholder: "Por exemplo: por que esse sonho voltou agora?",
    minLength: 10,
    required: true,
  },
  {
    id: "q8",
    block: 3,
    blockOrder: 2,
    field: "email",
    type: "text",
    inputType: "email",
    text: "Pra onde enviamos sua análise?",
    subtext: "Em até alguns minutos sua análise completa chega no seu e-mail.",
    placeholder: "voce@exemplo.com",
    required: true,
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

// Intro screens content
export const QUIZ_INTRO_CONTENT = {
  title: "Boas-vindas à Onírica.",
  body: [
    "Em alguns minutos, você vai responder algumas perguntas sobre você e o sonho que te trouxe até aqui.",
    "Quanto mais sinceridade e detalhe você trouxer, mais profunda será sua análise.",
    "Tudo o que você compartilhar aqui é confidencial e usado apenas pra preparar sua experiência personalizada.",
    "Respira fundo. Vamos começar.",
  ],
  cta: "Quero começar",
};

/** Helper: find question by id */
export function findQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

/** Helper: question at index (0..7) */
export function questionAt(index: number): Question | undefined {
  return QUESTIONS[index];
}

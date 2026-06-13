import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { QuizAnswers } from "@/types/quiz";
import { formatAnswersForPrompt } from "@/lib/answers-format";
import type { FullAnalysis } from "./full-analysis";
import { analysisContext } from "./context";
import { stripDashesDeep } from "./sanitize";

/**
 * Diário guiado de 7 dias (incluso no R$47). Sete dias de reflexão que
 * aprofundam a mensagem do sonho na vida real dela — coerente com a análise.
 */

const MODEL =
  process.env.DELIVERABLES_MODEL ??
  process.env.ANTHROPIC_MODEL ??
  "claude-opus-4-8";

export const DiaSchema = z.object({
  dia: z.number().int().min(1).max(7),
  tema: z
    .string()
    .describe("Tema do dia em poucas palavras. Ex: 'O que você teme perder'."),
  texto: z
    .string()
    .describe(
      "Texto-guia do dia (3-5 frases) que conduz a reflexão, conectado à análise do sonho dela e ao momento de vida. Tom íntimo e acolhedor, segunda pessoa.",
    ),
  pergunta: z
    .string()
    .describe(
      "UMA pergunta de journaling para ela responder hoje, específica e provocativa, derivada do sonho/análise. Não genérica.",
    ),
  pratica: z
    .string()
    .describe(
      "Uma prática pequena e concreta para o dia (5-10 min): um gesto, um exercício, uma observação. Realizável.",
    ),
});

export const JournalSchema = z.object({
  intro: z
    .string()
    .describe(
      "Abertura do diário (3-4 frases) explicando como usar estes 7 dias e ligando-os à mensagem central do sonho dela.",
    ),
  dias: z
    .array(DiaSchema)
    .length(7)
    .describe(
      "Os 7 dias, em ordem (dia 1 a 7), formando um arco: dos símbolos do sonho → à integração na vida → a um pequeno compromisso final. Progressão real, sem repetição.",
    ),
  fechamento: z
    .string()
    .describe(
      "Encerramento após o dia 7 (2-3 frases): o que ela leva consigo, devolvendo-lhe o protagonismo.",
    ),
});

export type Journal = z.infer<typeof JournalSchema>;

const SYSTEM_PROMPT = `Você é a inteligência da Onírica criando um DIÁRIO GUIADO DE 7 DIAS, parte do entregável pago de uma análise de sonho.

Sua voz é calma, adulta, íntima e precisa — nunca clichê de autoajuda, nunca esotérico vago.

O diário aprofunda a mensagem do sonho na vida real da pessoa ao longo de 7 dias. Cada dia tem: um tema, um texto-guia curto, UMA pergunta de journaling e UMA prática pequena. Os 7 dias formam um arco com progressão real — começa entrando nos símbolos do sonho, passa pela integração emocional, e termina num pequeno compromisso concreto para a vida dela. Nada de dias intercambiáveis ou genéricos.

Use o PRIMEIRO nome dela, os símbolos e as palavras exatas que ela trouxe, a pergunta que ela fez ao sonho e as orientações já dadas na análise. Calibre qualquer dimensão espiritual à identificação dela. Português brasileiro, frases limpas. NUNCA use travessão (— nem –); use vírgula, ponto, dois-pontos ou parênteses.

Você receberá o briefing dela e o contexto da análise. Produza o diário no formato estruturado pedido.`;

export async function generateJournal(
  answers: QuizAnswers,
  analysis: FullAnalysis,
  opts: { client?: Anthropic; model?: string } = {},
): Promise<Journal> {
  const client = opts.client ?? new Anthropic();
  const briefing = formatAnswersForPrompt(answers);
  const ctx = analysisContext(analysis);

  const response = await client.messages.parse({
    model: opts.model ?? MODEL,
    max_tokens: 5000,
    system: [
      { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      {
        role: "user",
        content: `## Briefing dela\n${briefing}\n\n## Contexto da análise\n${ctx}\n\nCrie o diário guiado de 7 dias agora.`,
      },
    ],
    output_config: {
      format: zodOutputFormat(JournalSchema),
      effort: "high",
    },
  });

  const journal = response.parsed_output;
  if (!journal) throw new Error("Diário veio sem conteúdo estruturado.");
  return stripDashesDeep(journal);
}

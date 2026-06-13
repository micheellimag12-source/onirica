import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { QuizAnswers } from "@/types/quiz";
import { formatAnswersForPrompt } from "@/lib/answers-format";
import type { FullAnalysis } from "./full-analysis";
import { analysisContext } from "./context";
import { stripDashesDeep } from "./sanitize";

/**
 * Order bump 2 (R$29): texto para meditação e higiene do sono, personalizado.
 * Uma meditação guiada ligada à mensagem do sonho + práticas de higiene do sono
 * calibradas ao padrão de sonhos dela.
 */

const MODEL =
  process.env.DELIVERABLES_MODEL ??
  process.env.ANTHROPIC_MODEL ??
  "claude-opus-4-8";

export const PraticaSonoSchema = z.object({
  titulo: z.string().describe("Título curto da prática. Ex: 'A última hora acordada'."),
  descricao: z
    .string()
    .describe(
      "Descrição prática e concreta (2-4 frases) do que fazer e por quê. Baseada em evidência de higiene do sono, sem jargão.",
    ),
});

export const MeditationSchema = z.object({
  intro: z
    .string()
    .describe(
      "Abertura (2-3 frases) ligando esta meditação e o cuidado com o sono à mensagem do sonho dela.",
    ),
  meditacao: z.object({
    titulo: z
      .string()
      .describe("Título evocativo da meditação. Ex: 'Descer com calma antes de subir'."),
    roteiro: z
      .string()
      .describe(
        "Roteiro de meditação guiada (5-8 min), em prosa contínua para ser OUVIDO/lido em voz baixa antes de dormir. Conduz respiração, relaxamento e um encontro sereno com a imagem/mensagem central do sonho dela. Use o nome dela, segunda pessoa, reticências para as pausas. Sem listas. Calma e segura — nada que ative ansiedade.",
      ),
  }),
  higiene_sono: z.object({
    intro: z
      .string()
      .describe(
        "1-2 frases introduzindo a higiene do sono, conectando ao que ela relatou (sonhos intensos/recorrentes, inquietação ao acordar, etc.).",
      ),
    praticas: z
      .array(PraticaSonoSchema)
      .min(4)
      .max(6)
      .describe(
        "4-6 práticas de higiene do sono, algumas gerais e pelo menos duas ajustadas ao padrão dela (sonhos vívidos/recorrentes, despertar inquieto).",
      ),
  }),
  fechamento: z
    .string()
    .describe("Encerramento curto e acolhedor (1-2 frases)."),
});

export type Meditation = z.infer<typeof MeditationSchema>;

const SYSTEM_PROMPT = `Você é a inteligência da Onírica criando um material de MEDITAÇÃO E HIGIENE DO SONO personalizado, vendido como complemento de uma análise de sonho.

Duas partes: (1) uma meditação guiada para ouvir/ler antes de dormir, ligada à imagem e à mensagem central do sonho da pessoa; (2) um guia prático de higiene do sono, baseado em evidência, com algumas práticas ajustadas ao padrão de sonhos dela (vívidos, recorrentes, despertar inquieto).

Voz calma, adulta, segura. A meditação NUNCA pode ativar ansiedade: conduz para baixo, para o descanso. Use o PRIMEIRO nome dela e os detalhes reais que ela trouxe. Calibre qualquer dimensão espiritual à identificação dela. Português brasileiro, prosa limpa. Para as pausas use reticências; NUNCA use travessão (— nem –).

Você receberá o briefing dela e o contexto da análise. Produza o material no formato estruturado pedido.`;

export async function generateMeditation(
  answers: QuizAnswers,
  analysis: FullAnalysis,
  opts: { client?: Anthropic; model?: string } = {},
): Promise<Meditation> {
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
        content: `## Briefing dela\n${briefing}\n\n## Contexto da análise\n${ctx}\n\nCrie o material de meditação e higiene do sono agora.`,
      },
    ],
    output_config: {
      format: zodOutputFormat(MeditationSchema),
      effort: "medium",
    },
  });

  const meditation = response.parsed_output;
  if (!meditation) throw new Error("Meditação veio sem conteúdo estruturado.");
  return stripDashesDeep(meditation);
}

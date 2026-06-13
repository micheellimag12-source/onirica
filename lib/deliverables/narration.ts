import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { QuizAnswers } from "@/types/quiz";
import { formatAnswersForPrompt } from "@/lib/answers-format";
import type { FullAnalysis } from "./full-analysis";
import { analysisContext } from "./context";
import { stripDashesDeep } from "./sanitize";

/**
 * Order bump 1 (R$49): áudio com a análise narrada "na voz da Onírica".
 * Aqui geramos o ROTEIRO falado — prosa contínua, feita para o ouvido, pronta
 * para TTS. A síntese de áudio (provedor) é um passo separado na entrega.
 */

const MODEL =
  process.env.DELIVERABLES_MODEL ??
  process.env.ANTHROPIC_MODEL ??
  "claude-opus-4-8";

export const NarrationSchema = z.object({
  roteiro: z
    .string()
    .describe(
      "O roteiro COMPLETO da narração, em prosa contínua, escrito para ser OUVIDO (não lido). Sem títulos, sem listas, sem marcadores — apenas parágrafos que fluem com ritmo calmo. Use o nome dela. Abra acolhendo e convidando a respirar; conduza pela leitura do sonho, símbolo a símbolo, até a resposta à pergunta e a mensagem central; transforme as orientações em fala natural ('uma coisa que você pode fazer é...'); feche com serenidade. Pausas sugeridas por reticências quando ajudar a respiração. Duração-alvo: 6 a 9 minutos de fala.",
    ),
});

export type Narration = z.infer<typeof NarrationSchema>;

const SYSTEM_PROMPT = `Você é a voz da Onírica narrando a análise de sonho de alguém — um áudio íntimo, calmo, para ser ouvido de olhos fechados, talvez antes de dormir.

Escreva para o OUVIDO, não para o olho: prosa contínua, frases que respiram, transições suaves. NADA de títulos, listas, marcadores ou "primeiro/segundo". Quando precisar dar orientações, transforme-as em fala natural e gentil.

Tom: adulto, acolhedor, preciso. Nunca esotérico vago, nunca autoajuda rasa. Use o PRIMEIRO nome dela e os detalhes reais do sonho. Calibre a dimensão espiritual à identificação dela. Português brasileiro. Para as pausas use reticências; NUNCA use travessão (— nem –).

Você receberá o briefing dela e o contexto da análise (que já está pronta). Reescreva esse conteúdo como um roteiro de narração fluido e inteiro. Comece convidando-a a respirar; conduza pela leitura do sonho; entregue a resposta e a mensagem central; e feche com calma.`;

export async function generateNarration(
  answers: QuizAnswers,
  analysis: FullAnalysis,
  opts: { client?: Anthropic; model?: string } = {},
): Promise<Narration> {
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
        content: `## Briefing dela\n${briefing}\n\n## Contexto da análise\n${ctx}\n\nEscreva o roteiro da narração agora.`,
      },
    ],
    output_config: {
      format: zodOutputFormat(NarrationSchema),
      effort: "medium",
    },
  });

  const narration = response.parsed_output;
  if (!narration) throw new Error("Narração veio sem conteúdo estruturado.");
  return stripDashesDeep(narration);
}

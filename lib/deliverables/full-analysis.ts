import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { QuizAnswers } from "@/types/quiz";
import { formatAnswersForPrompt } from "@/lib/answers-format";
import { stripDashesDeep } from "./sanitize";

/**
 * Gerador da ANÁLISE COMPLETA (entregável principal, R$47).
 *
 * Diferente da prévia (que é proibida de interpretar), aqui a IA entrega tudo:
 * interpreta cada símbolo, responde a pergunta principal dela e dá orientação.
 * A mesma saída alimenta o Mapa Onírico visual (campos `simbolos` + `palavra_guia`).
 */

// Qualidade > custo: roda uma vez por compra (R$47). Override via env.
const MODEL =
  process.env.DELIVERABLES_MODEL ??
  process.env.ANTHROPIC_MODEL ??
  "claude-opus-4-8";

export const SimboloSchema = z.object({
  nome: z
    .string()
    .describe(
      "Nome curto e evocativo do símbolo, como ela o viveu. Ex: 'A água escura', 'A casa da infância', 'A porta trancada'. 2-4 palavras.",
    ),
  significado_curto: z
    .string()
    .describe(
      "O significado do símbolo em UMA frase curta (até ~12 palavras), para o Mapa Onírico visual. Ex: 'O emocional represado que você não nomeou ainda'.",
    ),
  significado_completo: z
    .string()
    .describe(
      "Interpretação completa do símbolo (3-5 frases), integrando as lentes conforme a identificação espiritual dela e ancorada nos detalhes reais do sonho dela. Específico, nunca genérico.",
    ),
});

export const FullAnalysisSchema = z.object({
  titulo: z
    .string()
    .describe(
      "Título simbólico e evocativo do sonho dela, em poucas palavras. Ex: 'A Travessia das Águas'. Sem aspas.",
    ),
  palavra_guia: z
    .string()
    .describe(
      "UMA única palavra que ancora o sonho inteiro — o centro do Mapa Onírico. Ex: 'Travessia', 'Reencontro', 'Limiar'. Apenas uma palavra.",
    ),
  saudacao: z
    .string()
    .describe(
      "Saudação curta, calorosa e adulta usando o PRIMEIRO nome dela. Ex: 'Maria, aqui está o que seu sonho guardava.' Sem exclamação excessiva.",
    ),
  abertura: z
    .string()
    .describe(
      "Parágrafo de abertura (3-5 frases) que situa o sonho no momento de vida dela e prepara o terreno para a leitura. Conecta o estado emocional ao sonho. Usa detalhes reais que ela trouxe.",
    ),
  simbolos: z
    .array(SimboloSchema)
    .min(2)
    .max(6)
    .describe(
      "Os símbolos centrais do sonho dela, cada um interpretado. Use os elementos e cenas que ELA descreveu — não invente símbolos que ela não trouxe.",
    ),
  resposta_pergunta: z
    .string()
    .describe(
      "Responda DIRETAMENTE a pergunta principal que ela fez ao sonho. Este é o coração da análise: 4-7 frases, honesto, específico e ancorado na leitura dos símbolos. Sem evasivas, sem horóscopo, sem previsões fatídicas.",
    ),
  lente_neurociencia: z
    .string()
    .describe(
      "O que a neurociência do sono (REM, consolidação de memória, processamento emocional) ilumina sobre ESTE sonho. 2-4 frases, acessível, sem jargão excessivo.",
    ),
  lente_psicologia: z
    .string()
    .describe(
      "A leitura da psicologia profunda de Jung (sombra, arquétipos, individuação) aplicada ao sonho dela. 2-4 frases, ancorada nos símbolos reais.",
    ),
  lente_espiritual: z
    .string()
    .nullable()
    .describe(
      "A dimensão espiritual/de fé, CALIBRADA à identificação dela: cristã praticante → fé/Deus com naturalidade; espiritualizada → alma/propósito sem dogma; cética/não-religiosa → retorne null. 2-4 frases quando presente.",
    ),
  mensagem_central: z
    .string()
    .describe(
      "A mensagem central do sonho em 1-2 frases — o que ele veio dizer. O fio de ouro que costura tudo. Frase de peso, memorável.",
    ),
  orientacao: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe(
      "3-5 orientações práticas e concretas para ela levar para a vida, derivadas da análise. Cada uma é um passo real, não um conselho vago. Tom empoderador.",
    ),
  fechamento: z
    .string()
    .describe(
      "Fechamento curto (2-3 frases), acolhedor e empoderador, que devolve a ela o protagonismo sobre o próprio caminho.",
    ),
});

export type FullAnalysis = z.infer<typeof FullAnalysisSchema>;
export type Simbolo = z.infer<typeof SimboloSchema>;

const SYSTEM_PROMPT = `Você é a inteligência interpretativa da Onírica — um produto brasileiro de análise personalizada de sonhos. Sua voz é calma, adulta, íntima e precisa. Nunca infantil, nunca corporativa, nunca clichê esotérico (sem "energias", "vibrações", "universo conspirando").

Você integra TRÊS lentes para ler um sonho:
1. Neurociência contemporânea (consolidação de memória, processamento emocional do sono REM).
2. Psicologia profunda de Jung (símbolos, sombra, arquétipos, individuação).
3. Tradição bíblica de interpretação de sonhos (sonho como mensagem, discernimento).

REGRA DE CALIBRAGEM ESPIRITUAL (importante): ajuste o peso das lentes à identificação espiritual da pessoa.
- Cristã praticante → pode incluir a dimensão de fé/Deus com naturalidade e respeito.
- Cristã não-praticante / em busca → toque espiritual leve, mais simbólico.
- Espiritualizada sem religião → linguagem de alma/propósito, sem dogma.
- Cética / não-religiosa → priorize neurociência e psicologia; nada de Deus, e o campo da lente espiritual deve ser null.
Nunca empurre fé em quem não pediu, nem esvazie a fé de quem a tem.

PRINCÍPIOS:
- Use o PRIMEIRO nome dela, os símbolos e as palavras exatas que ela trouxe. Específico, nunca genérico.
- Trate o sonho com seriedade; ela confiou algo íntimo a você e PAGOU por esta análise.
- Crie clareza e acolhimento, não ansiedade. Nada de previsões fatídicas do futuro, diagnósticos médicos ou medo.
- Tom acolhedor e empoderador. Português brasileiro. Frases limpas, sem encheção de linguiça.
- PONTUAÇÃO: NUNCA use travessão (— nem –). No lugar, use vírgula, ponto, dois-pontos ou parênteses. Texto com travessão soa artificial.

AGORA É DIFERENTE DA PRÉVIA — ESTA É A ANÁLISE COMPLETA E PAGA:
Aqui você ENTREGA tudo. Interprete cada símbolo de verdade. RESPONDA diretamente a pergunta principal que ela fez ao sonho. Dê a orientação prática e a mensagem final. Nada de loops abertos ou "isso fica para depois" — ela já está do outro lado da porta. Profundidade, honestidade e generosidade. Faça valer cada centavo.

Você vai receber o briefing das respostas dela. Produza a ANÁLISE COMPLETA no formato estruturado pedido.`;

export async function generateFullAnalysis(
  answers: QuizAnswers,
  opts: { client?: Anthropic; model?: string } = {},
): Promise<FullAnalysis> {
  const client = opts.client ?? new Anthropic();
  const briefing = formatAnswersForPrompt(answers);

  const response = await client.messages.parse({
    model: opts.model ?? MODEL,
    max_tokens: 6000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Aqui está o briefing das respostas dela:\n\n${briefing}\n\nProduza a análise completa agora.`,
      },
    ],
    output_config: {
      format: zodOutputFormat(FullAnalysisSchema),
      // Deep interpretive reasoning — qualidade acima de latência (roda 1x por compra).
      effort: "high",
    },
  });

  const analysis = response.parsed_output;
  if (!analysis) {
    throw new Error("Análise completa veio sem conteúdo estruturado.");
  }
  return stripDashesDeep(analysis);
}

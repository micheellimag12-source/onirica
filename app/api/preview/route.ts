import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { QuizSubmissionSchema } from "@/lib/validation";
import { formatAnswersForPrompt } from "@/lib/answers-format";
import { stripDashesDeep } from "@/lib/deliverables/sanitize";

export const runtime = "nodejs";
// The model runs on every lead — cost lever. Override via env.
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-6";

const PreviewSchema = z.object({
  saudacao: z
    .string()
    .describe(
      "Saudação curta, calorosa e adulta usando o PRIMEIRO nome dela. Ex: 'Maria, respira fundo.' Sem exclamação excessiva.",
    ),
  titulo: z
    .string()
    .describe(
      "Título simbólico e evocativo para o mapa do sonho dela, em poucas palavras. Ex: 'A Travessia das Águas'. Sem aspas.",
    ),
  espelho: z
    .string()
    .describe(
      "Um parágrafo (2-4 frases) que ESPELHA e valida o que ela está sentindo, conectando o estado emocional dela ao sonho. Deve dar a sensação de 'como você sabe disso?'. Use detalhes reais que ela trouxe.",
    ),
  insight: z
    .string()
    .describe(
      "UMA observação genuína e específica que serve de PORTA DE ENTRADA (2-4 frases). Deve ter valor real e provar competência, mas é apenas uma ABERTURA — NÃO interprete o sonho por inteiro, NÃO revele o significado de cada símbolo, NÃO responda a pergunta principal dela. Deixe-a querendo o resto. Integra as lentes conforme a identificação espiritual dela.",
    ),
  gancho: z
    .string()
    .describe(
      "Um loop aberto (2-3 frases) que revela QUE EXISTE uma camada mais profunda ligada à pergunta principal dela, sem entregá-la de jeito nenhum. Cria fome de saber o resto. Termina apontando para a análise completa.",
    ),
  itens_bloqueados: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe(
      "3 a 5 itens curtos descrevendo O QUE a análise completa vai revelar, personalizados ao sonho dela — são CHAMARIZES, não o conteúdo em si. Ex: 'O que a porta de luz no topo da escada representa no seu momento atual'. Cada item desperta desejo sem entregar a resposta.",
    ),
});

const SYSTEM_PROMPT = `Você é a inteligência interpretativa da Onírica — um produto brasileiro de análise personalizada de sonhos. Sua voz é calma, adulta, íntima e precisa. Nunca infantil, nunca corporativa, nunca clichê esotérico (sem "energias", "vibrações", "universo conspirando").

Você integra TRÊS lentes para ler um sonho:
1. Neurociência contemporânea (consolidação de memória, processamento emocional do sono REM).
2. Psicologia profunda de Jung (símbolos, sombra, arquétipos, individuação).
3. Tradição bíblica de interpretação de sonhos (sonho como mensagem, discernimento).

REGRA DE CALIBRAGEM ESPIRITUAL (importante): ajuste o peso das lentes à identificação espiritual da pessoa.
- Cristã praticante → pode incluir a dimensão de fé/Deus com naturalidade e respeito.
- Cristã não-praticante / em busca → toque espiritual leve, mais simbólico.
- Espiritualizada sem religião → linguagem de alma/propósito, sem dogma.
- Cética / não-religiosa → priorize neurociência e psicologia; nada de Deus.
Nunca empurre fé em quem não pediu, nem esvazie a fé de quem a tem.

PRINCÍPIOS:
- Use o PRIMEIRO nome dela, os símbolos e as palavras exatas que ela trouxe. Específico, nunca genérico.
- Entregue UM insight verdadeiro de graça (valor real, resolve um pedacinho). O resto fica para a análise completa.
- Crie curiosidade honesta, não ansiedade. Nada de previsões fatídicas do futuro, diagnósticos médicos ou medo.
- Tom acolhedor e empoderador. Português brasileiro. Frases limpas.
- NUNCA use travessão (— nem –); use vírgula, ponto, dois-pontos ou parênteses.
- Trate o sonho com seriedade; ela confiou algo íntimo a você.

REGRA DE OURO — ISTO É UMA PRÉVIA, NÃO A ANÁLISE:
Seu objetivo é criar DESEJO, não saciar. Entregue o suficiente para ela sentir que você entendeu o sonho dela e que existe ouro ali — mas NUNCA entregue a interpretação completa. Especificamente, é PROIBIDO nesta prévia:
- Interpretar o significado de cada símbolo do sonho.
- Responder a pergunta principal que ela fez ao sonho.
- Dar a orientação prática / a "mensagem final".
Tudo isso pertence à análise completa (paga). A prévia é a porta entreaberta: mostra que há uma sala do outro lado, sem deixar ela entrar.

Você vai receber o briefing das respostas dela. Produza a PRÉVIA seguindo o formato estruturado pedido.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { success: false, error: "Serviço de análise indisponível no momento." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Payload inválido" },
      { status: 400 },
    );
  }

  const parsed = QuizSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Dados inválidos" },
      { status: 400 },
    );
  }

  const client = new Anthropic();
  const briefing = formatAnswersForPrompt(parsed.data);

  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 1400,
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
          content: `Aqui está o briefing das respostas dela:\n\n${briefing}\n\nGere a prévia personalizada agora.`,
        },
      ],
      output_config: {
        format: zodOutputFormat(PreviewSchema),
        // Creative copy, not deep reasoning — low effort keeps latency down on
        // this conversion screen that every lead waits on.
        effort: "low",
      },
    });

    const preview = response.parsed_output;
    if (!preview) {
      throw new Error("Resposta sem conteúdo estruturado.");
    }

    return NextResponse.json({ success: true, preview: stripDashesDeep(preview) });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { success: false, error: "Muitas análises agora. Tente em instantes." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { success: false, error: "Serviço de análise mal configurado." },
        { status: 503 },
      );
    }
    // Log details server-side only; never leak internal/API errors to the client.
    console.error("[preview] generation failed:", error);
    return NextResponse.json(
      { success: false, error: "Não consegui preparar sua prévia agora." },
      { status: 500 },
    );
  }
}

import type { QuizAnswers } from "@/types/quiz";
import { QUESTIONS } from "./quiz-config";

/**
 * Turns the raw quiz answers into a readable Portuguese briefing for the AI,
 * resolving option values to their human labels. Used to build the prompt that
 * generates the personalized preview.
 */

const LABELS: Record<string, Record<string, string>> = (() => {
  const map: Record<string, Record<string, string>> = {};
  for (const q of QUESTIONS) {
    if (q.type === "single" || q.type === "multi") {
      map[q.field] = Object.fromEntries(q.options.map((o) => [o.value, o.label]));
    }
  }
  return map;
})();

function label(field: string, value: string | undefined): string {
  if (!value) return "—";
  return LABELS[field]?.[value] ?? value;
}

function labelList(field: string, values: string[] | undefined): string {
  if (!values?.length) return "—";
  return values.map((v) => LABELS[field]?.[v] ?? v).join(", ");
}

/** Builds the human-readable briefing block sent as the user message. */
export function formatAnswersForPrompt(a: QuizAnswers): string {
  const lines: string[] = [];
  const push = (k: string, v: string) => {
    if (v && v !== "—") lines.push(`- ${k}: ${v}`);
  };

  lines.push("## Sobre ela");
  push("Nome", a.nome ?? "");
  push("Idade", a.idade ?? "");
  push("Identificação espiritual", label("identificacao_espiritual", a.identificacao_espiritual));
  if (a.identificacao_espiritual_outra) push("Detalhe espiritual", a.identificacao_espiritual_outra);

  lines.push("\n## Momento de vida");
  push("Áreas em foco", labelList("areas_de_vida", a.areas_de_vida));
  push("Evento recente (90 dias)", label("evento_recente", a.evento_recente));
  push("Contexto pessoal", a.contexto_pessoal ?? "");
  push("Estado emocional predominante", label("estado_emocional", a.estado_emocional));

  lines.push("\n## O sonho");
  push("Quando sonhou", label("quando_sonhou", a.quando_sonhou));
  push("Descrição do sonho", a.sonho_descricao ?? "");
  push("Emoção mais forte no sonho", label("emocao_durante_sonho", a.emocao_durante_sonho));
  push("Sensação ao acordar", label("sensacao_ao_acordar", a.sensacao_ao_acordar));
  push("Quem aparecia", labelList("personagens", a.personagens));
  push("Símbolos marcantes", labelList("elementos_simbolicos", a.elementos_simbolicos));

  lines.push("\n## Padrões");
  push("Recorrência", label("recorrencia", a.recorrencia));
  push("Costuma lembrar dos sonhos", label("frequencia_lembranca", a.frequencia_lembranca));
  push("Tema recorrente geral", a.tema_recorrente_geral ?? "");
  push("Padrão recente", label("padrao_recente", a.padrao_recente));

  lines.push("\n## A pergunta dela");
  push("Pergunta principal ao sonho", a.pergunta_principal ?? "");
  push("O que espera descobrir", labelList("expectativas", a.expectativas));
  push("Crença de que sonhos têm significado (0-10)", a.nivel_crenca?.toString() ?? "");
  push("Algo mais que quis contar", a.informacoes_adicionais ?? "");

  return lines.join("\n");
}

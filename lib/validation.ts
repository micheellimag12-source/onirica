import { z } from "zod";
import type { AnswerValue, Question } from "@/types/quiz";

/**
 * Full Zod schema applied at submit-time on the API route.
 * Mirrors the briefing's validation rules.
 */
export const QuizSubmissionSchema = z.object({
  // Bloco 1
  nome: z.string().min(2, "Mínimo 2 caracteres"),
  idade: z.string().min(1, "Selecione uma opção"),
  identificacao_espiritual: z.string().min(1, "Selecione uma opção"),
  identificacao_espiritual_outra: z.string().optional(),
  email: z.string().email("E-mail inválido"),

  // Bloco 2
  areas_de_vida: z
    .array(z.string())
    .min(1, "Selecione pelo menos 1")
    .max(2, "Selecione no máximo 2"),
  evento_recente: z.string().min(1, "Selecione uma opção"),
  contexto_pessoal: z.string().max(1000).optional(),
  estado_emocional: z.string().min(1, "Selecione uma opção"),

  // Bloco 4
  quando_sonhou: z.string().min(1, "Selecione uma opção"),
  sonho_descricao: z
    .string()
    .min(100, "Conte com mais detalhes (mínimo 100 caracteres)")
    .max(3000, "Máximo 3000 caracteres"),
  emocao_durante_sonho: z.string().min(1, "Selecione uma opção"),
  sensacao_ao_acordar: z.string().min(1, "Selecione uma opção"),
  personagens: z.array(z.string()).min(1, "Selecione pelo menos 1"),
  elementos_simbolicos: z.array(z.string()).min(1, "Selecione pelo menos 1"),

  // Bloco 5
  recorrencia: z.string().min(1, "Selecione uma opção"),
  frequencia_lembranca: z.string().min(1, "Selecione uma opção"),
  tema_recorrente_geral: z.string().optional(),
  padrao_recente: z.string().min(1, "Selecione uma opção"),

  // Bloco 6
  pergunta_principal: z.string().min(20, "Mínimo 20 caracteres"),
  expectativas: z
    .array(z.string())
    .min(1, "Selecione pelo menos 1")
    .max(3, "Selecione no máximo 3"),
  nivel_crenca: z.number().min(0).max(10),
  informacoes_adicionais: z.string().max(1000).optional(),
});

export type ValidatedQuizAnswers = z.infer<typeof QuizSubmissionSchema>;

/**
 * Lightweight per-question validator used by the UI to gate "Avançar".
 * Returns a Portuguese error message or null if valid.
 */
export function validateAnswer(
  question: Question,
  value: AnswerValue,
): string | null {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (!question.required && isEmpty) return null;

  if (question.required && isEmpty) {
    return "Resposta obrigatória";
  }

  switch (question.type) {
    case "text": {
      if (typeof value !== "string") return "Resposta inválida";
      if (question.inputType === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
      }
      if (question.minLength && value.length < question.minLength) {
        return `Mínimo ${question.minLength} caracteres`;
      }
      if (question.maxLength && value.length > question.maxLength) {
        return `Máximo ${question.maxLength} caracteres`;
      }
      return null;
    }
    case "textarea": {
      if (typeof value !== "string") return "Resposta inválida";
      if (question.minLength && value.length < question.minLength) {
        return `Mínimo ${question.minLength} caracteres`;
      }
      if (question.maxLength && value.length > question.maxLength) {
        return `Máximo ${question.maxLength} caracteres`;
      }
      return null;
    }
    case "single": {
      if (typeof value !== "string") return "Selecione uma opção";
      return null;
    }
    case "multi": {
      if (!Array.isArray(value)) return "Selecione pelo menos uma opção";
      if (question.minSelections && value.length < question.minSelections) {
        return `Selecione no mínimo ${question.minSelections}`;
      }
      if (question.maxSelections && value.length > question.maxSelections) {
        return `Selecione no máximo ${question.maxSelections}`;
      }
      return null;
    }
    case "scale": {
      if (typeof value !== "number") return "Selecione um valor";
      if (value < question.min || value > question.max) {
        return "Fora do intervalo";
      }
      return null;
    }
  }
}

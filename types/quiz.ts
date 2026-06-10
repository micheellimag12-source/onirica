/**
 * Core types for the Onírica quiz state machine, answers and question config.
 */

// ---------- Answers ----------

export interface QuizAnswers {
  // Bloco 1 — Sobre você
  nome?: string;
  idade?: string;
  identificacao_espiritual?: string;
  identificacao_espiritual_outra?: string;
  email?: string;

  // Bloco 2 — Seu momento de vida
  areas_de_vida?: string[];
  evento_recente?: string;
  contexto_pessoal?: string;
  estado_emocional?: string;

  // Bloco 4 — O sonho
  quando_sonhou?: string;
  sonho_descricao?: string;
  emocao_durante_sonho?: string;
  sensacao_ao_acordar?: string;
  personagens?: string[];
  elementos_simbolicos?: string[];

  // Bloco 5 — Padrões
  recorrencia?: string;
  frequencia_lembranca?: string;
  tema_recorrente_geral?: string;
  padrao_recente?: string;

  // Bloco 6 — Sua pergunta
  pergunta_principal?: string;
  expectativas?: string[];
  nivel_crenca?: number;
  informacoes_adicionais?: string;
}

export type AnswerField = keyof QuizAnswers;
export type AnswerValue = string | string[] | number | undefined;

// ---------- State machine ----------

export type QuizStep =
  | { kind: "initial" }
  | { kind: "intro" }
  | { kind: "question"; index: number } // 0..21
  | { kind: "interstitial"; id: string } // storytelling/mirror screens between blocks
  | { kind: "generating" } // submitting answers + generating the AI preview
  | { kind: "preview" }; // personalized preview + paywall (Cakto checkout)

export interface QuizMachineState {
  step: QuizStep;
  answers: QuizAnswers;
  /** True while answers are being submitted and the preview is generating. */
  generating: boolean;
  /** AI-generated preview content, once ready. */
  preview: PreviewContent | null;
  /** Server-issued id for this submission (analysis). */
  analysisId: string | null;
  /** Non-null when generation failed — drives the retry screen. */
  generateError: string | null;
}

// ---------- AI preview ----------

/**
 * Personalized teaser shown before the paywall. Mirrors the user's dream,
 * delivers ONE real insight, then cuts at the climax — the rest is unlocked
 * via checkout.
 */
export interface PreviewContent {
  /** Warm, personal greeting using her name. */
  saudacao: string;
  /** Symbolic title for her dream map. */
  titulo: string;
  /** Mirror paragraph — names and validates what she's feeling. */
  espelho: string;
  /** The single real insight delivered for free (resolves a sliver of the pain). */
  insight: string;
  /** Open loop — what the full analysis reveals, teased but not given. */
  gancho: string;
  /** Bullets describing what's locked inside the full analysis. */
  itens_bloqueados: string[];
}

// ---------- Question config ----------

export type BlockId = 1 | 2 | 3 | 4 | 5 | 6;

export interface BlockConfig {
  id: BlockId;
  title: string;
  subtitle?: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  /** When selected, exposes an extra text field stored under `extraField.field`. */
  extraField?: {
    field: AnswerField;
    placeholder: string;
  };
}

interface QuestionBase {
  id: string; // q1..q22
  block: Exclude<BlockId, 3>; // questions never live in block 3 (intro only)
  blockOrder: number; // 1-based order within block
  field: AnswerField;
  text: string;
  subtext?: string;
  required: boolean;
}

export type TextQuestion = QuestionBase & {
  type: "text";
  inputType: "text" | "email";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
};

export type TextareaQuestion = QuestionBase & {
  type: "textarea";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
};

export type SingleChoiceQuestion = QuestionBase & {
  type: "single";
  options: QuestionOption[];
};

export type MultiChoiceQuestion = QuestionBase & {
  type: "multi";
  options: QuestionOption[];
  minSelections?: number;
  maxSelections?: number;
};

export type ScaleQuestion = QuestionBase & {
  type: "scale";
  min: number;
  max: number;
};

export type Question =
  | TextQuestion
  | TextareaQuestion
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | ScaleQuestion;

// ---------- API ----------

export interface QuizSubmissionResponse {
  success: boolean;
  analysis_id?: string;
  error?: string;
}

export interface PreviewResponse {
  success: boolean;
  preview?: PreviewContent;
  error?: string;
}

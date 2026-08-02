import type {
  AnswerField,
  AnswerValue,
  PreviewContent,
  QuizAnswers,
  QuizMachineState,
  QuizStep,
} from "@/types/quiz";
import { TOTAL_QUESTIONS } from "./quiz-config";
import { getInterstitial, interstitialAfter } from "./storytelling";

// Index ranges per block (inclusive start, exclusive end). Quiz enxuto (8 Q).
const BLOCK_RANGES: ReadonlyArray<{
  block: 1 | 2 | 3 | 4 | 5 | 6;
  start: number;
  end: number;
}> = [
  { block: 1, start: 0, end: 3 }, // q1..q3 (você e seu sonho)
  { block: 2, start: 3, end: 6 }, // q4..q6 (o sonho)
  { block: 3, start: 6, end: 8 }, // q7..q8 (pergunta + e-mail)
];

export const INITIAL_STATE: QuizMachineState = {
  step: { kind: "initial" },
  answers: {},
  generating: false,
  preview: null,
  analysisId: null,
  generateError: null,
};

export type QuizAction =
  | { type: "START" } // INITIAL → intro
  | { type: "BEGIN_QUIZ" } // intro → q1
  | { type: "NEXT" } // generic forward
  | { type: "BACK" } // generic backward
  | { type: "ANSWER"; field: AnswerField; value: AnswerValue }
  | { type: "GENERATE_START" }
  | { type: "GENERATE_ERROR"; message: string }
  | { type: "PREVIEW_READY"; preview: PreviewContent; analysisId: string }
  | { type: "RESET" }
  | { type: "HYDRATE"; step: QuizStep; answers: QuizAnswers };

function nextStep(step: QuizStep): QuizStep {
  switch (step.kind) {
    case "initial":
      return { kind: "intro" };
    case "intro":
      return { kind: "question", index: 0 };
    case "question": {
      const inter = interstitialAfter(step.index);
      if (inter) return { kind: "interstitial", id: inter.id };
      if (step.index >= TOTAL_QUESTIONS - 1) return { kind: "generating" };
      return { kind: "question", index: step.index + 1 };
    }
    case "interstitial": {
      const inter = getInterstitial(step.id);
      const next = (inter?.afterIndex ?? -1) + 1;
      if (next >= TOTAL_QUESTIONS) return { kind: "generating" };
      return { kind: "question", index: next };
    }
    case "generating":
      return { kind: "preview" };
    case "preview":
      return step;
  }
}

function previousStep(step: QuizStep): QuizStep {
  switch (step.kind) {
    case "initial":
      return step;
    case "intro":
      return { kind: "initial" };
    case "question": {
      if (step.index === 0) return { kind: "intro" };
      const interBefore = interstitialAfter(step.index - 1);
      if (interBefore) return { kind: "interstitial", id: interBefore.id };
      return { kind: "question", index: step.index - 1 };
    }
    case "interstitial": {
      const inter = getInterstitial(step.id);
      return { kind: "question", index: inter?.afterIndex ?? 0 };
    }
    case "generating":
    case "preview":
      // Back is blocked once generation begins — answers are already in flight.
      return step;
  }
}

export function quizReducer(
  state: QuizMachineState,
  action: QuizAction,
): QuizMachineState {
  switch (action.type) {
    case "START":
      return { ...state, step: { kind: "intro" } };

    case "BEGIN_QUIZ":
      return { ...state, step: { kind: "question", index: 0 } };

    case "NEXT":
      return { ...state, step: nextStep(state.step) };

    case "BACK":
      return { ...state, step: previousStep(state.step) };

    case "ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.field]: action.value },
      };

    case "GENERATE_START":
      return { ...state, generating: true, generateError: null };

    case "GENERATE_ERROR":
      return { ...state, generating: false, generateError: action.message };

    case "PREVIEW_READY":
      return {
        ...state,
        generating: false,
        generateError: null,
        preview: action.preview,
        analysisId: action.analysisId,
        step: { kind: "preview" },
      };

    case "RESET":
      // Send the user back to the last question, clearing the error.
      return {
        ...state,
        generating: false,
        generateError: null,
        step: { kind: "question", index: TOTAL_QUESTIONS - 1 },
      };

    case "HYDRATE":
      return {
        ...INITIAL_STATE,
        step: action.step,
        answers: action.answers,
      };

    default:
      return state;
  }
}

// ---------- Progress ----------

export interface QuizProgress {
  /** 1..22, or null on intro/interstitial screens */
  questionNumber: number | null;
  total: number;
  /** 6 floats in [0,1] — fill ratio for each macro segment */
  segments: number[];
}

/**
 * Returns null when the progress bar should NOT be shown
 * (initial / intro / generating / preview screens).
 */
export function computeProgress(step: QuizStep): QuizProgress | null {
  if (step.kind === "initial" || step.kind === "intro") return null;
  if (step.kind === "generating" || step.kind === "preview") return null;

  // Determine "questions completed" cursor (0..22)
  let cursor: number;
  let questionNumber: number | null;

  if (step.kind === "interstitial") {
    const inter = getInterstitial(step.id);
    cursor = (inter?.afterIndex ?? -1) + 1;
    questionNumber = null;
  } else {
    cursor = step.index;
    questionNumber = step.index + 1;
  }

  const segments = BLOCK_RANGES.map(({ start, end }) => {
    const total = end - start;
    if (total === 0) return 0;
    const done = Math.max(0, Math.min(total, cursor - start));
    return done / total;
  });

  return { questionNumber, total: TOTAL_QUESTIONS, segments };
}

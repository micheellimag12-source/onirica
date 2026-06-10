import type { QuizAnswers, QuizStep } from "@/types/quiz";

const STATE_KEY = "onirica_quiz_state";
// Bump when answer shape or option values change (invalidates cached state).
const SCHEMA_VERSION = 3;

interface StoredQuizState {
  version: number;
  step: QuizStep;
  answers: QuizAnswers;
}

export interface ResumablePayload {
  step: QuizStep;
  answers: QuizAnswers;
}

/** Read persisted quiz state. SSR-safe (returns null on server). */
export function loadQuizState(): ResumablePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredQuizState;
    if (parsed.version !== SCHEMA_VERSION) return null;
    if (!parsed.step || !parsed.answers) return null;
    return { step: parsed.step, answers: parsed.answers };
  } catch {
    return null;
  }
}

export function saveQuizState(
  step: QuizStep,
  answers: QuizAnswers,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredQuizState = {
      version: SCHEMA_VERSION,
      step,
      answers,
    };
    window.localStorage.setItem(STATE_KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded or private mode — fail silent
  }
}

export function clearQuizState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STATE_KEY);
  } catch {
    // ignore
  }
}

/**
 * True when the user has at least one answer AND is not on the initial screen.
 * Used to decide whether to show the "continuar de onde parou?" modal.
 */
export function hasResumableProgress(): boolean {
  const payload = loadQuizState();
  if (!payload) return false;
  if (payload.step.kind === "initial") return false;
  return Object.keys(payload.answers).length > 0;
}

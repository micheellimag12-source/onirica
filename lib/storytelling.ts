import type { QuizAnswers } from "@/types/quiz";
import { QUESTIONS } from "./quiz-config";

/**
 * Storytelling interstitials — the "mirror" screens shown between quiz blocks.
 *
 * These are the core conversion mechanic for a low-ticket impulse funnel: they
 * reflect the user's own answers back to her ("how does it know this?"), validate
 * the pain, and open curiosity loops that only the paid analysis resolves.
 *
 * Each interstitial appears AFTER the question at `afterIndex` (when moving
 * forward) and its copy is built dynamically from her answers.
 */

// ---------- Label resolution (answer value → human phrase) ----------

const LABELS: Record<string, Record<string, string>> = (() => {
  const map: Record<string, Record<string, string>> = {};
  for (const q of QUESTIONS) {
    if (q.type === "single" || q.type === "multi") {
      map[q.field] = Object.fromEntries(
        q.options.map((o) => [o.value, o.label]),
      );
    }
  }
  return map;
})();

/** Human label for a single-choice value, falling back to the raw value. */
function label(field: string, value: string | undefined): string {
  if (!value) return "";
  return LABELS[field]?.[value] ?? value;
}

/** Lowercased first word, useful for weaving labels mid-sentence. */
function lower(s: string): string {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

const firstName = (a: QuizAnswers) => (a.nome ?? "").trim().split(/\s+/)[0] ?? "";

// ---------- Interstitial config ----------

export interface Interstitial {
  id: string;
  /** Appears after the question at this 0-based index when moving forward. */
  afterIndex: number;
  eyebrow?: (a: QuizAnswers) => string | undefined;
  title: (a: QuizAnswers) => string;
  /** Paragraphs of body copy. */
  body: (a: QuizAnswers) => string[];
  cta: string;
}

export const INTERSTITIALS: Interstitial[] = [
  // After block 1 (nome + identificação + quando sonhou) — reward the first
  // commitment and open the dream chapter.
  {
    id: "after-identity",
    afterIndex: 2,
    eyebrow: () => "Prazer em te conhecer",
    title: (a) => {
      const n = firstName(a);
      return n ? `${n}, isso aqui é só seu.` : "Isso aqui é só seu.";
    },
    body: () => [
      "A maioria das pessoas ignora o que sonha. Você não. Esse pequeno gesto, parar pra prestar atenção, já diz muito sobre o momento em que você está.",
      "Agora vem a parte mais importante: o sonho em si. Pense naquele que ficou marcado em você e conte com o máximo de detalhes que conseguir lembrar.",
    ],
    cta: "Vou contar meu sonho",
  },

  // After block 2 (the dream + emotion + waking) — THE mirror. Reflect her
  // emotion back and open the loop, then tee up her question.
  {
    id: "after-dream",
    afterIndex: 5,
    eyebrow: () => "Já estou começando a ver",
    title: (a) => {
      const n = firstName(a);
      return n
        ? `${n}, seu sonho tem uma assinatura.`
        : "Seu sonho tem uma assinatura.";
    },
    body: (a) => {
      const emocao = lower(label("emocao_durante_sonho", a.emocao_durante_sonho));
      const acordar = lower(label("sensacao_ao_acordar", a.sensacao_ao_acordar));
      const out: string[] = [];
      if (emocao) {
        out.push(
          `A emoção mais forte que você sentiu (${emocao}) não é detalhe: é a chave do sonho. Ela aponta para o que essa parte de você está tentando te dizer.`,
        );
      } else {
        out.push(
          "A forma como o seu sonho começa, o que acontece e como termina já revela um padrão. Nada ali é aleatório.",
        );
      }
      if (acordar) {
        out.push(
          `E o jeito que você acordou (${acordar}) confirma: esse sonho deixou um rastro. Esse rastro tem significado.`,
        );
      }
      out.push(
        "Falta só uma coisa para eu traduzir isso por inteiro: a única pergunta que você faria ao seu sonho. É ela que sua análise vai responder, diretamente.",
      );
      return out;
    },
    cta: "Quase lá, continuar",
  },
];

const BY_AFTER_INDEX = new Map<number, Interstitial>(
  INTERSTITIALS.map((i) => [i.afterIndex, i]),
);
const BY_ID = new Map<string, Interstitial>(
  INTERSTITIALS.map((i) => [i.id, i]),
);

/** Interstitial that should appear after the question at `index`, if any. */
export function interstitialAfter(index: number): Interstitial | undefined {
  return BY_AFTER_INDEX.get(index);
}

export function getInterstitial(id: string): Interstitial | undefined {
  return BY_ID.get(id);
}

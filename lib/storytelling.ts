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

/** Human labels for a multi-choice array. */
function labels(field: string, values: string[] | undefined): string[] {
  if (!values?.length) return [];
  return values.map((v) => LABELS[field]?.[v] ?? v).filter(Boolean);
}

/** Lowercased first word, useful for weaving labels mid-sentence. */
function lower(s: string): string {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

/** Natural-language join: ["a","b","c"] → "a, b e c". */
function joinPt(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
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
  // After block 1 (identity + email) — set the frame, reward the first commitment.
  {
    id: "after-identity",
    afterIndex: 3,
    eyebrow: () => "Prazer em te conhecer",
    title: (a) => {
      const n = firstName(a);
      return n ? `${n}, isso aqui é só seu.` : "Isso aqui é só seu.";
    },
    body: () => [
      "Antes de falar do seu sonho, queria te dizer uma coisa: a maioria das pessoas ignora o que sonha. Você não.",
      "Esse pequeno gesto — parar pra prestar atenção — já diz muito sobre o momento em que você está.",
      "Agora vamos entender esse momento.",
    ],
    cta: "Continuar",
  },

  // After block 2 (life moment) — mirror her state, then open the dream chapter.
  // (Replaces the old static "block 3" intro.)
  {
    id: "before-dream",
    afterIndex: 7,
    eyebrow: () => "Agora, o mais importante",
    title: () => "Os sonhos não chegam por acaso.",
    body: (a) => {
      const estado = lower(label("estado_emocional", a.estado_emocional));
      const areas = labels("areas_de_vida", a.areas_de_vida).map(lower);
      const out: string[] = [];
      if (estado) {
        out.push(
          `Você descreveu suas últimas semanas com uma palavra: ${estado}. Guarde isso — porque o sonho que te trouxe aqui quase nunca é sobre o sonho. É sobre esse estado.`,
        );
      } else {
        out.push(
          "O sonho que te trouxe aqui quase nunca é sobre o sonho em si. É sobre o momento que você está vivendo.",
        );
      }
      if (areas.length) {
        out.push(
          `E quando a vida pede atenção em ${joinPt(areas)}, é exatamente aí que os sonhos ficam mais vívidos — eles tentam processar o que a mente desperta ainda não conseguiu.`,
        );
      }
      out.push(
        "Pense no sonho que ficou marcado em você. Nas próximas perguntas, conte com o máximo de detalhes que conseguir lembrar.",
      );
      return out;
    },
    cta: "Vou contar meu sonho",
  },

  // After block 4 (the dream itself) — THE big teaser. Mirror the symbols + open loop.
  {
    id: "after-dream",
    afterIndex: 13,
    eyebrow: () => "Já estou começando a ver",
    title: (a) => {
      const n = firstName(a);
      return n ? `${n}, seu sonho tem uma assinatura.` : "Seu sonho tem uma assinatura.";
    },
    body: (a) => {
      const simbolos = labels("elementos_simbolicos", a.elementos_simbolicos)
        .filter((l) => !/nenhum/i.test(l))
        .map(lower);
      const emocao = lower(label("emocao_durante_sonho", a.emocao_durante_sonho));
      const out: string[] = [];
      if (simbolos.length >= 2) {
        out.push(
          `Você trouxe ${joinPt(simbolos.slice(0, 3))}. Essa combinação não é aleatória — cada um desses símbolos carrega um significado, e juntos eles formam um padrão que diz respeito a uma única coisa na sua vida.`,
        );
      } else if (simbolos.length === 1) {
        out.push(
          `Você trouxe ${simbolos[0]}. Esse é um dos símbolos mais densos que aparecem nos sonhos — e a forma como ele apareceu no SEU sonho muda tudo.`,
        );
      } else {
        out.push(
          "Mesmo sem um símbolo óbvio, a estrutura do seu sonho — como ele começa, o que acontece e como termina — já revela um padrão.",
        );
      }
      if (emocao) {
        out.push(
          `E a emoção mais forte que você sentiu — ${emocao} — é a chave. Ela aponta para o que essa parte de você está tentando te dizer.`,
        );
      }
      out.push(
        "Faltam só algumas perguntas para eu conseguir traduzir isso por inteiro.",
      );
      return out;
    },
    cta: "Quase lá — continuar",
  },

  // After block 5 (patterns) — build to the climax: her question.
  {
    id: "before-question",
    afterIndex: 17,
    eyebrow: () => "A última parte",
    title: () => "Agora, a pergunta que importa.",
    body: (a) => {
      const recorrente = a.recorrencia && a.recorrencia !== "unico";
      const out: string[] = [];
      if (recorrente) {
        out.push(
          "Sonhos que voltam não estão te perturbando à toa. Eles insistem porque há algo que ainda não foi ouvido.",
        );
      } else {
        out.push(
          "Mesmo um sonho único pode chegar carregando exatamente a mensagem que você precisava no momento certo.",
        );
      }
      out.push(
        "Na próxima tela, você vai escrever a única pergunta que faria ao seu sonho. É ela que sua análise vai responder, diretamente. Pense com calma.",
      );
      return out;
    },
    cta: "Estou pronta",
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

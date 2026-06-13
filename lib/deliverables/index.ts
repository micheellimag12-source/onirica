import type { FullAnalysis } from "./full-analysis";
import type { Journal } from "./journal";
import type { Narration } from "./narration";
import type { Meditation } from "./meditation";

export type { FullAnalysis, Simbolo } from "./full-analysis";
export type { Journal } from "./journal";
export type { Narration } from "./narration";
export type { Meditation } from "./meditation";

export { generateFullAnalysis, FullAnalysisSchema } from "./full-analysis";
export { generateJournal, JournalSchema } from "./journal";
export { generateNarration, NarrationSchema } from "./narration";
export { generateMeditation, MeditationSchema } from "./meditation";
export { renderDreamMapSVG } from "./dream-map-svg";
export { analysisContext } from "./context";

/**
 * Pacote completo de entregáveis de uma análise, do jeito que a área de entrega
 * (`/minha-analise/<token>`) consome. Bumps são opcionais (só quem comprou).
 */
export interface Deliverables {
  nome: string;
  analysis: FullAnalysis;
  mapaSvg: string;
  journal: Journal;
  // bumps
  narration?: Narration | null;
  audioUrl?: string | null;
  meditation?: Meditation | null;
}

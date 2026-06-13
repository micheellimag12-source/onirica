import {
  type AnalysisRow,
  updateAnalysis,
} from "@/lib/analyses";
import { generateFullAnalysis } from "./full-analysis";
import { generateJournal } from "./journal";
import { generateNarration } from "./narration";
import { generateMeditation } from "./meditation";
import { generateAndStoreAudio } from "./audio";

/**
 * Orquestra a geração dos entregáveis de uma análise paga.
 * - análise completa e diário: sempre
 * - narração + áudio: só se comprou o bump de áudio
 * - meditação: só se comprou o bump de meditação
 * Salva incrementalmente (cada peça é persistida assim que fica pronta), então
 * a página de entrega pode revelar o que já existe enquanto o resto gera.
 */
export async function generateDeliverables(row: AnalysisRow): Promise<void> {
  await updateAnalysis(row.id, { status: "generating", error: null });
  try {
    // A análise é a base de tudo: roda primeiro.
    const analysis = await generateFullAnalysis(row.answers);
    await updateAnalysis(row.id, { analysis });

    // Os demais entregáveis dependem só da análise: rodam em paralelo.
    const tasks: Promise<unknown>[] = [
      generateJournal(row.answers, analysis).then((journal) =>
        updateAnalysis(row.id, { journal }),
      ),
    ];

    if (row.bump_audio) {
      tasks.push(
        (async () => {
          const narration = await generateNarration(row.answers, analysis);
          await updateAnalysis(row.id, { narration });
          const audio_url = await generateAndStoreAudio({
            token: row.token,
            text: narration.roteiro,
          });
          await updateAnalysis(row.id, { audio_url });
        })(),
      );
    }

    if (row.bump_meditation) {
      tasks.push(
        generateMeditation(row.answers, analysis).then((meditation) =>
          updateAnalysis(row.id, { meditation }),
        ),
      );
    }

    await Promise.all(tasks);

    await updateAnalysis(row.id, {
      status: "ready",
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await updateAnalysis(row.id, { status: "error", error: message });
    throw e;
  }
}

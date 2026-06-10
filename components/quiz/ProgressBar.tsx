import type { QuizStep } from "@/types/quiz";
import { computeProgress } from "@/lib/quiz-state";

interface Props {
  step: QuizStep;
}

export function ProgressBar({ step }: Props) {
  const progress = computeProgress(step);
  if (!progress) return null;

  return (
    <div className="w-full max-w-[600px] mx-auto flex flex-col gap-2">
      <div className="flex gap-1.5">
        {progress.segments.map((fill, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full bg-border/40 overflow-hidden"
          >
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${fill * 100}%` }}
            />
          </div>
        ))}
      </div>
      {progress.questionNumber !== null && (
        <div className="text-[11px] tracking-wide uppercase text-muted-foreground text-center">
          Pergunta {progress.questionNumber} de {progress.total}
        </div>
      )}
    </div>
  );
}

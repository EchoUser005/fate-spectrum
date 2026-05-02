import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { generationPhaseLabels } from "@/lib/ui-copy/labels";

export function GenerationProgress({ completed }: { completed: string[] }) {
  const currentIndex = Math.max(0, completed.length - 1);
  const allDone = completed.length >= generationPhaseLabels.length;

  return (
    <div className="grid gap-2 rounded-md border border-fs-line bg-white p-3">
      {generationPhaseLabels.map((phase, index) => {
        const isDone = allDone || index < currentIndex;
        const isActive = !allDone && index === currentIndex;
        return (
          <div
            key={phase}
            className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
              isDone
                ? "text-cyan-900"
                : isActive
                  ? "bg-fs-surface text-fs-ink"
                  : "text-fs-muted"
            }`}
          >
            {isDone ? (
              <CheckCircle2 size={16} />
            ) : isActive ? (
              <Loader2 size={16} className="animate-spin text-fs-gold" />
            ) : (
              <Circle size={16} />
            )}
            {phase}
          </div>
        );
      })}
    </div>
  );
}

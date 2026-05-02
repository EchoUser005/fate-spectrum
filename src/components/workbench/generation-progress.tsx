import { CheckCircle2, Circle } from "lucide-react";
import { generationPhaseLabels } from "@/lib/ui-copy/labels";

export function GenerationProgress({ completed }: { completed: string[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {generationPhaseLabels.map((phase) => {
        const isDone = completed.includes(phase);
        return (
          <div
            key={phase}
            className={`flex items-center gap-2 rounded-md border px-3 py-3 text-sm ${
              isDone ? "border-fs-cyan bg-cyan-50 text-cyan-900" : "border-fs-line bg-white text-fs-muted"
            }`}
          >
            {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            {phase}
          </div>
        );
      })}
    </div>
  );
}

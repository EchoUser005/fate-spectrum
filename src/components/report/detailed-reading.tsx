import type { ReportResponse } from "@/lib/schemas/report";
import { DimensionScoreCard } from "@/components/report/dimension-score-card";

export function DetailedReading({ report }: { report: ReportResponse }) {
  return (
    <section id="reading" className="scroll-mt-20 rounded-md border border-fs-line bg-fs-surface p-5 md:p-6">
      <div>
        <p className="text-sm font-medium text-fs-gold">详细解读</p>
        <h2 className="mt-2 text-2xl font-semibold text-fs-ink">七个维度分别看</h2>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {report.dimensions.map((dimension) => (
          <DimensionScoreCard key={dimension.id} dimension={dimension} report={report} />
        ))}
      </div>
    </section>
  );
}

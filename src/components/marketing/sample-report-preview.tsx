const previewScores = [
  { label: "财富量级", value: 76, color: "#d97706" },
  { label: "生活舒适度", value: 52, color: "#16a34a" },
  { label: "自我价值", value: 86, color: "#0891b2" }
] as const;

export function SampleReportPreview() {
  return (
    <div className="rounded-md border border-fs-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-fs-muted">样例报告预览</p>
          <h2 className="mt-1 text-xl font-semibold text-fs-ink">戊寅十年主线</h2>
        </div>
        <span className="rounded-sm bg-fs-bg px-2 py-1 text-xs font-medium text-fs-muted">2024-2033</span>
      </div>
      <div className="mt-5 grid gap-4">
        {previewScores.map((score) => (
          <div key={score.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-fs-ink">{score.label}</span>
              <span className="font-semibold" style={{ color: score.color }}>
                {score.value}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full" style={{ width: `${score.value}%`, backgroundColor: score.color }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-fs-muted">这一步适合发力，但舒适度偏低，需要把节奏和边界放在前面。</p>
    </div>
  );
}

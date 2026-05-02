import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import {
  buildDayunCurveData,
  buildDayunHeatmapRows,
  buildDayunTableRows
} from "@/lib/report-view-model";
import { buildRuleBasedReport } from "@/lib/scoring/engine";

const birth = {
  nickname: "匿名样例",
  gender: "female" as const,
  calendar: "solar" as const,
  birthDate: "1999-09-15",
  birthTime: "23:00",
  timeBranch: "子" as const,
  timezone: "Asia/Shanghai",
  birthPlace: "Shanghai",
  useTrueSolarTime: false
};

function buildReport() {
  return buildRuleBasedReport({
    birth,
    paipan: samplePaipan,
    provider: { provider: "mock" },
    generatedAt: "2026-05-02T00:00:00.000Z"
  });
}

describe("dayun visual data sources", () => {
  it("uses report.dayunScores for curve, heatmap, and table data", () => {
    const report = buildReport();
    const curveData = buildDayunCurveData(report);
    const heatmapRows = buildDayunHeatmapRows(report);
    const tableRows = buildDayunTableRows(report);

    for (const dayun of report.dayunScores) {
      expect(curveData[dayun.index]).toMatchObject({
        ganzhi: dayun.ganzhi,
        startYear: dayun.startYear,
        endYear: dayun.endYear,
        age: dayun.age,
        ...dayun.scores
      });
      for (const [dimensionIndex, dimension] of report.dimensions.entries()) {
        expect(heatmapRows[dimensionIndex]?.cells[dayun.index]).toMatchObject({
          ganzhi: dayun.ganzhi,
          score: dayun.scores[dimension.id],
          summary: dayun.summary
        });
      }
      expect(tableRows[dayun.index]).toMatchObject({
        ganzhi: dayun.ganzhi,
        scores: dayun.scores,
        summary: dayun.summary
      });
    }
  });
});

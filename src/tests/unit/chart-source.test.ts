import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import {
  buildDayunCurveData,
  buildDayunHeatmapRows,
  buildDayunTableRows,
  getCurrentZiweiLimit
} from "@/lib/report-view-model";
import { buildRuleBasedReport } from "@/lib/scoring/engine";
import type { ReportResponse } from "@/lib/schemas/report";

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

  it("calculates current ziwei limit from five-element bureau and gender direction", () => {
    const report = withRealStyleZiweiPalaces(buildReport());
    const currentLimit = getCurrentZiweiLimit(report);

    expect(currentLimit).toMatchObject({
      ganzhi: "丙寅大限",
      age: 24,
      startYear: 2022,
      endYear: 2031
    });
    expect(currentLimit?.summary).toContain("福德宫");
  });
});

function withRealStyleZiweiPalaces(report: ReportResponse): ReportResponse {
  const branches = [
    "丙子",
    "丁丑",
    "丙寅",
    "丁卯",
    "戊辰",
    "己巳",
    "庚午",
    "辛未",
    "壬申",
    "癸酉",
    "甲戌",
    "乙亥"
  ];
  const names = [
    "命宫",
    "父母宫",
    "福德宫",
    "田宅宫",
    "官禄宫",
    "仆役宫",
    "迁移宫",
    "疾厄宫",
    "财帛宫",
    "子女宫",
    "夫妻宫",
    "兄弟宫"
  ];

  return {
    ...report,
    normalized: {
      ...report.normalized,
      identity: {
        ...report.normalized.identity,
        age: 27,
        fiveelement: "金四局",
        yinyanggender: "阴女"
      },
      palaces: branches.map((branch, index) => ({
        index,
        name: names[index] ?? "宫位",
        branch,
        stars: [],
        raw: {
          MangA: branch,
          MangB: names[index] ?? "宫位"
        }
      }))
    }
  };
}

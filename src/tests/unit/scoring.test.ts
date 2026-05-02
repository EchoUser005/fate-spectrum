import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { buildRuleBasedReport } from "@/lib/scoring/engine";
import { DIMENSION_IDS } from "@/lib/scoring/dimensions";

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

describe("scoring engine", () => {
  it("generates a complete rule-based report from sample paipan", () => {
    const report = buildRuleBasedReport({
      birth,
      paipan: samplePaipan,
      provider: { provider: "mock" },
      generatedAt: "2026-04-30T00:00:00.000Z"
    });

    expect(report.meta.hasLlmNarrative).toBe(false);
    expect(report.dayunScores.length).toBeGreaterThan(0);
    for (const dimensionId of DIMENSION_IDS) {
      expect(report.dayunScores[0]?.scores[dimensionId]).toBeGreaterThanOrEqual(0);
      expect(report.dayunScores[0]?.scores[dimensionId]).toBeLessThanOrEqual(100);
      expect(report.narratives.dimensions[dimensionId]).toContain("分");
    }
  });

  it("does not require ziwei palaces or output", () => {
    const report = buildRuleBasedReport({
      birth,
      paipan: {
        status: "success",
        data: {
          bz: {
            y: "甲子",
            m: "乙丑",
            d: "丙寅",
            h: "丁卯"
          }
        }
      },
      provider: { provider: "mock" },
      generatedAt: "2026-04-30T00:00:00.000Z"
    });

    expect(report.dayunScores).toHaveLength(1);
    expect(report.narratives.actionPlan.length).toBeGreaterThan(0);
  });
});

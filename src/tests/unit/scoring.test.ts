import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { buildRuleBasedReport } from "@/lib/scoring/engine";
import { DIMENSION_IDS } from "@/lib/scoring/dimensions";

const birth = {
  nickname: "匿名样例",
  gender: "female" as const,
  calendar: "solar" as const,
  birthDate: "1992-09-29",
  birthTime: "12:00",
  timeBranch: "午" as const,
  timezone: "Asia/Shanghai",
  birthPlace: "示例城市",
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
    expect(report.analysis?.context.bazi).toBe("壬申 己酉 戊申 未知");
    expect(report.analysis?.portrait.summary).toContain("日主");
    expect(report.analysis?.elementProfile.nodes.length).toBeGreaterThanOrEqual(6);
    expect(report.analysis?.elementProfile.nodes.map((node) => `${node.carrier}${node.symbol}`)).toEqual(
      expect.arrayContaining(["年干壬", "年支申", "月干己", "月支酉", "日干戊", "日支申"])
    );
    expect(report.analysis?.elementProfile.interactions.length).toBeGreaterThan(0);
    expect(report.analysis?.elementProfile.favorableElements.length).toBeGreaterThan(0);
    expect(report.analysis?.currentEnvironment.signals.length).toBeGreaterThanOrEqual(2);
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
            y: "壬申",
            m: "己酉",
            d: "戊申",
            h: "未知"
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

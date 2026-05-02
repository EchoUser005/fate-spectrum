import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { PaipanResponseSchema } from "@/lib/schemas/paipan";
import type { Narrative } from "@/lib/schemas/report";
import { buildRuleBasedReport } from "@/lib/scoring/engine";
import { SAMPLE_GOLDEN_DAYUN_PROFILE } from "@/lib/scoring/golden-profiles";

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

const narrativeOverride: Narrative = {
  overview: "这一步只测试文字润色不会改分。",
  dimensions: {
    wealth: "财富文字润色",
    career: "事业文字润色",
    comfort: "舒适文字润色",
    selfValue: "自我价值文字润色",
    relationship: "关系文字润色",
    healthEnergy: "健康能量文字润色",
    riskControl: "风险可控文字润色"
  },
  keyWindows: [],
  actionPlan: ["保持分数不变。"]
};

function buildReport(useNarrativeOverride = false) {
  return buildRuleBasedReport({
    birth,
    paipan: PaipanResponseSchema.parse(samplePaipan),
    provider: { provider: "mock" },
    generatedAt: "2026-05-02T00:00:00.000Z",
    narrativeOverride: useNarrativeOverride ? narrativeOverride : undefined
  });
}

describe("sample paipan golden profile", () => {
  it("matches the target pillars and dayun sequence", () => {
    const report = buildReport();

    expect(report.normalized.pillars).toEqual({
      year: "己卯",
      month: "乙亥",
      day: "戊寅",
      hour: "癸亥"
    });
    expect(report.dayunScores.map((dayun) => dayun.ganzhi)).toEqual(
      SAMPLE_GOLDEN_DAYUN_PROFILE.map((dayun) => dayun.ganzhi)
    );
  });

  it("outputs exact target scores and summaries for every dayun", () => {
    const report = buildReport();

    expect(report.dayunScores).toHaveLength(SAMPLE_GOLDEN_DAYUN_PROFILE.length);
    for (const [index, expected] of SAMPLE_GOLDEN_DAYUN_PROFILE.entries()) {
      expect(report.dayunScores[index]).toMatchObject({
        ganzhi: expected.ganzhi,
        age: expected.age,
        startYear: expected.startYear,
        endYear: expected.endYear,
        scores: expected.scores,
        summary: expected.summary
      });
    }
  });

  it("keeps scores identical when narrative override is provided", () => {
    const ruleReport = buildReport(false);
    const polishedReport = buildReport(true);

    expect(polishedReport.meta.hasLlmNarrative).toBe(true);
    expect(polishedReport.dayunScores).toEqual(ruleReport.dayunScores);
    expect(polishedReport.yearlyScores).toEqual(ruleReport.yearlyScores);
  });
});

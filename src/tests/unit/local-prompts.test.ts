import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { PaipanResponseSchema } from "@/lib/schemas/paipan";
import {
  buildCurrentEnvironmentPrompt,
  buildDimensionsPrompt,
  buildOverviewPrompt,
  buildWindowsPrompt,
  getLocalPromptCatalog,
  LOCAL_REPORT_PROMPTS
} from "@/lib/llm/prompts";
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

describe("local prompt registry", () => {
  it("builds split report prompts from versioned local prompt files", () => {
    const report = buildRuleBasedReport({
      birth,
      paipan: PaipanResponseSchema.parse(samplePaipan),
      provider: { provider: "mock" },
      generatedAt: "2026-05-02T00:00:00.000Z"
    });
    const input = {
      normalized: report.normalized,
      dimensions: report.dimensions,
      dayunScores: report.dayunScores,
      yearlyScores: report.yearlyScores,
      generatedAt: report.meta.generatedAt
    };
    const prompts = [
      buildOverviewPrompt(input),
      buildCurrentEnvironmentPrompt(input),
      buildDimensionsPrompt(input),
      buildWindowsPrompt(input)
    ];
    const catalog = getLocalPromptCatalog();

    expect(LOCAL_REPORT_PROMPTS).toEqual({
      overview: "fate-spectrum/overview",
      currentEnvironment: "fate-spectrum/current-environment",
      dimensions: "fate-spectrum/dimensions",
      windows: "fate-spectrum/windows"
    });
    expect(catalog.map((prompt) => prompt.name)).toEqual([
      "fate-spectrum/overview",
      "fate-spectrum/current-environment",
      "fate-spectrum/dimensions",
      "fate-spectrum/windows",
      "fate-spectrum/weekly-daily",
      "fate-spectrum/monthly-rollup",
      "fate-spectrum/yearly-memory"
    ]);
    expect(prompts[0]?.system).toContain("总览主笔");
    expect(prompts[1]?.system).toContain("当下大环境");
    for (const prompt of prompts) {
      expect(prompt.user).not.toContain("{{context}}");
      expect(prompt.user).toContain("requiredDisclaimers");
      expect(prompt.user).toContain("dayunScores");
      expect(prompt.user).toContain("currentYearly");
      expect(prompt.user).toContain("currentDayunYears");
      expect(prompt.user).not.toContain("1999-09-15");
      expect(prompt.variables.context).toContain("currentDayun");
    }
  });
});

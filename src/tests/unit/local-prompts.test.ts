import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { PaipanResponseSchema } from "@/lib/schemas/paipan";
import {
  buildDimensionsPrompt,
  buildOverviewPrompt,
  buildWindowsPrompt,
  LOCAL_REPORT_PROMPTS
} from "@/lib/llm/prompts";
import { buildRuleBasedReport } from "@/lib/scoring/engine";
import overviewPromptDefinition from "../../../prompts/fate-spectrum-overview.v1.json";
import dimensionsPromptDefinition from "../../../prompts/fate-spectrum-dimensions.v1.json";
import windowsPromptDefinition from "../../../prompts/fate-spectrum-windows.v1.json";

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
      buildDimensionsPrompt(input),
      buildWindowsPrompt(input)
    ];

    expect(LOCAL_REPORT_PROMPTS).toEqual({
      overview: overviewPromptDefinition.name,
      dimensions: dimensionsPromptDefinition.name,
      windows: windowsPromptDefinition.name
    });
    expect(prompts[0]?.system).toBe(overviewPromptDefinition.messages[0]?.content);
    for (const prompt of prompts) {
      expect(prompt.user).not.toContain("{{context}}");
      expect(prompt.user).toContain("requiredDisclaimers");
      expect(prompt.user).toContain("dayunScores");
      expect(prompt.user).toContain("currentYearly");
      expect(prompt.user).toContain("currentDayunYears");
      expect(prompt.user).not.toContain("1999-09-15");
    }
  });
});

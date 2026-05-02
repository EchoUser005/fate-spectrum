import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { PaipanResponseSchema } from "@/lib/schemas/paipan";
import { buildNarrativePrompt, LOCAL_NARRATIVE_PROMPT_NAME } from "@/lib/llm/prompts";
import { buildRuleBasedReport } from "@/lib/scoring/engine";
import promptDefinition from "../../../prompts/fate-spectrum-narrative.v1.json";

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
  it("builds the narrative prompt from the versioned local prompt file", () => {
    const report = buildRuleBasedReport({
      birth,
      paipan: PaipanResponseSchema.parse(samplePaipan),
      provider: { provider: "mock" },
      generatedAt: "2026-05-02T00:00:00.000Z"
    });
    const prompt = buildNarrativePrompt({
      normalized: report.normalized,
      dimensions: report.dimensions,
      dayunScores: report.dayunScores,
      yearlyScores: report.yearlyScores
    });

    expect(LOCAL_NARRATIVE_PROMPT_NAME).toBe(promptDefinition.name);
    expect(prompt.system).toBe(promptDefinition.messages[0]?.content);
    expect(prompt.user).not.toContain("{{context}}");
    expect(prompt.user).toContain("requiredDisclaimers");
    expect(prompt.user).toContain("dayunScores");
  });
});

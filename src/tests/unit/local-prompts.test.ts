import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
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
  birthDate: "1992-09-29",
  birthTime: "12:00",
  timeBranch: "午" as const,
  timezone: "Asia/Shanghai",
  birthPlace: "示例城市",
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
      portrait: "fate-spectrum/portrait",
      overview: "fate-spectrum/overview",
      elementEnergy: "fate-spectrum/element-energy",
      currentEnvironment: "fate-spectrum/current-environment",
      dimensions: "fate-spectrum/dimensions",
      windows: "fate-spectrum/windows"
    });
    expect(catalog.map((prompt) => prompt.name)).toEqual([
      "fate-spectrum/portrait",
      "fate-spectrum/overview",
      "fate-spectrum/element-energy",
      "fate-spectrum/current-environment",
      "fate-spectrum/dimensions",
      "fate-spectrum/windows",
      "fate-spectrum/daily-guidance",
      "fate-spectrum/daily-feedback-summary",
      "fate-spectrum/weekly-daily",
      "fate-spectrum/monthly-rollup",
      "fate-spectrum/yearly-memory",
      "fate-spectrum/adaptive-score-candidate",
      "fate-spectrum/relationship-context"
    ]);
    expect(prompts[0]?.system).toContain("总览主笔");
    expect(prompts[1]?.system).toContain("当前阶段");
    for (const prompt of prompts) {
      expect(prompt.user).not.toContain("{{context}}");
      expect(prompt.user).toContain("requiredDisclaimers");
      expect(prompt.user).toContain("dayunScores");
      expect(prompt.user).toContain("currentYearly");
      expect(prompt.user).toContain("currentDayunYears");
      expect(prompt.user).not.toContain("1992-09-29");
      expect(prompt.variables.context).toContain("currentDayun");
    }
  });
});

describe("local prompt files", () => {
  it("declares MVP input and output contracts for every prompt", () => {
    const promptRoot = path.join(process.cwd(), "prompts", "fate-spectrum");
    const dirs = fs
      .readdirSync(promptRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(promptRoot, entry.name));

    expect(dirs.length).toBeGreaterThanOrEqual(10);
    for (const dir of dirs) {
      const meta = JSON.parse(fs.readFileSync(path.join(dir, "prompt.json"), "utf8")) as {
        name?: unknown;
        input?: unknown;
        output?: unknown;
      };
      expect(meta.name).toMatch(/^fate-spectrum\//);
      expect(meta.input).toBeTruthy();
      expect(meta.output).toBeTruthy();
      expect(fs.readFileSync(path.join(dir, "system.md"), "utf8")).toContain("输出 JSON");
      expect(fs.readFileSync(path.join(dir, "user.md"), "utf8")).toContain("{{context}}");
    }
  });
});

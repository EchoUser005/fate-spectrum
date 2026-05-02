import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { GENERAL_DISCLAIMER, HEALTH_DISCLAIMER, WEALTH_DISCLAIMER } from "@/lib/constants";
import { exportReportJson } from "@/lib/export/json";
import { exportReportMarkdown } from "@/lib/export/markdown";
import { BANNED_PUBLIC_TERMS } from "@/lib/ui-copy/glossary";
import type { BirthInput } from "@/lib/schemas/birth";
import { PaipanResponseSchema } from "@/lib/schemas/paipan";
import { buildRuleBasedReport } from "@/lib/scoring/engine";

const birth: BirthInput = {
  nickname: "匿名样例",
  gender: "female",
  calendar: "solar",
  birthDate: "1999-09-15",
  birthTime: "23:00",
  timeBranch: "子",
  timezone: "Asia/Shanghai",
  birthPlace: "Shanghai",
  useTrueSolarTime: false
};

function buildReport() {
  return buildRuleBasedReport({
    birth,
    paipan: PaipanResponseSchema.parse(samplePaipan),
    provider: { provider: "mock" },
    generatedAt: "2026-04-30T00:00:00.000Z"
  });
}

describe("report exports", () => {
  it("includes disclaimers in Markdown export", () => {
    const markdown = exportReportMarkdown(buildReport());

    expect(markdown).toContain(GENERAL_DISCLAIMER);
    expect(markdown).toContain(HEALTH_DISCLAIMER);
    expect(markdown).toContain(WEALTH_DISCLAIMER);
  });

  it("includes disclaimers in JSON export", () => {
    const exported = JSON.parse(exportReportJson(buildReport())) as {
      disclaimers: {
        general: string;
        health: string;
        wealth: string;
      };
    };

    expect(exported.disclaimers.general).toBe(GENERAL_DISCLAIMER);
    expect(exported.disclaimers.health).toBe(HEALTH_DISCLAIMER);
    expect(exported.disclaimers.wealth).toBe(WEALTH_DISCLAIMER);
  });

  it("does not export cached API keys", () => {
    expect(exportReportJson(buildReport())).not.toContain("sk-test");
    expect(exportReportMarkdown(buildReport())).not.toContain("sk-test");
  });

  it("keeps the Markdown export product-facing and includes target scores", () => {
    const markdown = exportReportMarkdown(buildReport());

    expect(markdown).toContain("| 戊寅 | 26 | 2024-2033 | 76 | 84 | 52 | 86 | 78 | 55 | 50 | 当前主战场，开创、竞争、身份升级，但很耗 |");
    expect(markdown).toContain("财富分高不等于适合冒险");
    for (const term of BANNED_PUBLIC_TERMS) {
      expect(markdown).not.toContain(term);
    }
  });
});

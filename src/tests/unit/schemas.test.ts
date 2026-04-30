import { describe, expect, it } from "vitest";
import { BirthInputSchema } from "@/lib/schemas/birth";
import { ProviderConfigSchema } from "@/lib/schemas/provider";
import { ReportApiRequestSchema } from "@/lib/schemas/report";

describe("schemas", () => {
  it("accepts valid birth input", () => {
    const parsed = BirthInputSchema.parse({
      nickname: "匿名",
      gender: "female",
      calendar: "solar",
      birthDate: "1999-09-15",
      birthTime: "23:00",
      timeBranch: "子",
      timezone: "Asia/Shanghai",
      birthPlace: "Shanghai",
      useTrueSolarTime: false
    });

    expect(parsed.timeBranch).toBe("子");
  });

  it("rejects invalid birth date", () => {
    expect(() =>
      BirthInputSchema.parse({
        gender: "female",
        calendar: "solar",
        birthDate: "1999/09/15",
        timeBranch: "子",
        timezone: "Asia/Shanghai",
        useTrueSolarTime: false
      })
    ).toThrow();
  });

  it("accepts provider config without a public key field", () => {
    const parsed = ProviderConfigSchema.parse({
      provider: "deepseek",
      apiKey: "test-key",
      baseUrl: "https://api.deepseek.com",
      model: "deepseek-chat"
    });

    expect(parsed.provider).toBe("deepseek");
  });

  it("validates report API request", () => {
    const parsed = ReportApiRequestSchema.parse({
      birth: {
        gender: "female",
        calendar: "solar",
        birthDate: "1999-09-15",
        birthTime: "23:00",
        timeBranch: "子",
        timezone: "Asia/Shanghai",
        useTrueSolarTime: false
      },
      paipanProvider: { provider: "mock" },
      llmProvider: { provider: "deepseek" },
      options: { useLlmNarrative: false, includeRawJson: true }
    });

    expect(parsed.options.includeRawJson).toBe(true);
  });
});

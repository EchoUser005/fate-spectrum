import { describe, expect, it } from "vitest";
import { DEFAULT_SHENJIGE_ENDPOINT } from "@/lib/constants";
import type { BirthInput } from "@/lib/schemas/birth";
import {
  assertAllowedEndpoint,
  assertShenjigeInput,
  buildShenjigeFormBody,
  isShenjigeEndpoint
} from "@/lib/paipan/custom-provider";
import { mockPaipanProvider } from "@/lib/paipan/mock-provider";
import { buildRuleBasedReport } from "@/lib/scoring/engine";

const baseBirth: BirthInput = {
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

describe("custom paipan provider", () => {
  it("builds the calibrated shenjige form body", () => {
    const body = buildShenjigeFormBody(baseBirth);

    expect(body.get("year")).toBe("1999");
    expect(body.get("month")).toBe("9");
    expect(body.get("day")).toBe("15");
    expect(body.get("hour")).toBe("子");
    expect(body.get("h")).toBe("23");
    expect(body.get("m")).toBe("0");
    expect(body.get("genderValue")).toBe("F");
    expect(body.get("settings[sihua]")).toBe("D");
    expect(body.get("zzpAnalysis")).toBe("N");
  });

  it("rejects lunar calendar before shenjige network calls", () => {
    expect(() => assertShenjigeInput({ ...baseBirth, calendar: "lunar" })).toThrow(/暂只支持公历/);
  });

  it("rejects unknown gender before shenjige network calls", () => {
    expect(() => assertShenjigeInput({ ...baseBirth, gender: "unknown" })).toThrow(/male 或 female/);
  });

  it("keeps true solar time as a non-blocking mock demo prompt", async () => {
    const birth: BirthInput = {
      ...baseBirth,
      useTrueSolarTime: true
    };
    const paipan = await mockPaipanProvider.generate(birth, { provider: "mock" });
    const report = buildRuleBasedReport({
      birth,
      paipan,
      provider: { provider: "mock" },
      generatedAt: "2026-04-30T00:00:00.000Z"
    });

    expect(report.meta.notices).toContain("已保留真太阳时开关；当前未提供经纬度，Mock Demo 不做校正。");
    expect(report.dayunScores.length).toBeGreaterThan(0);
  });

  it("blocks localhost custom endpoints by default", async () => {
    await expect(assertAllowedEndpoint("http://127.0.0.1:3000/api/paipan")).rejects.toThrow(/https/);
  });

  it("detects the public shenjige endpoint shape without network", () => {
    expect(isShenjigeEndpoint(DEFAULT_SHENJIGE_ENDPOINT)).toBe(true);
  });
});

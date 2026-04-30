import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { normalizePaipan } from "@/lib/paipan/normalize";

describe("normalizePaipan", () => {
  it("normalizes sample paipan", () => {
    const { normalized } = normalizePaipan(samplePaipan);

    expect(normalized.pillars.year).toBe("己卯");
    expect(normalized.palaces).toHaveLength(12);
    expect(normalized.dayun[0]?.ganzhi).toBe("甲戌");
  });

  it("handles mismatched dayun arrays", () => {
    const { normalized } = normalizePaipan({
      status: "success",
      data: {
        bz: {
          y: "甲子",
          m: "乙丑",
          d: "丙寅",
          h: "丁卯",
          dayunGZ: ["戊辰", "己巳"],
          dayunAge: [10],
          dayunYear: [2010, 2020, 2030]
        }
      }
    });

    expect(normalized.dayun).toHaveLength(3);
    expect(normalized.dayun[1]?.age).toBe(18);
    expect(normalized.dayun[2]?.ganzhi).toBe("第3运");
  });

  it("handles missing palaces and output", () => {
    const { normalized } = normalizePaipan({
      status: "success",
      data: {
        bz: {
          y: "甲子",
          m: "乙丑",
          d: "丙寅",
          h: "丁卯"
        }
      }
    });

    expect(normalized.palaces).toHaveLength(0);
    expect(normalized.outputs).toEqual({});
  });
});

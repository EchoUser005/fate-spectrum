import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { normalizePaipan } from "@/lib/paipan/normalize";

describe("normalizePaipan", () => {
  it("normalizes sample paipan", () => {
    const { normalized } = normalizePaipan(samplePaipan);

    expect(normalized.pillars.year).toBe("己卯");
    expect(normalized.palaces).toHaveLength(12);
    expect(normalized.pillars.month).toBe("乙亥");
    expect(normalized.pillars.day).toBe("戊寅");
    expect(normalized.pillars.hour).toBe("癸亥");
    expect(normalized.dayun[0]?.ganzhi).toBe("丙子");
  });

  it("normalizes a shenjige response with numeric status", () => {
    const { paipan, normalized } = normalizePaipan({
      status: 200,
      message: "",
      data: {
        zw: [
          {
            MangA: "命宫",
            MangB: "子",
            GongWei: 1,
            ganzhi: { tg: 0, dz: 0 },
            StarA: ["紫微"],
            StarB: ["文昌"]
          }
        ],
        bz: {
          y: "甲子",
          m: "乙丑",
          d: "丙寅",
          h: "丁卯",
          dayunGZ: ["戊辰"],
          dayunAge: [8],
          dayunYear: [2007]
        },
        output: {
          all: "匿名 shenjige minimal fixture"
        }
      }
    });

    expect(paipan.status).toBe("200");
    expect(normalized.pillars.year).toBe("甲子");
    expect(normalized.palaces[0]?.stars).toContain("紫微");
    expect(normalized.outputs.all).toBe("匿名 shenjige minimal fixture");
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

  it("handles missing optional palaces, dayun arrays, and output", () => {
    const { normalized } = normalizePaipan({
      status: 200,
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
    expect(normalized.dayun[0]?.ganzhi).toBe("第1运");
  });

  it("rejects malformed shenjige responses before scoring", () => {
    expect(() =>
      normalizePaipan({
        status: 200,
        message: "",
        data: {
          output: {
            all: "missing bazi container"
          }
        }
      })
    ).toThrow(/missing required BaZi/i);

    expect(() => normalizePaipan("not-json")).toThrow(/non-object payload/i);
  });
});

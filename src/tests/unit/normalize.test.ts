import { describe, expect, it } from "vitest";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { normalizePaipan } from "@/lib/paipan/normalize";

describe("normalizePaipan", () => {
  it("normalizes sample paipan", () => {
    const { normalized } = normalizePaipan(samplePaipan);

    expect(normalized.pillars.year).toBe("壬申");
    expect(normalized.palaces).toHaveLength(12);
    expect(normalized.pillars.month).toBe("己酉");
    expect(normalized.pillars.day).toBe("戊申");
    expect(normalized.pillars.hour).toBe("未知");
    expect(normalized.dayun[0]?.ganzhi).toBe("庚戌");
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
            StarA: ["演示主星"],
            StarB: ["演示辅星"]
          }
        ],
        bz: {
          y: "壬申",
          m: "己酉",
          d: "戊申",
          h: "未知",
          dayunGZ: ["庚戌"],
          dayunAge: [8],
          dayunYear: [2012]
        },
        output: {
          all: "匿名 shenjige minimal fixture"
        }
      }
    });

    expect(paipan.status).toBe("200");
    expect(normalized.pillars).toEqual({
      year: "壬申",
      month: "己酉",
      day: "戊申",
      hour: "未知"
    });
    expect(normalized.palaces[0]?.stars).toContain("演示主星");
    expect(normalized.outputs.all).toBe("匿名 shenjige minimal fixture");
  });

  it("handles mismatched dayun arrays", () => {
    const { normalized } = normalizePaipan({
      status: "success",
      data: {
        bz: {
          y: "壬申",
          m: "己酉",
          d: "戊申",
          h: "未知",
          dayunGZ: ["庚戌", "辛亥"],
          dayunAge: [10],
          dayunYear: [2010, 2020, 2030]
        }
      }
    });

    expect(normalized.dayun).toHaveLength(3);
    expect(normalized.dayun[1]?.age).toBe(18);
    expect(normalized.dayun[2]?.ganzhi).toBe("第3运");
  });

  it("strips provider HTML breaks from ganzhi labels", () => {
    const { normalized } = normalizePaipan({
      status: 200,
      data: {
        zw: [
          {
            MangA: "丙<br/>子",
            MangB: "命宫",
            StarA: ["演示<br/>主星"]
          }
        ],
        bz: {
          y: "壬<br/>申",
          m: "己<br />酉",
          d: "戊 申",
          h: "未\n知",
          dayunGZ: ["庚<br/>戌"],
          dayunAge: [8],
          dayunYear: [2012]
        }
      }
    });

    expect(normalized.pillars).toEqual({
      year: "壬申",
      month: "己酉",
      day: "戊申",
      hour: "未知"
    });
    expect(normalized.dayun[0]?.ganzhi).toBe("庚戌");
    expect(normalized.palaces[0]).toMatchObject({
      name: "命宫",
      branch: "丙子",
      stars: ["演示主星"]
    });
  });

  it("handles missing optional palaces, dayun arrays, and output", () => {
    const { normalized } = normalizePaipan({
      status: 200,
      data: {
        bz: {
          y: "壬申",
          m: "己酉",
          d: "戊申",
          h: "未知"
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

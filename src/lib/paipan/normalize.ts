import { PaipanResponseSchema, type NormalizedPaipan, type PaipanResponse } from "@/lib/schemas/paipan";

const palaceStarKeys = [
  "StarA",
  "StarB",
  "StarC",
  "Star6",
  "StarD",
  "StarE",
  "StarF",
  "StarS",
  "StarJ"
] as const;

const palaceNames = [
  "命宫",
  "兄弟",
  "夫妻",
  "子女",
  "财帛",
  "疾厄",
  "迁移",
  "仆役",
  "官禄",
  "田宅",
  "福德",
  "父母"
];

export function coercePaipanResponse(raw: unknown): PaipanResponse {
  const parsed = PaipanResponseSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }

  if (raw && typeof raw === "object") {
    return {
      status: "success",
      message: "Wrapped provider response because it did not include the standard status/data shell.",
      data: raw as PaipanResponse["data"]
    };
  }

  return {
    status: "error",
    message: "Provider returned a non-object payload.",
    data: {}
  };
}

export function normalizePaipan(raw: unknown): { paipan: PaipanResponse; normalized: NormalizedPaipan } {
  const paipan = coercePaipanResponse(raw);
  const data = paipan.data ?? {};
  const bz = data.bz ?? {};
  const dayunGZ = Array.isArray(bz.dayunGZ) ? bz.dayunGZ : [];
  const dayunAge = Array.isArray(bz.dayunAge) ? bz.dayunAge : [];
  const dayunYear = Array.isArray(bz.dayunYear) ? bz.dayunYear : [];
  const dayunLength = Math.max(dayunGZ.length, dayunAge.length, dayunYear.length, 1);
  const fallbackStartYear = getYearFromDate(data.solarday) + 8;

  const normalized: NormalizedPaipan = {
    pillars: {
      year: bz.y ?? "未知",
      month: bz.m ?? "未知",
      day: bz.d ?? "未知",
      hour: bz.h ?? "未知"
    },
    dayun: Array.from({ length: dayunLength }, (_, index) => {
      const age = dayunAge[index] ?? 8 + index * 10;
      const startYear = dayunYear[index] ?? fallbackStartYear + index * 10;
      return {
        index,
        ganzhi: dayunGZ[index] ?? `第${index + 1}运`,
        age,
        startYear,
        endYear: startYear + 9
      };
    }),
    palaces: (data.zw ?? []).map((palace, index) => ({
      index,
      name: palace.MangA ?? palaceNames[index] ?? `宫位 ${index + 1}`,
      branch: palace.MangB,
      stars: collectStars(palace),
      raw: palace
    })),
    identity: {
      solarday: data.solarday,
      lunarday: data.lunarday,
      shenxiao: data.shenxiao,
      age: data.age,
      mingzhu: data.mingzhu,
      shenzhu: data.shenzhu,
      fiveelement: data.fiveelement,
      yinyanggender: data.yinyanggender
    },
    outputs: data.output ?? {}
  };

  return { paipan, normalized };
}

function collectStars(palace: NonNullable<PaipanResponse["data"]["zw"]>[number]) {
  const stars = palaceStarKeys.flatMap((key) => palace[key] ?? []);
  return [...new Set(stars)].filter(Boolean);
}

function getYearFromDate(date?: string) {
  const year = date ? Number(date.slice(0, 4)) : Number.NaN;
  if (Number.isFinite(year) && year > 1800) {
    return year;
  }
  return new Date().getFullYear();
}

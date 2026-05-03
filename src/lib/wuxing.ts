export type WuxingElement = "wood" | "fire" | "earth" | "metal" | "water" | "unknown";

export const wuxingTheme: Record<
  WuxingElement,
  {
    label: string;
    color: string;
    background: string;
    border: string;
  }
> = {
  wood: {
    label: "木",
    color: "#4f8f63",
    background: "#eef6ee",
    border: "#cfe1d2"
  },
  fire: {
    label: "火",
    color: "#c45b73",
    background: "#fbf0f1",
    border: "#ead0d6"
  },
  earth: {
    label: "土",
    color: "#b58a35",
    background: "#fbf4df",
    border: "#eadcb8"
  },
  metal: {
    label: "金",
    color: "#51615c",
    background: "#f0f3f1",
    border: "#d7ded9"
  },
  water: {
    label: "水",
    color: "#315f8f",
    background: "#eef4f8",
    border: "#cfdce6"
  },
  unknown: {
    label: "未定",
    color: "#6f7e77",
    background: "#f4f8f5",
    border: "#dce8de"
  }
};

const stemElements: Record<string, WuxingElement> = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water"
};

const branchHiddenStems: Record<string, string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"]
};

const branchElements: Record<string, WuxingElement> = {
  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water"
};

export function getStemElement(stem?: string): WuxingElement {
  return stem ? stemElements[stem] ?? "unknown" : "unknown";
}

export function getHiddenStems(branch?: string) {
  return branch ? branchHiddenStems[branch] ?? [] : [];
}

export function getBranchElement(branch?: string): WuxingElement {
  return branch ? branchElements[branch] ?? "unknown" : "unknown";
}

export function splitGanzhi(value: string) {
  const cleanValue = cleanGanzhiText(value);
  return {
    stem: cleanValue === "未知" ? "" : cleanValue.slice(0, 1),
    branch: cleanValue === "未知" ? "" : cleanValue.slice(1, 2)
  };
}

export function cleanGanzhiText(value?: string) {
  return cleanProviderText(value);
}

export function cleanProviderText(value?: string) {
  return (value ?? "")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\s+/g, "")
    .trim();
}

export function isGanzhiText(value?: string) {
  return /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/.test(cleanGanzhiText(value));
}

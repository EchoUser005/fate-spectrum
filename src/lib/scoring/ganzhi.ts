export const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const EARTHLY_BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥"
] as const;

const stemElements: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水"
};

const branchElements: Record<string, string> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水"
};

export const branchClashes: Record<string, string> = {
  子: "午",
  丑: "未",
  寅: "申",
  卯: "酉",
  辰: "戌",
  巳: "亥",
  午: "子",
  未: "丑",
  申: "寅",
  酉: "卯",
  戌: "辰",
  亥: "巳"
};

export function splitGanzhi(ganzhi: string) {
  const stem = ganzhi.slice(0, 1);
  const branch = ganzhi.slice(1, 2);
  return { stem, branch };
}

export function getElementsFromGanzhi(ganzhi: string) {
  const { stem, branch } = splitGanzhi(ganzhi);
  return [stemElements[stem], branchElements[branch]].filter(Boolean);
}

export function countPreferredElements(ganzhiList: string[], preferred: readonly string[]) {
  return ganzhiList
    .flatMap((ganzhi) => getElementsFromGanzhi(ganzhi))
    .filter((element) => preferred.includes(element)).length;
}

export function getYearGanzhi(year: number) {
  const offset = year - 1984;
  const stem = HEAVENLY_STEMS[((offset % 10) + 10) % 10];
  const branch = EARTHLY_BRANCHES[((offset % 12) + 12) % 12];
  return `${stem}${branch}`;
}

export function hasBranchClash(left: string, right: string) {
  const leftBranch = splitGanzhi(left).branch;
  const rightBranch = splitGanzhi(right).branch;
  return branchClashes[leftBranch] === rightBranch;
}

import type { BirthInput } from "@/lib/schemas/birth";
import type { NormalizedPaipan } from "@/lib/schemas/paipan";
import type {
  CurrentEnvironmentDetail,
  DayunScore,
  ElementEnergyNode,
  ElementEnergyStance,
  ElementInteraction,
  ElementProfile,
  FateContext,
  Portrait,
  ReportAnalysis,
  ReportResponse,
  YearlyScore
} from "@/lib/schemas/report";
import {
  cleanGanzhiText,
  getBranchElement,
  getHiddenStems,
  getStemElement,
  splitGanzhi,
  type WuxingElement
} from "@/lib/wuxing";
import { branchClashes, getYearGanzhi } from "@/lib/scoring/ganzhi";

const elementLabels: Record<Exclude<WuxingElement, "unknown">, string> = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水"
};

const elementCycle = ["wood", "fire", "earth", "metal", "water"] as const;
const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const stemPolarity = Object.fromEntries(stems.map((stem, index) => [stem, index % 2 === 0 ? "yang" : "yin"]));
const pillarMeta = [
  { key: "year", label: "年柱", stemCarrier: "年干", branchCarrier: "年支", stemWeight: 64, branchWeight: 68 },
  { key: "month", label: "月柱", stemCarrier: "月干", branchCarrier: "月支", stemWeight: 82, branchWeight: 94 },
  { key: "day", label: "日柱", stemCarrier: "日干", branchCarrier: "日支", stemWeight: 90, branchWeight: 78 },
  { key: "hour", label: "时柱", stemCarrier: "时干", branchCarrier: "时支", stemWeight: 60, branchWeight: 58 }
] as const;

const stemCombinations: Array<{ pair: [string, string]; element: KnownElement; title: string }> = [
  { pair: ["甲", "己"], element: "earth", title: "甲己合土" },
  { pair: ["乙", "庚"], element: "metal", title: "乙庚合金" },
  { pair: ["丙", "辛"], element: "water", title: "丙辛合水" },
  { pair: ["丁", "壬"], element: "wood", title: "丁壬合木" },
  { pair: ["戊", "癸"], element: "fire", title: "戊癸合火" }
];

const branchSixCombinations: Array<{ pair: [string, string]; element: KnownElement; title: string }> = [
  { pair: ["子", "丑"], element: "earth", title: "子丑合土" },
  { pair: ["寅", "亥"], element: "wood", title: "寅亥合木" },
  { pair: ["卯", "戌"], element: "fire", title: "卯戌合火" },
  { pair: ["辰", "酉"], element: "metal", title: "辰酉合金" },
  { pair: ["巳", "申"], element: "water", title: "巳申合水" },
  { pair: ["午", "未"], element: "earth", title: "午未合土" }
];

const branchTriads: Array<{ branches: [string, string, string]; element: KnownElement; title: string }> = [
  { branches: ["申", "子", "辰"], element: "water", title: "申子辰三合水局" },
  { branches: ["亥", "卯", "未"], element: "wood", title: "亥卯未三合木局" },
  { branches: ["寅", "午", "戌"], element: "fire", title: "寅午戌三合火局" },
  { branches: ["巳", "酉", "丑"], element: "metal", title: "巳酉丑三合金局" }
];

const branchMeetings: Array<{ branches: [string, string, string]; element: KnownElement; title: string }> = [
  { branches: ["寅", "卯", "辰"], element: "wood", title: "寅卯辰三会木方" },
  { branches: ["巳", "午", "未"], element: "fire", title: "巳午未三会火方" },
  { branches: ["申", "酉", "戌"], element: "metal", title: "申酉戌三会金方" },
  { branches: ["亥", "子", "丑"], element: "water", title: "亥子丑三会水方" }
];

type KnownElement = Exclude<WuxingElement, "unknown">;
type Polarity = "yang" | "yin";

export function buildReportAnalysis(params: {
  birth: BirthInput;
  normalized: NormalizedPaipan;
  dayunScores: DayunScore[];
  yearlyScores: YearlyScore[];
  generatedAt: string;
}): ReportAnalysis {
  const context = buildFateContext(params);
  const elementProfile = buildElementProfile(params.normalized);
  const currentEnvironment = buildCurrentEnvironmentDetail(params);

  return {
    context,
    portrait: buildPortrait(params.normalized, elementProfile, currentEnvironment),
    elementProfile,
    currentEnvironment
  };
}

export function getReportAnalysis(report: ReportResponse): ReportAnalysis {
  return (
    report.analysis ??
    buildReportAnalysis({
      birth: report.birth,
      normalized: report.normalized,
      dayunScores: report.dayunScores,
      yearlyScores: report.yearlyScores,
      generatedAt: report.meta.generatedAt
    })
  );
}

export function buildFateContext(params: {
  birth: BirthInput;
  normalized: NormalizedPaipan;
  dayunScores: DayunScore[];
  yearlyScores: YearlyScore[];
  generatedAt: string;
}): FateContext {
  const generatedYear = getGeneratedYear(params.generatedAt);
  const currentDayun = getCurrentDayun(params.dayunScores, generatedYear);
  const currentYearly = params.yearlyScores.find((year) => year.year === generatedYear);

  return {
    nowtime: currentYearly ? `${currentYearly.year} ${currentYearly.ganzhi}` : String(generatedYear),
    calendar: [],
    name: params.birth.nickname?.trim() || "匿名命主",
    gender: params.birth.gender,
    isTai: params.normalized.identity.mingzhu || params.normalized.identity.shenzhu ? "已返回命身信息" : "未返回",
    birth_correct: `${params.birth.birthDate} ${params.birth.birthTime} ${params.birth.timeBranch}时`,
    city: params.birth.birthPlace || undefined,
    bazi: formatPillars(params.normalized),
    dayun_time: params.dayunScores
      .map((dayun) => `${dayun.ganzhi} ${dayun.startYear}-${dayun.endYear} 约${dayun.age}-${dayun.age + 9}岁`)
      .join("；"),
    qiyun_time: params.normalized.dayun[0]
      ? `${params.normalized.dayun[0].startYear} 年，约 ${params.normalized.dayun[0].age} 岁`
      : undefined,
    jiaoyun_time: currentDayun ? `${currentDayun.ganzhi} ${currentDayun.startYear}-${currentDayun.endYear}` : undefined
  };
}

function buildPortrait(
  normalized: NormalizedPaipan,
  elementProfile: ElementProfile,
  currentEnvironment: CurrentEnvironmentDetail
): Portrait {
  const dayStem = splitGanzhi(normalized.pillars.day).stem;
  const dayElement = getStemElement(dayStem);
  const topElements = Object.entries(elementProfile.elementScores)
    .sort(([, left], [, right]) => right - left)
    .slice(0, 2) as Array<[KnownElement, number]>;
  const visibleTenGods = collectVisibleStemTenGods(normalized);
  const tags = [
    topElements[0] ? `${elementLabels[topElements[0][0]]}气较显` : "",
    topElements[1] && topElements[1][1] >= 45
      ? `${elementLabels[topElements[0][0]]}${elementLabels[topElements[1][0]]}同场`
      : "",
    ...visibleTenGods
  ].filter(Boolean);

  const elementText = topElements.map(([element]) => elementLabels[element]).join("、");
  const dayText = dayStem ? `${dayStem}${dayElement === "unknown" ? "" : elementLabels[dayElement as KnownElement]}日主` : "日主";
  const signalText =
    currentEnvironment.signals.length > 0
      ? `当前阶段更容易感到${currentEnvironment.signals
          .slice(0, 2)
          .map((signal) => signal.title)
          .join("、")}。`
      : "";

  return {
    tags: [...new Set(tags)].slice(0, 6),
    summary: `${dayText}，命盘里${elementText || "五行"}信号更值得先看。这个结构不是单一好坏，而是呈现一种运行方式：先看自己如何承载压力、组织资源，再看哪些表达、规则或学习系统能把能力放大。${signalText}适合把命理术语翻译成现实里的生态位、决策习惯和可持续节奏。`
  };
}

export function buildElementProfile(normalized: NormalizedPaipan): ElementProfile {
  const elementRawScores: Record<KnownElement, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };
  const dayStem = splitGanzhi(normalized.pillars.day).stem;
  const dayElement = getStemElement(dayStem) as KnownElement | "unknown";
  const visibleComponents = getVisiblePillarComponents(normalized);

  for (const component of visibleComponents) {
    if (component.element !== "unknown") {
      elementRawScores[component.element] += component.weight;
    }
    getHiddenStems(component.branch ?? "").forEach((hiddenStem, hiddenIndex) => {
      const hiddenElement = getStemElement(hiddenStem);
      if (hiddenElement !== "unknown") {
        elementRawScores[hiddenElement as KnownElement] += hiddenIndex === 0 ? 16 : 7;
      }
    });
  }

  const maxScore = Math.max(...Object.values(elementRawScores), 1);
  const elementScores = Object.fromEntries(
    Object.entries(elementRawScores).map(([element, score]) => [element, Math.round((score / maxScore) * 100)])
  ) as ElementProfile["elementScores"];
  const stanceByElement = inferElementStances(elementScores, dayElement);
  const interactions = detectElementInteractions(normalized, stanceByElement);
  const relationTagsByNode = new Map<string, string[]>();
  for (const interaction of interactions) {
    for (const participantId of interaction.participantIds) {
      const tags = relationTagsByNode.get(participantId) ?? [];
      tags.push(interaction.title);
      relationTagsByNode.set(participantId, tags);
    }
  }

  const nodes = visibleComponents
    .map((component) =>
      buildVisibleNode({
        component,
        normalized,
        stance: component.element === "unknown" ? "neutral" : stanceByElement[component.element],
        relationTags: relationTagsByNode.get(component.id) ?? []
      })
    )
    .sort((left, right) => right.score - left.score);

  const topElements = Object.entries(elementScores)
    .sort(([, left], [, right]) => right - left)
    .slice(0, 2) as Array<[KnownElement, number]>;
  const favorableElements = elementCycle.filter((element) => stanceByElement[element] === "favorable");
  const unfavorableElements = elementCycle.filter((element) => stanceByElement[element] === "unfavorable");
  const interactionText =
    interactions.length > 0
      ? `结构上还要看${interactions
          .slice(0, 3)
          .map((interaction) => interaction.title)
          .join("、")}，它们会改变单个五行节点的表现方式。`
      : "原局没有形成特别醒目的合局，先看明透干支和藏干之间的承接关系。";
  const overall =
    topElements.length >= 2
      ? `${elementLabels[topElements[0][0]]}${elementLabels[topElements[1][0]]}最容易被命主感受到。当前简化强弱判断里，${formatElementList(
          favorableElements
        )}偏向放大器，${formatElementList(unfavorableElements)}偏向消耗点。${interactionText}`
      : "总体能量较均衡，需要结合大运和现实选择来确定放大器。";

  return {
    overall,
    nodes,
    interactions,
    favorableElements,
    unfavorableElements,
    elementScores
  };
}

type VisiblePillarComponent = {
  id: string;
  pillar: string;
  carrier: string;
  symbol: string;
  element: WuxingElement;
  category: "stem" | "branch";
  weight: number;
  hiddenStems?: string[];
  branch?: string;
};

function buildVisibleNode(params: {
  component: VisiblePillarComponent;
  normalized: NormalizedPaipan;
  stance: ElementEnergyStance;
  relationTags: string[];
}): ElementEnergyNode {
  const { component, normalized, stance, relationTags } = params;
  const score = Math.min(100, Math.max(1, Math.round(component.weight)));
  const dayStem = splitGanzhi(normalized.pillars.day).stem;
  const tenGodStem =
    component.category === "stem" ? component.symbol : component.hiddenStems?.[0] ?? component.symbol;
  const tenGod = getTenGod(dayStem, tenGodStem);
  const element = component.element;
  const elementLabel = element === "unknown" ? "未知" : elementLabels[element as KnownElement];
  const label = `${component.symbol}${elementLabel}`;
  return {
    id: component.id,
    label,
    symbol: component.symbol,
    element,
    score,
    tenGod,
    carrier: component.carrier,
    category: component.category,
    stance,
    relationTags,
    description:
      component.category === "branch"
        ? describeBranchNode(component, elementLabel, tenGod, stance, relationTags)
        : describeStemNode(component.symbol, elementLabel, tenGod, stance, relationTags)
  };
}

function getVisiblePillarComponents(normalized: NormalizedPaipan): VisiblePillarComponent[] {
  return pillarMeta.flatMap((meta) => {
    const pillar = normalized.pillars[meta.key];
    const { stem, branch } = splitGanzhi(pillar);
    const components: VisiblePillarComponent[] = [];
    if (stem) {
      components.push({
        id: `${meta.key}-stem-${stem}`,
        pillar: meta.label,
        carrier: meta.stemCarrier,
        symbol: stem,
        element: getStemElement(stem),
        category: "stem",
        weight: meta.stemWeight
      });
    }
    if (branch) {
      components.push({
        id: `${meta.key}-branch-${branch}`,
        pillar: meta.label,
        carrier: meta.branchCarrier,
        symbol: branch,
        branch,
        element: getBranchElement(branch),
        category: "branch",
        weight: meta.branchWeight,
        hiddenStems: getHiddenStems(branch)
      });
    }
    return components;
  });
}

function inferElementStances(
  elementScores: ElementProfile["elementScores"],
  dayElement: KnownElement | "unknown"
): Record<KnownElement, ElementEnergyStance> {
  const neutral = Object.fromEntries(elementCycle.map((element) => [element, "neutral"])) as Record<
    KnownElement,
    ElementEnergyStance
  >;
  if (dayElement === "unknown") return neutral;

  const dayIndex = elementCycle.indexOf(dayElement);
  const resourceElement = elementCycle[(dayIndex + elementCycle.length - 1) % elementCycle.length];
  const outputElement = elementCycle[(dayIndex + 1) % elementCycle.length];
  const wealthElement = elementCycle[(dayIndex + 2) % elementCycle.length];
  const officerElement = elementCycle[(dayIndex + 3) % elementCycle.length];
  const support = elementScores[dayElement] + elementScores[resourceElement] * 0.65;
  const pressure =
    elementScores[outputElement] * 0.45 + elementScores[wealthElement] * 0.55 + elementScores[officerElement] * 0.65;
  const isWeak = support + 8 < pressure;
  const isStrong = support > pressure + 28;

  if (isWeak) {
    return {
      ...neutral,
      [dayElement]: "favorable",
      [resourceElement]: "favorable",
      [outputElement]: "mixed",
      [wealthElement]: "unfavorable",
      [officerElement]: "unfavorable"
    };
  }
  if (isStrong) {
    return {
      ...neutral,
      [dayElement]: "unfavorable",
      [resourceElement]: "unfavorable",
      [outputElement]: "favorable",
      [wealthElement]: "favorable",
      [officerElement]: "mixed"
    };
  }
  return {
    ...neutral,
    [dayElement]: "mixed",
    [resourceElement]: "favorable",
    [outputElement]: "favorable",
    [wealthElement]: "mixed",
    [officerElement]: "mixed"
  };
}

function detectElementInteractions(
  normalized: NormalizedPaipan,
  stanceByElement: Record<KnownElement, ElementEnergyStance>
): ElementInteraction[] {
  const components = getVisiblePillarComponents(normalized);
  const stemComponents = components.filter((component) => component.category === "stem");
  const branchComponents = components.filter((component) => component.category === "branch");
  const interactions: ElementInteraction[] = [];

  for (const combination of stemCombinations) {
    const participants = findComponentsBySymbols(stemComponents, combination.pair);
    if (participants.length === 2) {
      interactions.push(
        buildInteraction({
          title: combination.title,
          type: "天干五合",
          element: combination.element,
          participants,
          score: 74,
          stance: stanceByElement[combination.element],
          description: `${formatParticipants(participants)}形成${combination.title}。是否真正化气仍要看月令、通根和大运，本模块先把它标记为两股天干力量互相牵引：原本分散的意图会被拉到同一个议题上。`
        })
      );
    }
  }

  for (const combination of branchSixCombinations) {
    const participants = findComponentsBySymbols(branchComponents, combination.pair);
    if (participants.length === 2) {
      interactions.push(
        buildInteraction({
          title: combination.title,
          type: "地支六合",
          element: combination.element,
          participants,
          score: 70,
          stance: stanceByElement[combination.element],
          description: `${formatParticipants(participants)}形成${combination.title}。六合更像暗处的吸附和牵连，会让对应五行的议题更容易在关系、环境或惯性里被带出来。`
        })
      );
    }
  }

  for (const triad of branchTriads) {
    const full = findComponentsBySymbols(branchComponents, triad.branches);
    if (full.length === 3) {
      interactions.push(
        buildInteraction({
          title: triad.title,
          type: "三合局",
          element: triad.element,
          participants: full,
          score: 94,
          stance: stanceByElement[triad.element],
          description: `${formatParticipants(full)}构成${triad.title}。三合局会把分散的地支气势汇成一条更强的流向，对应五行不再只是单点，而是能形成环境、长期动机和事件连续性。`
        })
      );
      continue;
    }

    const present = triad.branches
      .map((branch) => branchComponents.find((component) => component.symbol === branch))
      .filter((component): component is VisiblePillarComponent => Boolean(component));
    if (present.length === 2) {
      const hasCenter = present.some((component) => component.symbol === triad.branches[1]);
      interactions.push(
        buildInteraction({
          title: `${present.map((component) => component.symbol).join("")}${hasCenter ? "半合" : "拱"}${elementLabels[triad.element]}`,
          type: hasCenter ? "三合半局" : "三合拱局",
          element: triad.element,
          participants: present,
          score: hasCenter ? 76 : 62,
          stance: stanceByElement[triad.element],
          description: `${formatParticipants(present)}牵动${triad.title.replace("三合", "")}。两支不等于完整成局，但已经会把对应五行的议题提前点亮，遇到大运或流年补齐时更明显。`
        })
      );
    }
  }

  for (const meeting of branchMeetings) {
    const participants = findComponentsBySymbols(branchComponents, meeting.branches);
    if (participants.length === 3) {
      interactions.push(
        buildInteraction({
          title: meeting.title,
          type: "三会方",
          element: meeting.element,
          participants,
          score: 92,
          stance: stanceByElement[meeting.element],
          description: `${formatParticipants(participants)}构成${meeting.title}。三会更像季节与环境成势，会让对应五行成为命盘的场域背景，而不只是某个节点的力量。`
        })
      );
      continue;
    }

    const present = meeting.branches
      .map((branch) => branchComponents.find((component) => component.symbol === branch))
      .filter((component): component is VisiblePillarComponent => Boolean(component));
    if (present.length === 2) {
      interactions.push(
        buildInteraction({
          title: `${present.map((component) => component.symbol).join("")}半会${elementLabels[meeting.element]}`,
          type: "三会半方",
          element: meeting.element,
          participants: present,
          score: 72,
          stance: stanceByElement[meeting.element],
          description: `${formatParticipants(present)}牵动${meeting.title}。两支未成完整三会，但已经让对应五行在环境气势里露头，遇到大运或流年补齐时会更明显。`
        })
      );
    }
  }

  return dedupeInteractions(interactions).sort((left, right) => right.score - left.score);
}

function buildInteraction(params: {
  title: string;
  type: string;
  element: KnownElement;
  participants: VisiblePillarComponent[];
  score: number;
  stance: ElementEnergyStance;
  description: string;
}): ElementInteraction {
  return {
    id: `${params.type}-${params.title}-${params.participants.map((participant) => participant.id).join("-")}`,
    title: params.title,
    type: params.type,
    element: params.element,
    participants: params.participants.map((participant) => `${participant.carrier}${participant.symbol}`),
    participantIds: params.participants.map((participant) => participant.id),
    score: Math.min(100, Math.max(1, params.score)),
    stance: params.stance,
    description: params.description
  };
}

function findComponentsBySymbols(
  components: VisiblePillarComponent[],
  symbols: readonly string[]
): VisiblePillarComponent[] {
  const matched: VisiblePillarComponent[] = [];
  for (const symbol of symbols) {
    const component = components.find(
      (candidate) => candidate.symbol === symbol && !matched.some((item) => item.id === candidate.id)
    );
    if (component) matched.push(component);
  }
  return matched;
}

function formatParticipants(components: VisiblePillarComponent[]) {
  return components.map((component) => `${component.carrier}${component.symbol}`).join("、");
}

function dedupeInteractions(interactions: ElementInteraction[]) {
  const seen = new Set<string>();
  return interactions.filter((interaction) => {
    const key = `${interaction.type}-${interaction.title}-${interaction.participantIds.join("|")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatElementList(elements: readonly KnownElement[]) {
  if (elements.length === 0) return "暂无明显元素";
  return elements.map((element) => elementLabels[element]).join("、");
}

function buildCurrentEnvironmentDetail(params: {
  normalized: NormalizedPaipan;
  dayunScores: DayunScore[];
  yearlyScores: YearlyScore[];
  generatedAt: string;
}): CurrentEnvironmentDetail {
  const generatedYear = getGeneratedYear(params.generatedAt);
  const currentDayun = getCurrentDayun(params.dayunScores, generatedYear);
  const currentYearly = params.yearlyScores.find((year) => year.year === generatedYear) ?? {
    year: generatedYear,
    ganzhi: getYearGanzhi(generatedYear)
  };
  const cycleLabel = currentDayun
    ? `${currentDayun.ganzhi}大运 · ${currentYearly.ganzhi}年`
    : `${currentYearly.ganzhi}年`;
  const signals = [
    currentDayun ? buildStemSignal(params.normalized, currentDayun.ganzhi, "大运天干") : null,
    buildStemSignal(params.normalized, currentYearly.ganzhi, "流年天干"),
    currentDayun ? buildBranchSignal(params.normalized, currentDayun.ganzhi, "大运地支") : null,
    buildBranchSignal(params.normalized, currentYearly.ganzhi, "流年地支")
  ].filter((signal): signal is CurrentEnvironmentDetail["signals"][number] => Boolean(signal));
  const dedupedSignals = dedupeSignals(signals).slice(0, 4);

  return {
    title: "当前大环境",
    cycleLabel,
    summary:
      dedupedSignals.length > 0
        ? `${dedupedSignals[0].summary}真正的落点不是单一事件，而是这些被触发的结构如何进入当下年龄阶段。`
        : currentDayun?.summary ?? "当前阶段信号较均衡，适合先看十年主线，再观察流年触发。",
    signals: dedupedSignals
  };
}

function buildStemSignal(normalized: NormalizedPaipan, ganzhi: string, carrier: string) {
  const stem = splitGanzhi(ganzhi).stem;
  if (!stem) return null;
  const tenGod = getTenGod(splitGanzhi(normalized.pillars.day).stem, stem);
  const signal = signalForTenGod(tenGod);
  return {
    title: signal.title,
    trigger: `${carrier} ${stem}${tenGod}`,
    summary: signal.summary
  };
}

function buildBranchSignal(normalized: NormalizedPaipan, ganzhi: string, carrier: string) {
  const branch = splitGanzhi(ganzhi).branch;
  if (!branch) return null;
  const natalBranches = Object.values(normalized.pillars).map((pillar) => splitGanzhi(pillar).branch).filter(Boolean);
  const clash = natalBranches.find((natalBranch) => branchClashes[natalBranch] === branch);
  if (clash) {
    return {
      title: "结构被触发",
      trigger: `${carrier} ${branch}冲${clash}`,
      summary: "原局里安静的矛盾被推到台前，适合先定边界、顺序和承接方式。"
    };
  }
  const hiddenStem = getHiddenStems(branch)[0];
  const tenGod = getTenGod(splitGanzhi(normalized.pillars.day).stem, hiddenStem);
  const signal = signalForTenGod(tenGod);
  return {
    title: signal.title,
    trigger: `${carrier} ${branch}中藏${hiddenStem || "未定"}`,
    summary: signal.summary
  };
}

function collectVisibleStemTenGods(normalized: NormalizedPaipan) {
  const dayStem = splitGanzhi(normalized.pillars.day).stem;
  const visible = [normalized.pillars.year, normalized.pillars.month, normalized.pillars.hour]
    .map((pillar) => getTenGod(dayStem, splitGanzhi(pillar).stem))
    .filter(Boolean);
  const priority = ["正官", "七杀", "食神", "伤官", "正印", "偏印", "正财", "偏财", "比肩", "劫财"];
  return [...new Set(visible)]
    .sort((left, right) => priority.indexOf(left) - priority.indexOf(right))
    .slice(0, 3)
    .map((tenGod) => `${tenGod}显`);
}

function getTenGod(dayStem: string, targetStem: string) {
  const dayElement = getStemElement(dayStem);
  const targetElement = getStemElement(targetStem);
  if (!dayStem || !targetStem || dayElement === "unknown" || targetElement === "unknown") return "未定";
  const samePolarity = (stemPolarity[dayStem] as Polarity | undefined) === (stemPolarity[targetStem] as Polarity | undefined);
  if (dayElement === targetElement) return samePolarity ? "比肩" : "劫财";
  if (produces(dayElement as KnownElement, targetElement as KnownElement)) return samePolarity ? "食神" : "伤官";
  if (controls(dayElement as KnownElement, targetElement as KnownElement)) return samePolarity ? "偏财" : "正财";
  if (controls(targetElement as KnownElement, dayElement as KnownElement)) return samePolarity ? "七杀" : "正官";
  if (produces(targetElement as KnownElement, dayElement as KnownElement)) return samePolarity ? "偏印" : "正印";
  return "未定";
}

function produces(left: KnownElement, right: KnownElement) {
  return elementCycle[(elementCycle.indexOf(left) + 1) % elementCycle.length] === right;
}

function controls(left: KnownElement, right: KnownElement) {
  return elementCycle[(elementCycle.indexOf(left) + 2) % elementCycle.length] === right;
}

function signalForTenGod(tenGod: string) {
  if (tenGod === "正官" || tenGod === "七杀") {
    return { title: "规则上桌", summary: "机会披着规则的外衣出现，评价、标准和责任会变得更具体。" };
  }
  if (tenGod === "正印" || tenGod === "偏印") {
    return { title: "专业化", summary: "更适合用学习、证据、流程和系统化能力换位置。" };
  }
  if (tenGod === "食神" || tenGod === "伤官") {
    return { title: "表达成形", summary: "判断、作品和输出会被看见，越清晰越能减少消耗。" };
  }
  if (tenGod === "正财" || tenGod === "偏财") {
    return { title: "资源流动", summary: "现实议题开始移动，关键是边界、交换方式和可持续承接。" };
  }
  if (tenGod === "比肩" || tenGod === "劫财") {
    return { title: "自我与同侪", summary: "自我主张、同辈关系和资源分配更容易变成当下主题。" };
  }
  return { title: "结构显影", summary: "原局信号被推到当下，需要结合现实处境判断落点。" };
}

function describeStemNode(
  stem: string,
  elementLabel: string,
  tenGod: string,
  stance: ElementEnergyStance,
  relationTags: string[]
) {
  const base = `${stem}${elementLabel}在这个盘里对应${tenGod}，是明面上可以被命主直接调用或感受到的入口。`;
  return `${base}${describeTenGodEffect(tenGod)}${describeStance(stance)}${describeRelationTags(relationTags)}`;
}

function describeBranchNode(
  component: VisiblePillarComponent,
  elementLabel: string,
  tenGod: string,
  stance: ElementEnergyStance,
  relationTags: string[]
) {
  const hiddenText =
    component.hiddenStems && component.hiddenStems.length > 0
      ? `其中藏${component.hiddenStems.join("、")}，主气对应${tenGod}。`
      : "藏干未返回。";
  return `${component.symbol}${elementLabel}落在${component.carrier}，更像环境、身体反应和事件承接方式。${hiddenText}${describeTenGodEffect(
    tenGod
  )}${describeStance(stance)}${describeRelationTags(relationTags)}`;
}

function describeTenGodEffect(tenGod: string) {
  if (tenGod === "正官" || tenGod === "七杀") return "它会把命主推向规则、责任、评价和上升压力，发挥好时能变成标准感和位置感。";
  if (tenGod === "正印" || tenGod === "偏印") return "它带来学习、吸收、证据、庇护和系统化能力，发挥好时能把压力转成方法。";
  if (tenGod === "食神" || tenGod === "伤官") return "它负责表达、作品、判断、技术输出和审美标准，发挥好时能把能力做成可交付结果。";
  if (tenGod === "正财" || tenGod === "偏财") return "它牵动资源、现实交换、现金流和边界，发挥好时能把能力接到市场和结果上。";
  if (tenGod === "比肩" || tenGod === "劫财") return "它代表自我、承载、同辈竞争和资源分配，发挥好时能稳住底盘和行动耐力。";
  return "它需要结合大运、流年和现实反馈继续校准。";
}

function describeStance(stance: ElementEnergyStance) {
  if (stance === "favorable") return "在当前简化强弱判断里，它偏喜，适合被点亮、借力和产品化。";
  if (stance === "unfavorable") return "在当前简化强弱判断里，它偏忌，出现太过时容易变成消耗、压力或失衡。";
  if (stance === "mixed") return "这股能量喜忌混杂，关键不在有无，而在剂量、位置和触发时机。";
  return "这股能量暂不强行判喜忌，先看它和其它干支如何互动。";
}

function describeRelationTags(relationTags: string[]) {
  if (relationTags.length === 0) return "";
  return `它同时参与${relationTags.slice(0, 3).join("、")}，所以不能只按单个干支看。`;
}

function dedupeSignals(signals: CurrentEnvironmentDetail["signals"]) {
  const seen = new Set<string>();
  return signals.filter((signal) => {
    const key = `${signal.title}-${signal.trigger}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getGeneratedYear(generatedAt: string) {
  const year = Number(generatedAt.slice(0, 4));
  return Number.isFinite(year) ? year : new Date().getFullYear();
}

function getCurrentDayun(dayunScores: DayunScore[], currentYear: number) {
  return (
    dayunScores.find((dayun) => currentYear >= dayun.startYear && currentYear <= dayun.endYear) ??
    dayunScores.find((dayun) => dayun.startYear > currentYear) ??
    dayunScores[0] ??
    null
  );
}

function formatPillars(normalized: NormalizedPaipan) {
  return [
    cleanGanzhiText(normalized.pillars.year) || "未知",
    cleanGanzhiText(normalized.pillars.month) || "未知",
    cleanGanzhiText(normalized.pillars.day) || "未知",
    cleanGanzhiText(normalized.pillars.hour) || "未知"
  ].join(" ");
}

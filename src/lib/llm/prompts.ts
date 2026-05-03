import fs from "node:fs";
import path from "node:path";
import type { BirthInput } from "@/lib/schemas/birth";
import type { NormalizedPaipan } from "@/lib/schemas/paipan";
import type { ChatMessage } from "@/lib/llm/openai-compatible";
import type { DayunScore, DimensionDefinition, YearlyScore } from "@/lib/schemas/report";
import { buildElementProfile, buildFateContext } from "@/lib/analysis/report-analysis";
import {
  GENERAL_DISCLAIMER,
  HEALTH_DISCLAIMER,
  WEALTH_DISCLAIMER
} from "@/lib/constants";

type LocalPromptDefinition = {
  name: string;
  version: number;
  type: "chat";
  key: LocalPromptKey;
  source: string;
  messages: ChatMessage[];
};

export type LocalPromptKey =
  | "portrait"
  | "overview"
  | "element-energy"
  | "current-environment"
  | "dimensions"
  | "windows"
  | "daily-guidance"
  | "daily-feedback-summary"
  | "weekly-daily"
  | "monthly-rollup"
  | "yearly-memory"
  | "adaptive-score-candidate"
  | "relationship-context";

export const LOCAL_PROMPT_KEYS: LocalPromptKey[] = [
  "portrait",
  "overview",
  "element-energy",
  "current-environment",
  "dimensions",
  "windows",
  "daily-guidance",
  "daily-feedback-summary",
  "weekly-daily",
  "monthly-rollup",
  "yearly-memory",
  "adaptive-score-candidate",
  "relationship-context"
];

const PROMPT_ROOT = path.join(process.cwd(), "prompts", "fate-spectrum");
const localPromptCache = new Map<LocalPromptKey, LocalPromptDefinition>();

export const LOCAL_REPORT_PROMPTS = {
  portrait: getLocalPromptDefinition("portrait").name,
  overview: getLocalPromptDefinition("overview").name,
  elementEnergy: getLocalPromptDefinition("element-energy").name,
  currentEnvironment: getLocalPromptDefinition("current-environment").name,
  dimensions: getLocalPromptDefinition("dimensions").name,
  windows: getLocalPromptDefinition("windows").name
};

export function buildNarrativePrompt(input: {
  normalized: NormalizedPaipan;
  dimensions: DimensionDefinition[];
  dayunScores: DayunScore[];
  yearlyScores: YearlyScore[];
  generatedAt?: string;
}) {
  return buildPromptFromDefinition(getLocalPromptDefinition("overview"), input);
}

export function buildOverviewPrompt(input: PromptInput) {
  return buildPromptFromDefinition(getLocalPromptDefinition("overview"), input);
}

export function buildPortraitPrompt(input: PromptInput) {
  return buildPromptFromDefinition(getLocalPromptDefinition("portrait"), input);
}

export function buildElementEnergyPrompt(input: PromptInput) {
  return buildPromptFromDefinition(getLocalPromptDefinition("element-energy"), input);
}

export function buildCurrentEnvironmentPrompt(input: PromptInput) {
  return buildPromptFromDefinition(getLocalPromptDefinition("current-environment"), input);
}

export function buildDimensionsPrompt(input: PromptInput) {
  return buildPromptFromDefinition(getLocalPromptDefinition("dimensions"), input);
}

export function buildWindowsPrompt(input: PromptInput) {
  return buildPromptFromDefinition(getLocalPromptDefinition("windows"), input);
}

export function getLocalPromptCatalog() {
  return LOCAL_PROMPT_KEYS.map((key) => getLocalPromptDefinition(key));
}

export function getLocalPromptDefinition(key: LocalPromptKey): LocalPromptDefinition {
  const cached = localPromptCache.get(key);
  if (cached) return cached;

  const promptDir = path.join(PROMPT_ROOT, key);
  const metaPath = path.join(promptDir, "prompt.json");
  const systemPath = path.join(promptDir, "system.md");
  const userPath = path.join(promptDir, "user.md");
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as {
    name?: unknown;
    version?: unknown;
    type?: unknown;
  };

  if (typeof meta.name !== "string" || typeof meta.version !== "number" || meta.type !== "chat") {
    throw new Error(`Invalid local prompt metadata: ${metaPath}`);
  }

  const prompt: LocalPromptDefinition = {
    key,
    name: meta.name,
    version: meta.version,
    type: "chat",
    source: path.relative(process.cwd(), promptDir),
    messages: [
      { role: "system" as const, content: fs.readFileSync(systemPath, "utf8").trim() },
      { role: "user" as const, content: fs.readFileSync(userPath, "utf8").trim() }
    ]
  };
  localPromptCache.set(key, prompt);
  return prompt;
}

type PromptInput = {
  birth?: BirthInput;
  normalized: NormalizedPaipan;
  dimensions: DimensionDefinition[];
  dayunScores: DayunScore[];
  yearlyScores: YearlyScore[];
  generatedAt?: string;
};

function buildPromptFromDefinition(promptDefinition: LocalPromptDefinition, input: PromptInput) {
  const context = JSON.stringify(
    buildNarrativeContext(input),
    null,
    2
  );
  const messages = promptDefinition.messages.map((message) => ({
    role: message.role,
    content: compileTemplate(message.content, { context })
  }));
  const system = messages.find((message) => message.role === "system")?.content;
  const user = messages.find((message) => message.role === "user")?.content;

  return {
    name: promptDefinition.name,
    version: promptDefinition.version,
    source: promptDefinition.source,
    system: system ?? "",
    user: user ?? context,
    variables: { context }
  };
}

function buildNarrativeContext(input: {
  birth?: BirthInput;
  normalized: NormalizedPaipan;
  dimensions: DimensionDefinition[];
  dayunScores: DayunScore[];
  yearlyScores: YearlyScore[];
  generatedAt?: string;
}) {
  const currentYear = getCurrentYear(input.generatedAt);
  const currentDayun = getCurrentDayun(input.dayunScores, currentYear);
  const currentYearly = input.yearlyScores.find((year) => year.year === currentYear);
  const currentDayunYears = currentDayun
    ? input.yearlyScores.filter((year) => year.year >= currentDayun.startYear && year.year <= currentDayun.endYear)
    : input.yearlyScores.slice(0, 10);

  return {
    task: "生成命运光谱 narrative。prompt 模板不得硬编码任何示例命盘；只分析本次 context 中的脱敏排盘与规则分数。",
    writingFrame: {
      reportStyle: "参考 Excel 式一生大运流年维度评分报告：八字大运流年为主，紫微宫位用于校准主题；重视维度分数、主判、机会、风险和行动。",
      portrait: "画像只抓最能定义命主运行方式的结构，不做柱位流水账。",
      elementEnergy: "喜用与忌神拆成可量化能量节点，不用二分法上屏。",
      currentEnvironment: "当前环境只输出 2-4 个最强的象；每个象必须有十神、宫位、透干、藏干、合冲刑害、三合三会、伏吟反吟或调候变化作为触发。",
      forbiddenOverviewCopy: ["本报告基于", "免责声明", "高能维度突出", "适合集中资源推进主线", "先看这八步怎么起伏"]
    },
    outputShape: {
      portrait: {
        tags: ["string"],
        summary: "string"
      },
      elementProfile: {
        overall: "string",
        nodes: [
          {
            id: "string",
            label: "string",
            symbol: "string",
            element: "wood|fire|earth|metal|water|unknown",
            score: "0-100",
            tenGod: "string",
            carrier: "string",
            category: "stem|branch|hidden|interaction",
            stance: "favorable|unfavorable|mixed|neutral",
            relationTags: ["string"],
            description: "string"
          }
        ],
        interactions: [
          {
            id: "string",
            title: "string",
            type: "天干五合|地支六合|三合局|三合半局|三会方",
            element: "wood|fire|earth|metal|water|unknown",
            participants: ["string"],
            participantIds: ["string"],
            score: "0-100",
            stance: "favorable|unfavorable|mixed|neutral",
            description: "string"
          }
        ],
        favorableElements: ["wood|fire|earth|metal|water"],
        unfavorableElements: ["wood|fire|earth|metal|water"],
        elementScores: {
          wood: "0-100",
          fire: "0-100",
          earth: "0-100",
          metal: "0-100",
          water: "0-100"
        }
      },
      overview: "string with sections 日主:/命盘格局:/喜用神:/忌神:",
      currentEnvironment: "string focused on currentDayun/currentYear/currentYearly",
      currentEnvironmentDetail: {
        title: "当前大环境",
        cycleLabel: "大运 · 流年",
        summary: "string",
        signals: [{ title: "string", trigger: "string", summary: "string" }]
      },
      dimensions: {
        wealth: "string",
        career: "string",
        comfort: "string",
        selfValue: "string",
        relationship: "string",
        healthEnergy: "string",
        riskControl: "string"
      },
      keyWindows: [
        {
          title: "string",
          startYear: "number",
          endYear: "number",
          reason: "string",
          actions: ["string"]
        }
      ],
      actionPlan: ["string"]
    },
    requiredDisclaimers: [GENERAL_DISCLAIMER, HEALTH_DISCLAIMER, WEALTH_DISCLAIMER],
    userInfo: input.birth
      ? buildFateContext({
          birth: input.birth,
          normalized: input.normalized,
          dayunScores: input.dayunScores,
          yearlyScores: input.yearlyScores,
          generatedAt: input.generatedAt ?? new Date().toISOString()
        })
      : {
          bazi: formatPillars(input.normalized),
          dayun_time: input.dayunScores.map((dayun) => `${dayun.ganzhi} ${dayun.startYear}-${dayun.endYear}`).join("；")
        },
    chart: {
      pillars: input.normalized.pillars,
      identity: sanitizeIdentity(input.normalized.identity),
      outputs: sanitizeOutputs(input.normalized.outputs),
      palaces: input.normalized.palaces.map((palace) => ({
        name: palace.name,
        branch: palace.branch,
        stars: palace.stars.slice(0, 10)
      }))
    },
    analysisSeed: {
      elementProfile: buildElementProfile(input.normalized)
    },
    scoringContext: {
      dimensions: input.dimensions,
      dayunScores: input.dayunScores,
      currentDayun,
      currentYear,
      currentYearly,
      currentDayunYears,
      highWindows: pickYearWindows(currentDayunYears, "high"),
      pressureWindows: pickYearWindows(currentDayunYears, "pressure"),
      currentMonth: null
    }
  };
}

function getCurrentYear(generatedAt?: string) {
  const year = Number((generatedAt ?? new Date().toISOString()).slice(0, 4));
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

function pickYearWindows(rows: YearlyScore[], mode: "high" | "pressure") {
  return [...rows]
    .map((row) => {
      const values = Object.values(row.scores);
      return {
        year: row.year,
        ganzhi: row.ganzhi,
        dayunGanzhi: row.dayunGanzhi,
        score: mode === "high" ? Math.max(...values) : Math.min(row.scores.comfort, row.scores.riskControl),
        notes: row.notes
      };
    })
    .sort((a, b) => (mode === "high" ? b.score - a.score : a.score - b.score))
    .slice(0, 4);
}

function sanitizeIdentity(identity: NormalizedPaipan["identity"]) {
  return {
    shenxiao: identity.shenxiao,
    age: identity.age,
    mingzhu: identity.mingzhu,
    shenzhu: identity.shenzhu,
    fiveelement: identity.fiveelement,
    yinyanggender: identity.yinyanggender
  };
}

function sanitizeOutputs(outputs: NormalizedPaipan["outputs"]) {
  return Object.fromEntries(
    Object.entries(outputs).map(([key, value]) => [key, redactPrivateText(value).slice(0, 900)])
  );
}

function redactPrivateText(value: string) {
  return value
    .replace(/\d{4}-\d{2}-\d{2}/g, "[日期]")
    .replace(/\d{4}年\d{1,2}月\d{1,2}日/g, "[日期]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[邮箱]")
    .replace(/1[3-9]\d{9}/g, "[手机号]");
}

function formatPillars(normalized: NormalizedPaipan) {
  return [normalized.pillars.year, normalized.pillars.month, normalized.pillars.day, normalized.pillars.hour].join(" ");
}

function compileTemplate(template: string, variables: Record<string, string>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => variables[key] ?? "");
}

import { z } from "zod";
import { BirthInputSchema } from "@/lib/schemas/birth";
import { NormalizedPaipanSchema, PaipanResponseSchema } from "@/lib/schemas/paipan";
import { ProviderConfigSchema } from "@/lib/schemas/provider";

export const DimensionIdSchema = z.enum([
  "wealth",
  "career",
  "comfort",
  "selfValue",
  "relationship",
  "healthEnergy",
  "riskControl"
]);

export const DimensionDefinitionSchema = z.object({
  id: DimensionIdSchema,
  label: z.string(),
  meaning: z.string(),
  color: z.string()
});

const ScoreValueSchema = z.number().min(0).max(100);

export const ScoreMapSchema = z.object({
  wealth: ScoreValueSchema,
  career: ScoreValueSchema,
  comfort: ScoreValueSchema,
  selfValue: ScoreValueSchema,
  relationship: ScoreValueSchema,
  healthEnergy: ScoreValueSchema,
  riskControl: ScoreValueSchema
});

export const DayunScoreSchema = z.object({
  index: z.number(),
  ganzhi: z.string(),
  age: z.number(),
  startYear: z.number(),
  endYear: z.number(),
  scores: ScoreMapSchema,
  notes: z.array(z.string()),
  summary: z.string()
});

export const YearlyScoreSchema = z.object({
  year: z.number(),
  age: z.number().optional(),
  ganzhi: z.string(),
  dayunGanzhi: z.string().optional(),
  scores: ScoreMapSchema,
  notes: z.array(z.string())
});

export const KeyWindowSchema = z.object({
  title: z.string(),
  startYear: z.number(),
  endYear: z.number(),
  reason: z.string(),
  actions: z.array(z.string())
});

export const FateContextSchema = z.object({
  nowtime: z.string().optional(),
  calendar: z.array(z.string()).default([]),
  name: z.string().default("匿名命主"),
  gender: z.string().default("unknown"),
  isTai: z.string().optional(),
  birth_correct: z.string().optional(),
  city: z.string().optional(),
  bazi: z.string(),
  dayun_time: z.string().default(""),
  qiyun_time: z.string().optional(),
  jiaoyun_time: z.string().optional()
});

export const PortraitSchema = z.object({
  tags: z.array(z.string()).default([]),
  summary: z.string().default("")
});

export const ElementEnergyStanceSchema = z.enum(["favorable", "unfavorable", "mixed", "neutral"]);

export const ElementEnergyNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  symbol: z.string(),
  element: z.enum(["wood", "fire", "earth", "metal", "water", "unknown"]),
  score: ScoreValueSchema,
  tenGod: z.string(),
  carrier: z.string(),
  category: z.enum(["stem", "branch", "hidden", "interaction"]).default("stem"),
  stance: ElementEnergyStanceSchema.default("neutral"),
  relationTags: z.array(z.string()).default([]),
  description: z.string()
});

export const ElementInteractionSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  element: z.enum(["wood", "fire", "earth", "metal", "water", "unknown"]),
  participants: z.array(z.string()),
  participantIds: z.array(z.string()).default([]),
  score: ScoreValueSchema,
  stance: ElementEnergyStanceSchema.default("neutral"),
  description: z.string()
});

export const ElementProfileSchema = z.object({
  overall: z.string().default(""),
  nodes: z.array(ElementEnergyNodeSchema).default([]),
  interactions: z.array(ElementInteractionSchema).default([]),
  favorableElements: z.array(z.enum(["wood", "fire", "earth", "metal", "water"])).default([]),
  unfavorableElements: z.array(z.enum(["wood", "fire", "earth", "metal", "water"])).default([]),
  elementScores: z.object({
    wood: ScoreValueSchema,
    fire: ScoreValueSchema,
    earth: ScoreValueSchema,
    metal: ScoreValueSchema,
    water: ScoreValueSchema
  })
});

export const CurrentEnvironmentSignalSchema = z.object({
  title: z.string(),
  trigger: z.string(),
  summary: z.string()
});

export const CurrentEnvironmentDetailSchema = z.object({
  title: z.string().default("当前大环境"),
  cycleLabel: z.string().default(""),
  summary: z.string().default(""),
  signals: z.array(CurrentEnvironmentSignalSchema).default([])
});

export const ReportAnalysisSchema = z.object({
  context: FateContextSchema,
  portrait: PortraitSchema,
  elementProfile: ElementProfileSchema,
  currentEnvironment: CurrentEnvironmentDetailSchema
});

export const NarrativeSchema = z.object({
  overview: z.string(),
  currentEnvironment: z.string().default(""),
  portrait: PortraitSchema.optional(),
  elementProfile: ElementProfileSchema.optional(),
  currentEnvironmentDetail: CurrentEnvironmentDetailSchema.optional(),
  dimensions: z.object({
    wealth: z.string(),
    career: z.string(),
    comfort: z.string(),
    selfValue: z.string(),
    relationship: z.string(),
    healthEnergy: z.string(),
    riskControl: z.string()
  }),
  keyWindows: z.array(KeyWindowSchema),
  actionPlan: z.array(z.string())
});

export const ReportResponseSchema = z.object({
  meta: z.object({
    generatedAt: z.string(),
    engineVersion: z.string(),
    provider: z.string(),
    hasLlmNarrative: z.boolean(),
    notices: z.array(z.string()).default([])
  }),
  birth: BirthInputSchema,
  normalized: NormalizedPaipanSchema,
  dimensions: z.array(DimensionDefinitionSchema),
  dayunScores: z.array(DayunScoreSchema),
  yearlyScores: z.array(YearlyScoreSchema),
  narratives: NarrativeSchema,
  analysis: ReportAnalysisSchema.optional(),
  rawPaipan: PaipanResponseSchema
});

export const PaipanApiRequestSchema = z.object({
  birth: BirthInputSchema,
  provider: ProviderConfigSchema
});

export const PaipanApiResponseSchema = z.object({
  paipan: PaipanResponseSchema,
  normalized: NormalizedPaipanSchema
});

export const ReportApiRequestSchema = z.object({
  birth: BirthInputSchema,
  paipanProvider: ProviderConfigSchema,
  llmProvider: ProviderConfigSchema,
  options: z.object({
    useLlmNarrative: z.boolean(),
    includeRawJson: z.boolean(),
    profileRole: z.enum(["owner", "guest"]).optional()
  })
});

export type DimensionId = z.infer<typeof DimensionIdSchema>;
export type DimensionDefinition = z.infer<typeof DimensionDefinitionSchema>;
export type ScoreMap = z.infer<typeof ScoreMapSchema>;
export type DayunScore = z.infer<typeof DayunScoreSchema>;
export type YearlyScore = z.infer<typeof YearlyScoreSchema>;
export type KeyWindow = z.infer<typeof KeyWindowSchema>;
export type FateContext = z.infer<typeof FateContextSchema>;
export type Portrait = z.infer<typeof PortraitSchema>;
export type ElementEnergyStance = z.infer<typeof ElementEnergyStanceSchema>;
export type ElementEnergyNode = z.infer<typeof ElementEnergyNodeSchema>;
export type ElementInteraction = z.infer<typeof ElementInteractionSchema>;
export type ElementProfile = z.infer<typeof ElementProfileSchema>;
export type CurrentEnvironmentSignal = z.infer<typeof CurrentEnvironmentSignalSchema>;
export type CurrentEnvironmentDetail = z.infer<typeof CurrentEnvironmentDetailSchema>;
export type ReportAnalysis = z.infer<typeof ReportAnalysisSchema>;
export type Narrative = z.infer<typeof NarrativeSchema>;
export type ReportResponse = z.infer<typeof ReportResponseSchema>;
export type ReportApiRequest = z.infer<typeof ReportApiRequestSchema>;

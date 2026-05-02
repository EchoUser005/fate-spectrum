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

export const NarrativeSchema = z.object({
  overview: z.string(),
  currentEnvironment: z.string().default(""),
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
export type Narrative = z.infer<typeof NarrativeSchema>;
export type ReportResponse = z.infer<typeof ReportResponseSchema>;
export type ReportApiRequest = z.infer<typeof ReportApiRequestSchema>;

import { providerPresets } from "@/lib/config/providers";
import { NarrativeSchema, type Narrative, type ReportResponse } from "@/lib/schemas/report";
import type { z } from "zod";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { callDeepSeekChat } from "@/lib/llm/deepseek";
import { getLangfuseChatMessages } from "@/lib/llm/langfuse";
import { callOpenAiCompatibleChat } from "@/lib/llm/openai-compatible";
import {
  buildDimensionsPrompt,
  buildOverviewPrompt,
  buildWindowsPrompt,
  LOCAL_REPORT_PROMPTS
} from "@/lib/llm/prompts";
import { extractJsonObject } from "@/lib/llm/safe-json";

const OverviewNarrativeSchema = NarrativeSchema.pick({ overview: true });
const DimensionsNarrativeSchema = NarrativeSchema.pick({ dimensions: true });
const WindowsNarrativeSchema = NarrativeSchema.pick({ keyWindows: true, actionPlan: true });

export async function generateLlmNarrative(
  baseReport: ReportResponse,
  config: ProviderConfig
): Promise<Narrative | null> {
  if (config.provider !== "deepseek" && config.provider !== "openai-compatible") {
    return null;
  }
  if (!config.apiKey) {
    return null;
  }

  const promptInput = {
    normalized: baseReport.normalized,
    dimensions: baseReport.dimensions,
    dayunScores: baseReport.dayunScores,
    yearlyScores: baseReport.yearlyScores,
    generatedAt: baseReport.meta.generatedAt
  };

  const [overview, dimensions, windows] = await Promise.all([
    runPromptPart({
      name: LOCAL_REPORT_PROMPTS.overview,
      prompt: buildOverviewPrompt(promptInput),
      schema: OverviewNarrativeSchema,
      config
    }),
    runPromptPart({
      name: LOCAL_REPORT_PROMPTS.dimensions,
      prompt: buildDimensionsPrompt(promptInput),
      schema: DimensionsNarrativeSchema,
      config
    }),
    runPromptPart({
      name: LOCAL_REPORT_PROMPTS.windows,
      prompt: buildWindowsPrompt(promptInput),
      schema: WindowsNarrativeSchema,
      config
    })
  ]);

  if (!overview || !dimensions || !windows) return null;

  return NarrativeSchema.parse({
    ...overview,
    ...dimensions,
    ...windows
  });
}

async function runPromptPart<T extends z.ZodTypeAny>(params: {
  name: string;
  prompt: { system: string; user: string };
  schema: T;
  config: ProviderConfig;
}): Promise<z.infer<T> | null> {
  const fallbackMessages = [
    { role: "system" as const, content: params.prompt.system },
    { role: "user" as const, content: params.prompt.user }
  ];
  const messages = await getLangfuseChatMessages({
    name: params.name,
    variables: {
      context: params.prompt.user
    },
    fallback: fallbackMessages
  });

  try {
    const content =
      params.config.provider === "deepseek"
        ? await callDeepSeekChat(params.config, messages)
        : await callOpenAiCompatibleChat({
            config: params.config,
            messages,
            defaultBaseUrl: providerPresets.openaiCompatible.baseUrl,
            defaultModel: providerPresets.openaiCompatible.model
          });

    return params.schema.parse(extractJsonObject(content));
  } catch {
    return null;
  }
}

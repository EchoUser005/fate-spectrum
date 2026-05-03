import { providerPresets } from "@/lib/config/providers";
import {
  CurrentEnvironmentDetailSchema,
  ElementProfileSchema,
  NarrativeSchema,
  PortraitSchema,
  type Narrative,
  type ReportResponse
} from "@/lib/schemas/report";
import { z } from "zod";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { callDeepSeekChatCompletion } from "@/lib/llm/deepseek";
import {
  createLangfuseReportTrace,
  ensureLangfusePromptCatalogSeeded,
  getLangfuseChatPrompt
} from "@/lib/llm/langfuse";
import { callOpenAiCompatibleChatCompletion } from "@/lib/llm/openai-compatible";
import {
  buildCurrentEnvironmentPrompt,
  buildDimensionsPrompt,
  buildElementEnergyPrompt,
  buildOverviewPrompt,
  buildPortraitPrompt,
  buildWindowsPrompt,
  getLocalPromptCatalog,
  LOCAL_REPORT_PROMPTS
} from "@/lib/llm/prompts";
import { extractJsonObject } from "@/lib/llm/safe-json";

const OverviewNarrativeSchema = NarrativeSchema.pick({ overview: true });
const PortraitNarrativeSchema = z.object({ portrait: PortraitSchema });
const ElementEnergyNarrativeSchema = z.object({ elementProfile: ElementProfileSchema });
const CurrentEnvironmentNarrativeSchema = z.object({
  currentEnvironment: z.string(),
  currentEnvironmentDetail: CurrentEnvironmentDetailSchema.optional()
});
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
    birth: baseReport.birth,
    normalized: baseReport.normalized,
    dimensions: baseReport.dimensions,
    dayunScores: baseReport.dayunScores,
    yearlyScores: baseReport.yearlyScores,
    generatedAt: baseReport.meta.generatedAt
  };

  await ensureLangfusePromptCatalogSeeded(getLocalPromptCatalog());
  const trace = createLangfuseReportTrace({
    name: "fate-spectrum/report-generation",
    input: {
      context: baseReport.analysis?.context,
      modules: ["portrait", "element-energy", "current-environment", "overview", "dimensions", "windows"]
    },
    metadata: {
      provider: config.provider,
      model: config.model,
      hasBaseAnalysis: Boolean(baseReport.analysis)
    },
    tags: ["report", "prompt-pipeline"]
  });

  try {
    const [portrait, overview, elementProfile, currentEnvironment, dimensions, windows] = await Promise.all([
      runPromptPart({
        name: LOCAL_REPORT_PROMPTS.portrait,
        prompt: buildPortraitPrompt(promptInput),
        schema: PortraitNarrativeSchema,
        config,
        trace
      }),
      runPromptPart({
        name: LOCAL_REPORT_PROMPTS.overview,
        prompt: buildOverviewPrompt(promptInput),
        schema: OverviewNarrativeSchema,
        config,
        trace
      }),
      runPromptPart({
        name: LOCAL_REPORT_PROMPTS.elementEnergy,
        prompt: buildElementEnergyPrompt(promptInput),
        schema: ElementEnergyNarrativeSchema,
        config,
        trace
      }),
      runPromptPart({
        name: LOCAL_REPORT_PROMPTS.currentEnvironment,
        prompt: buildCurrentEnvironmentPrompt(promptInput),
        schema: CurrentEnvironmentNarrativeSchema,
        config,
        trace
      }),
      runPromptPart({
        name: LOCAL_REPORT_PROMPTS.dimensions,
        prompt: buildDimensionsPrompt(promptInput),
        schema: DimensionsNarrativeSchema,
        config,
        trace
      }),
      runPromptPart({
        name: LOCAL_REPORT_PROMPTS.windows,
        prompt: buildWindowsPrompt(promptInput),
        schema: WindowsNarrativeSchema,
        config,
        trace
      })
    ]);

    const hasAnyGeneratedModule = Boolean(
      portrait || overview || elementProfile || currentEnvironment || dimensions || windows
    );
    if (!hasAnyGeneratedModule) {
      await trace?.flush({ error: "all prompt modules failed" });
      return null;
    }

    const narrative = NarrativeSchema.parse({
      ...baseReport.narratives,
      ...(overview ?? {}),
      ...(portrait ?? {}),
      ...(elementProfile ?? {}),
      ...(currentEnvironment ?? {}),
      ...(dimensions ?? {}),
      ...(windows ?? {})
    });

    await trace?.flush({
      output: {
        modules: {
          portrait: Boolean(portrait),
          overview: Boolean(overview),
          elementEnergy: Boolean(elementProfile),
          currentEnvironment: Boolean(currentEnvironment),
          dimensions: Boolean(dimensions),
          windows: Boolean(windows)
        }
      }
    });
    return narrative;
  } catch (error) {
    await trace?.flush({ error: error instanceof Error ? error.message : "LLM narrative generation failed" });
    return null;
  }
}

async function runPromptPart<T extends z.ZodTypeAny>(params: {
  name: string;
  prompt: { system: string; user: string; variables: Record<string, string>; version: number; source: string };
  schema: T;
  config: ProviderConfig;
  trace: ReturnType<typeof createLangfuseReportTrace>;
}): Promise<z.infer<T> | null> {
  const fallbackMessages = [
    { role: "system" as const, content: params.prompt.system },
    { role: "user" as const, content: params.prompt.user }
  ];
  const prompt = await getLangfuseChatPrompt({
    name: params.name,
    variables: params.prompt.variables,
    fallback: fallbackMessages,
    fallbackVersion: params.prompt.version
  });
  const startedAt = new Date().toISOString();

  try {
    const completion =
      params.config.provider === "deepseek"
        ? await callDeepSeekChatCompletion(params.config, prompt.messages)
        : await callOpenAiCompatibleChatCompletion({
            config: params.config,
            messages: prompt.messages,
            defaultBaseUrl: providerPresets.openaiCompatible.baseUrl,
            defaultModel: providerPresets.openaiCompatible.model
          });
    const parsed = params.schema.parse(extractJsonObject(completion.content));
    params.trace?.recordGeneration({
      name: `prompt:${params.name}`,
      promptName: params.name,
      promptVersion: prompt.version,
      promptSource: prompt.source,
      provider: params.config.provider,
      model: completion.model ?? params.config.model,
      startTime: startedAt,
      endTime: new Date().toISOString(),
      input: { messages: prompt.messages },
      output: { content: completion.content, parsed },
      usage: completion.usage,
      metadata: {
        localPromptVersion: params.prompt.version,
        localPromptSource: params.prompt.source,
        finishReason: completion.finishReason
      }
    });

    return parsed;
  } catch (error) {
    params.trace?.recordGeneration({
      name: `prompt:${params.name}`,
      promptName: params.name,
      promptVersion: prompt.version,
      promptSource: prompt.source,
      provider: params.config.provider,
      model: params.config.model,
      startTime: startedAt,
      endTime: new Date().toISOString(),
      input: { messages: prompt.messages },
      error: error instanceof Error ? error.message : "prompt module failed",
      metadata: {
        localPromptVersion: params.prompt.version,
        localPromptSource: params.prompt.source
      }
    });
    return null;
  }
}

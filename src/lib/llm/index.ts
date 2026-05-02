import { providerPresets } from "@/lib/config/providers";
import { NarrativeSchema, type Narrative, type ReportResponse } from "@/lib/schemas/report";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { callDeepSeekChat } from "@/lib/llm/deepseek";
import { getLangfuseChatMessages } from "@/lib/llm/langfuse";
import { callOpenAiCompatibleChat } from "@/lib/llm/openai-compatible";
import { buildNarrativePrompt, LOCAL_NARRATIVE_PROMPT_NAME } from "@/lib/llm/prompts";
import { extractJsonObject } from "@/lib/llm/safe-json";

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

  const prompt = buildNarrativePrompt({
    normalized: baseReport.normalized,
    dimensions: baseReport.dimensions,
    dayunScores: baseReport.dayunScores,
    yearlyScores: baseReport.yearlyScores,
    generatedAt: baseReport.meta.generatedAt
  });
  const fallbackMessages = [
    { role: "system" as const, content: prompt.system },
    { role: "user" as const, content: prompt.user }
  ];
  const messages = await getLangfuseChatMessages({
    name: LOCAL_NARRATIVE_PROMPT_NAME,
    variables: {
      context: prompt.user
    },
    fallback: fallbackMessages
  });

  try {
    const content =
      config.provider === "deepseek"
        ? await callDeepSeekChat(config, messages)
        : await callOpenAiCompatibleChat({
            config,
            messages,
            defaultBaseUrl: providerPresets.openaiCompatible.baseUrl,
            defaultModel: providerPresets.openaiCompatible.model
          });

    return NarrativeSchema.parse(extractJsonObject(content));
  } catch {
    return null;
  }
}

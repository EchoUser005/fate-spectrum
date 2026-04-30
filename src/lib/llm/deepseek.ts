import { providerPresets } from "@/lib/config/providers";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { callOpenAiCompatibleChat, type ChatMessage } from "@/lib/llm/openai-compatible";

export async function callDeepSeekChat(config: ProviderConfig, messages: ChatMessage[]) {
  return callOpenAiCompatibleChat({
    config,
    messages,
    defaultBaseUrl: providerPresets.deepseek.baseUrl,
    defaultModel: providerPresets.deepseek.model
  });
}

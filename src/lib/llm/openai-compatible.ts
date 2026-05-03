import type { ProviderConfig } from "@/lib/schemas/provider";

export type ChatMessage = {
  role: "system" | "user";
  content: string;
};

export type ChatCompletionUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

export type ChatCompletionResult = {
  content: string;
  model?: string;
  usage?: ChatCompletionUsage;
  finishReason?: string;
};

export async function callOpenAiCompatibleChat(params: {
  config: ProviderConfig;
  messages: ChatMessage[];
  defaultBaseUrl: string;
  defaultModel: string;
}) {
  const result = await callOpenAiCompatibleChatCompletion(params);
  return result.content;
}

export async function callOpenAiCompatibleChatCompletion(params: {
  config: ProviderConfig;
  messages: ChatMessage[];
  defaultBaseUrl: string;
  defaultModel: string;
}): Promise<ChatCompletionResult> {
  const apiKey = params.config.apiKey;
  if (!apiKey) {
    throw new Error("LLM API key is required for narrative generation.");
  }

  const baseUrl = params.config.baseUrl || params.defaultBaseUrl;
  const model = params.config.model || params.defaultModel;
  const response = await fetch(joinChatCompletionsUrl(baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: params.messages,
      temperature: 0.4,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`LLM provider failed with HTTP ${response.status}`);
  }

  return extractChatCompletion(await response.json(), model);
}

export function joinChatCompletionsUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/chat/completions`;
}

function extractChatCompletion(payload: unknown, fallbackModel: string): ChatCompletionResult {
  if (!payload || typeof payload !== "object") {
    throw new Error("LLM provider returned a non-object payload.");
  }
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new Error("LLM provider returned no choices.");
  }
  const first = choices[0];
  if (!first || typeof first !== "object") {
    throw new Error("LLM provider returned an invalid choice.");
  }
  const message = (first as { message?: unknown }).message;
  if (!message || typeof message !== "object") {
    throw new Error("LLM provider returned an invalid message.");
  }
  const content = (message as { content?: unknown }).content;
  if (typeof content !== "string") {
    throw new Error("LLM provider returned non-text content.");
  }
  const finishReason = (first as { finish_reason?: unknown }).finish_reason;
  const usage = parseUsage((payload as { usage?: unknown }).usage);
  const model = (payload as { model?: unknown }).model;
  return {
    content,
    model: typeof model === "string" ? model : fallbackModel,
    usage,
    finishReason: typeof finishReason === "string" ? finishReason : undefined
  };
}

function parseUsage(value: unknown): ChatCompletionUsage | undefined {
  if (!value || typeof value !== "object") return undefined;
  const promptTokens = readNumber(value, "prompt_tokens");
  const completionTokens = readNumber(value, "completion_tokens");
  const totalTokens = readNumber(value, "total_tokens");
  if (promptTokens === undefined && completionTokens === undefined && totalTokens === undefined) return undefined;
  return { promptTokens, completionTokens, totalTokens };
}

function readNumber(value: unknown, key: string) {
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "number" && Number.isFinite(field) ? field : undefined;
}

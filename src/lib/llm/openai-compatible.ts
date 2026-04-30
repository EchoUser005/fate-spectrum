import type { ProviderConfig } from "@/lib/schemas/provider";

export type ChatMessage = {
  role: "system" | "user";
  content: string;
};

export async function callOpenAiCompatibleChat(params: {
  config: ProviderConfig;
  messages: ChatMessage[];
  defaultBaseUrl: string;
  defaultModel: string;
}) {
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

  return extractChatContent(await response.json());
}

export function joinChatCompletionsUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/chat/completions`;
}

function extractChatContent(payload: unknown) {
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
  return content;
}

import type { ChatMessage } from "@/lib/llm/openai-compatible";

type LangfusePromptPayload = {
  prompt?: unknown;
};

export async function getLangfuseChatMessages(params: {
  name: string;
  variables: Record<string, string>;
  fallback: ChatMessage[];
}) {
  const baseUrl = process.env.LANGFUSE_BASE_URL || process.env.LANGFUSE_HOST;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  if (!baseUrl || !publicKey || !secretKey) return params.fallback;

  try {
    const url = new URL(`/api/public/v2/prompts/${encodeURIComponent(params.name)}`, baseUrl);
    url.searchParams.set("label", process.env.LANGFUSE_PROMPT_LABEL || "production");
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString("base64")}`
      },
      cache: "no-store"
    });
    if (!response.ok) return params.fallback;

    const payload = (await response.json()) as LangfusePromptPayload;
    const prompt = parseChatPrompt(payload.prompt);
    if (!prompt) return params.fallback;
    return prompt.map((message) => ({
      role: message.role,
      content: compileTemplate(message.content, params.variables)
    }));
  } catch {
    return params.fallback;
  }
}

function parseChatPrompt(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value)) return null;
  const messages = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const role = (item as { role?: unknown }).role;
      const content = (item as { content?: unknown }).content;
      if ((role !== "system" && role !== "user") || typeof content !== "string") return null;
      return { role, content };
    })
    .filter((message): message is ChatMessage => Boolean(message));
  return messages.length > 0 ? messages : null;
}

function compileTemplate(template: string, variables: Record<string, string>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => variables[key] ?? "");
}

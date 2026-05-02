import type { ChatMessage } from "@/lib/llm/openai-compatible";

type LangfusePromptPayload = {
  prompt?: unknown;
};

type LocalPromptSeed = {
  name: string;
  version: number;
  type: "chat";
  source: string;
  messages: ChatMessage[];
};

let catalogSeedPromise: Promise<void> | null = null;

export async function getLangfuseChatMessages(params: {
  name: string;
  variables: Record<string, string>;
  fallback: ChatMessage[];
}) {
  const config = getLangfuseConfig();
  if (!config) return params.fallback;

  try {
    const response = await fetchLangfusePrompt(config, params.name);
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

export async function ensureLangfusePromptCatalogSeeded(prompts: LocalPromptSeed[]) {
  const config = getLangfuseConfig();
  if (!config || prompts.length === 0) return;

  catalogSeedPromise ??= Promise.all(prompts.map((prompt) => seedPromptIfMissing(config, prompt))).then(
    () => undefined,
    () => undefined
  );
  await catalogSeedPromise;
}

async function seedPromptIfMissing(config: LangfuseConfig, prompt: LocalPromptSeed) {
  const existing = await fetchLangfusePrompt(config, prompt.name);
  if (existing.ok) return;
  if (existing.status !== 404) return;

  await fetchWithTimeout(new URL("/api/public/v2/prompts", config.baseUrl), {
    method: "POST",
    headers: {
      Authorization: config.authorization,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: prompt.name,
      type: prompt.type,
      prompt: prompt.messages,
      labels: [config.label],
      config: {
        localVersion: prompt.version,
        source: prompt.source,
        seedMode: "missing-only"
      }
    })
  });
}

type LangfuseConfig = {
  baseUrl: string;
  authorization: string;
  label: string;
};

function getLangfuseConfig(): LangfuseConfig | null {
  const baseUrl = process.env.LANGFUSE_BASE_URL || process.env.LANGFUSE_HOST;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  if (!baseUrl || !publicKey || !secretKey) return null;

  return {
    baseUrl,
    authorization: `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString("base64")}`,
    label: process.env.LANGFUSE_PROMPT_LABEL || "prod"
  };
}

function fetchLangfusePrompt(config: LangfuseConfig, name: string) {
  const url = new URL(`/api/public/v2/prompts/${encodeURIComponent(name)}`, config.baseUrl);
  url.searchParams.set("label", config.label);
  return fetchWithTimeout(url, {
    headers: {
      Authorization: config.authorization
    },
    cache: "no-store"
  });
}

function fetchWithTimeout(url: URL, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  return fetch(url, {
    ...init,
    signal: controller.signal
  }).finally(() => clearTimeout(timeout));
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

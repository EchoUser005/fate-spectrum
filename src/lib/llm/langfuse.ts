import { randomUUID } from "node:crypto";
import type { ChatMessage } from "@/lib/llm/openai-compatible";
import type { ChatCompletionUsage } from "@/lib/llm/openai-compatible";

type LangfusePromptPayload = {
  prompt?: unknown;
  version?: unknown;
};

type LocalPromptSeed = {
  name: string;
  version: number;
  type: "chat";
  source: string;
  messages: ChatMessage[];
};

type LangfuseChatPrompt = {
  name: string;
  label: string;
  source: "langfuse" | "local";
  version?: number;
  messages: ChatMessage[];
};

type LangfuseTraceContentMode = "redacted" | "full";

type LangfuseGenerationRecord = {
  id: string;
  name: string;
  promptName: string;
  promptVersion?: number;
  promptSource: LangfuseChatPrompt["source"];
  model?: string;
  provider: string;
  startTime: string;
  endTime: string;
  input: unknown;
  output?: unknown;
  usage?: ChatCompletionUsage;
  error?: string;
  metadata?: Record<string, unknown>;
};

type LangfuseReportTrace = {
  traceId: string;
  recordGeneration(record: Omit<LangfuseGenerationRecord, "id"> & { id?: string }): void;
  flush(params: { output?: unknown; error?: string }): Promise<void>;
};

let catalogSeedPromise: Promise<void> | null = null;

export async function getLangfuseChatMessages(params: {
  name: string;
  variables: Record<string, string>;
  fallback: ChatMessage[];
}) {
  const prompt = await getLangfuseChatPrompt(params);
  return prompt.messages;
}

export async function getLangfuseChatPrompt(params: {
  name: string;
  variables: Record<string, string>;
  fallback: ChatMessage[];
  fallbackVersion?: number;
}): Promise<LangfuseChatPrompt> {
  const config = getLangfuseConfig();
  if (!config) {
    return {
      name: params.name,
      label: "local",
      source: "local",
      version: params.fallbackVersion,
      messages: params.fallback
    };
  }

  try {
    const response = await fetchLangfusePrompt(config, params.name);
    if (!response.ok) {
      return {
        name: params.name,
        label: config.label,
        source: "local",
        version: params.fallbackVersion,
        messages: params.fallback
      };
    }

    const payload = (await response.json()) as LangfusePromptPayload;
    const prompt = parseChatPrompt(payload.prompt);
    if (!prompt) {
      return {
        name: params.name,
        label: config.label,
        source: "local",
        version: params.fallbackVersion,
        messages: params.fallback
      };
    }
    return {
      name: params.name,
      label: config.label,
      source: "langfuse",
      version: typeof payload.version === "number" ? payload.version : undefined,
      messages: prompt.map((message) => ({
        role: message.role,
        content: compileTemplate(message.content, params.variables)
      }))
    };
  } catch {
    return {
      name: params.name,
      label: config?.label ?? "local",
      source: "local",
      version: params.fallbackVersion,
      messages: params.fallback
    };
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

export function createLangfuseReportTrace(params: {
  name: string;
  input: unknown;
  metadata?: Record<string, unknown>;
  tags?: string[];
}): LangfuseReportTrace | null {
  const config = getLangfuseConfig();
  if (!config || process.env.LANGFUSE_TRACE_ENABLED === "false") return null;

  const traceId = randomUUID();
  const traceStartedAt = new Date().toISOString();
  const generations: LangfuseGenerationRecord[] = [];
  const contentMode = getTraceContentMode();

  return {
    traceId,
    recordGeneration(record) {
      generations.push({
        ...record,
        id: record.id ?? randomUUID()
      });
    },
    async flush(flushParams) {
      const traceOutput = flushParams.error ? { error: flushParams.error } : flushParams.output;
      const batch = [
        {
          id: randomUUID(),
          timestamp: traceStartedAt,
          type: "trace-create",
          body: {
            id: traceId,
            name: params.name,
            input: sanitizeTraceValue(params.input, contentMode),
            output: sanitizeTraceValue(traceOutput, contentMode),
            metadata: {
              ...params.metadata,
              traceContent: contentMode,
              promptLabel: config.label
            },
            tags: params.tags,
            timestamp: traceStartedAt
          }
        },
        ...generations.map((generation) => ({
          id: randomUUID(),
          timestamp: generation.endTime,
          type: "generation-create",
          body: {
            id: generation.id,
            traceId,
            name: generation.name,
            startTime: generation.startTime,
            endTime: generation.endTime,
            model: generation.model,
            modelParameters: {
              provider: generation.provider
            },
            input: sanitizeTraceValue(generation.input, contentMode),
            output: sanitizeTraceValue(generation.error ? { error: generation.error } : generation.output, contentMode),
            usage: normalizeLegacyUsage(generation.usage),
            usageDetails: normalizeUsageDetails(generation.usage),
            level: generation.error ? "ERROR" : "DEFAULT",
            statusMessage: generation.error,
            promptName: generation.promptName,
            promptVersion: generation.promptVersion,
            metadata: {
              ...generation.metadata,
              promptSource: generation.promptSource,
              promptLabel: config.label
            }
          }
        }))
      ];

      try {
        await fetchWithTimeout(new URL("/api/public/ingestion", config.baseUrl), {
          method: "POST",
          headers: {
            Authorization: config.authorization,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            batch,
            metadata: {
              batchSize: batch.length,
              source: "fate-spectrum-next-api"
            }
          })
        });
      } catch {
        // Tracing is observational; report generation should not fail if Langfuse is temporarily unavailable.
      }
    }
  };
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
  const timeout = setTimeout(() => controller.abort(), 3500);
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

function getTraceContentMode(): LangfuseTraceContentMode {
  return process.env.LANGFUSE_TRACE_CONTENT === "full" ? "full" : "redacted";
}

function sanitizeTraceValue(value: unknown, mode: LangfuseTraceContentMode): unknown {
  if (mode === "full") return limitTraceValue(value);
  if (typeof value === "string") return redactSensitiveTraceText(value).slice(0, 12000);
  if (Array.isArray(value)) return value.map((item) => sanitizeTraceValue(item, mode));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      if (["apiKey", "secretKey", "birthDate", "birthTime", "birthPlace", "city", "birth_correct"].includes(key)) {
        return [key, "[redacted]"];
      }
      if (key === "name" || key === "nickname") return [key, "匿名命主"];
      return [key, sanitizeTraceValue(entry, mode)];
    })
  );
}

function limitTraceValue(value: unknown): unknown {
  if (typeof value === "string") return value.slice(0, 16000);
  if (Array.isArray(value)) return value.map(limitTraceValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, limitTraceValue(entry)])
  );
}

function redactSensitiveTraceText(value: string) {
  return value
    .replace(/("name"\s*:\s*)"[^"]*"/g, '$1"匿名命主"')
    .replace(/("nickname"\s*:\s*)"[^"]*"/g, '$1"匿名命主"')
    .replace(/("birth_correct"\s*:\s*)"[^"]*"/g, '$1"[redacted]"')
    .replace(/("city"\s*:\s*)"[^"]*"/g, '$1"[redacted]"')
    .replace(/("birthDate"\s*:\s*)"[^"]*"/g, '$1"[redacted]"')
    .replace(/("birthTime"\s*:\s*)"[^"]*"/g, '$1"[redacted]"')
    .replace(/("birthPlace"\s*:\s*)"[^"]*"/g, '$1"[redacted]"')
    .replace(/\d{4}-\d{2}-\d{2}/g, "[date]")
    .replace(/\d{4}年\d{1,2}月\d{1,2}日/g, "[date]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/1[3-9]\d{9}/g, "[phone]");
}

function normalizeLegacyUsage(usage?: ChatCompletionUsage) {
  if (!usage) return undefined;
  return {
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    totalTokens: usage.totalTokens
  };
}

function normalizeUsageDetails(usage?: ChatCompletionUsage) {
  if (!usage) return undefined;
  return {
    input: usage.promptTokens,
    output: usage.completionTokens,
    total: usage.totalTokens
  };
}

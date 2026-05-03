import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createLangfuseReportTrace,
  ensureLangfusePromptCatalogSeeded,
  getLangfuseChatMessages
} from "@/lib/llm/langfuse";

const originalEnv = { ...process.env };

afterEach(() => {
  for (const key of Object.keys(process.env)) {
    delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Langfuse prompt registry", () => {
  it("falls back to local messages when Langfuse is not configured", async () => {
    delete process.env.LANGFUSE_BASE_URL;
    delete process.env.LANGFUSE_HOST;
    delete process.env.LANGFUSE_PUBLIC_KEY;
    delete process.env.LANGFUSE_SECRET_KEY;

    const fallback = [{ role: "user" as const, content: "local" }];
    await expect(
      getLangfuseChatMessages({
        name: "fate-spectrum/overview",
        variables: { context: "{}" },
        fallback
      })
    ).resolves.toBe(fallback);
  });

  it("prefers the configured prod prompt when Langfuse returns one", async () => {
    process.env.LANGFUSE_BASE_URL = "https://langfuse.local";
    process.env.LANGFUSE_PUBLIC_KEY = "pk-test";
    process.env.LANGFUSE_SECRET_KEY = "sk-test";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          prompt: [
            { role: "system", content: "system {{context}}" },
            { role: "user", content: "user {{context}}" }
          ]
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const messages = await getLangfuseChatMessages({
      name: "fate-spectrum/overview",
      variables: { context: "{\"ok\":true}" },
      fallback: [{ role: "user", content: "local" }]
    });

    expect(messages).toEqual([
      { role: "system", content: "system {\"ok\":true}" },
      { role: "user", content: "user {\"ok\":true}" }
    ]);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("label=prod");
  });

  it("seeds missing local prompts without overwriting existing Langfuse prompts", async () => {
    process.env.LANGFUSE_BASE_URL = "https://langfuse.local";
    process.env.LANGFUSE_PUBLIC_KEY = "pk-test";
    process.env.LANGFUSE_SECRET_KEY = "sk-test";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("missing", { status: 404 }))
      .mockResolvedValueOnce(new Response("created", { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await ensureLangfusePromptCatalogSeeded([
      {
        name: "fate-spectrum/test-seed",
        version: 1,
        type: "chat",
        source: "prompts/fate-spectrum/test-seed",
        messages: [{ role: "user", content: "{{context}}" }]
      }
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({ method: "POST" });
    expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body))).toMatchObject({
      name: "fate-spectrum/test-seed",
      labels: ["prod"],
      config: {
        seedMode: "missing-only"
      }
    });
  });

  it("records redacted trace generations without leaking direct birth identifiers", async () => {
    process.env.LANGFUSE_BASE_URL = "https://langfuse.local";
    process.env.LANGFUSE_PUBLIC_KEY = "pk-test";
    process.env.LANGFUSE_SECRET_KEY = "sk-test";
    process.env.LANGFUSE_TRACE_CONTENT = "redacted";
    const fetchMock = vi.fn().mockResolvedValue(new Response("accepted", { status: 207 }));
    vi.stubGlobal("fetch", fetchMock);

    const trace = createLangfuseReportTrace({
      name: "fate-spectrum/report-generation",
      input: {
        name: "真实姓名",
        birthDate: "1992-09-29",
        bazi: "壬申 己酉 戊申 未知"
      },
      tags: ["report"]
    });

    expect(trace).not.toBeNull();
    trace?.recordGeneration({
      name: "prompt:fate-spectrum/portrait",
      promptName: "fate-spectrum/portrait",
      promptVersion: 2,
      promptSource: "langfuse",
      provider: "deepseek",
      model: "deepseek-chat",
      startTime: "2026-05-03T00:00:00.000Z",
      endTime: "2026-05-03T00:00:01.000Z",
      input: {
        messages: [
          {
            role: "user",
            content: "{\"name\":\"真实姓名\",\"birthDate\":\"1992-09-29\",\"bazi\":\"壬申 己酉 戊申 未知\"}"
          }
        ]
      },
      output: { content: "{\"portrait\":{\"summary\":\"ok\"}}" },
      usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 }
    });
    await trace?.flush({ output: { ok: true } });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe("https://langfuse.local/api/public/ingestion");
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    const serialized = JSON.stringify(body);
    expect(body.batch.map((event: { type: string }) => event.type)).toEqual(["trace-create", "generation-create"]);
    expect(serialized).toContain("壬申 己酉 戊申 未知");
    expect(serialized).not.toContain("1992-09-29");
    expect(serialized).not.toContain("真实姓名");
    expect(body.batch[1].body).toMatchObject({
      promptName: "fate-spectrum/portrait",
      promptVersion: 2,
      usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
      usageDetails: { input: 10, output: 5, total: 15 }
    });
  });
});

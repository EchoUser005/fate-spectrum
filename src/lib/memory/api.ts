import { NextResponse } from "next/server";

type MemoryProxyInit = {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
};

export async function proxyMemoryJson(path: string, init: MemoryProxyInit = {}) {
  const baseUrl = process.env.FATE_MEMORY_API_URL?.trim();
  if (!baseUrl) {
    return NextResponse.json(
      { error: "本地记忆服务未配置。请设置 FATE_MEMORY_API_URL，或使用 Docker Compose 启动完整服务。" },
      { status: 503 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(new URL(path, baseUrl), {
      method: init.method ?? "GET",
      headers:
        init.body === undefined
          ? undefined
          : {
              "Content-Type": "application/json"
            },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: controller.signal
    });
    const text = await response.text();
    const payload = text ? parseJson(text) : null;
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ error: "本地记忆服务暂不可用。" }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}

function parseJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { error: text };
  }
}

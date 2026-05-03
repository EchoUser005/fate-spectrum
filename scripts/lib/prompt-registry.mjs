import fs from "node:fs/promises";
import path from "node:path";

export const promptsRoot = path.join(process.cwd(), "prompts", "fate-spectrum");

export async function readPromptCatalog() {
  const entries = await fs.readdir(promptsRoot, { withFileTypes: true });
  const prompts = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const promptDir = path.join(promptsRoot, entry.name);
    const meta = JSON.parse(await fs.readFile(path.join(promptDir, "prompt.json"), "utf8"));
    if (!meta.name || meta.type !== "chat") {
      console.log(`skip ${entry.name}: not a chat prompt definition`);
      continue;
    }
    prompts.push({
      name: meta.name,
      version: meta.version,
      type: meta.type,
      source: path.relative(process.cwd(), promptDir),
      meta,
      messages: [
        { role: "system", content: (await fs.readFile(path.join(promptDir, "system.md"), "utf8")).trim() },
        { role: "user", content: (await fs.readFile(path.join(promptDir, "user.md"), "utf8")).trim() }
      ],
      dir: promptDir
    });
  }
  return prompts.sort((a, b) => a.name.localeCompare(b.name));
}

export function promptUrl(config, name) {
  const url = new URL(`/api/public/v2/prompts/${encodeURIComponent(name)}`, config.baseUrl);
  url.searchParams.set("label", config.label);
  return url;
}

export async function fetchPrompt(config, name) {
  return fetch(promptUrl(config, name), {
    headers: {
      Authorization: config.authorization
    }
  });
}

export async function createPrompt(config, prompt) {
  return fetch(new URL("/api/public/v2/prompts", config.baseUrl), {
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
        input: prompt.meta.input,
        output: prompt.meta.output
      }
    })
  });
}

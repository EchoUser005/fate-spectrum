import fs from "node:fs/promises";
import path from "node:path";

const promptsRoot = path.join(process.cwd(), "prompts", "fate-spectrum");
const baseUrl = process.env.LANGFUSE_BASE_URL || process.env.LANGFUSE_HOST;
const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
const secretKey = process.env.LANGFUSE_SECRET_KEY;
const label = process.env.LANGFUSE_PROMPT_LABEL || "prod";

if (!baseUrl || !publicKey || !secretKey) {
  console.error("Missing LANGFUSE_BASE_URL, LANGFUSE_PUBLIC_KEY, or LANGFUSE_SECRET_KEY.");
  process.exit(1);
}

for (const localPrompt of await readLocalPromptMetas()) {
  const url = new URL(`/api/public/v2/prompts/${encodeURIComponent(localPrompt.name)}`, baseUrl);
  url.searchParams.set("label", label);
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString("base64")}`
    }
  });

  if (!response.ok) {
    console.log(`skip ${localPrompt.name}: ${response.status}`);
    continue;
  }

  const payload = await response.json();
  const messages = Array.isArray(payload.prompt) ? payload.prompt : [];
  const system = messages.find((message) => message?.role === "system")?.content;
  const user = messages.find((message) => message?.role === "user")?.content;
  if (typeof system !== "string" || typeof user !== "string") {
    console.log(`skip ${localPrompt.name}: prompt is not a system/user chat prompt`);
    continue;
  }

  await fs.writeFile(path.join(localPrompt.dir, "system.md"), system.trim() + "\n", "utf8");
  await fs.writeFile(path.join(localPrompt.dir, "user.md"), user.trim() + "\n", "utf8");
  console.log(`pulled ${localPrompt.name} <- ${label}`);
}

async function readLocalPromptMetas() {
  const entries = await fs.readdir(promptsRoot, { withFileTypes: true });
  const prompts = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(promptsRoot, entry.name);
    const meta = JSON.parse(await fs.readFile(path.join(dir, "prompt.json"), "utf8"));
    if (typeof meta.name === "string") prompts.push({ name: meta.name, dir });
  }
  return prompts.sort((a, b) => a.name.localeCompare(b.name));
}

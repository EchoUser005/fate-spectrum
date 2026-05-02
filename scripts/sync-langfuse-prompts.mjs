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

for (const prompt of await readPromptCatalog()) {
  const response = await fetch(new URL("/api/public/v2/prompts", baseUrl), {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: prompt.name,
      type: prompt.type,
      prompt: prompt.messages,
      labels: [label],
      config: {
        localVersion: prompt.version,
        source: prompt.source
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`failed to sync ${prompt.name}: ${response.status} ${body}`);
  }

  console.log(`synced ${prompt.name} -> ${label}`);
}

async function readPromptCatalog() {
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
      messages: [
        { role: "system", content: (await fs.readFile(path.join(promptDir, "system.md"), "utf8")).trim() },
        { role: "user", content: (await fs.readFile(path.join(promptDir, "user.md"), "utf8")).trim() }
      ]
    });
  }
  return prompts.sort((a, b) => a.name.localeCompare(b.name));
}

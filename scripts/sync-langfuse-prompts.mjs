import fs from "node:fs/promises";
import path from "node:path";

const promptsDir = path.join(process.cwd(), "prompts");
const baseUrl = process.env.LANGFUSE_BASE_URL || process.env.LANGFUSE_HOST;
const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
const secretKey = process.env.LANGFUSE_SECRET_KEY;
const label = process.env.LANGFUSE_PROMPT_LABEL || "production";

if (!baseUrl || !publicKey || !secretKey) {
  console.error("Missing LANGFUSE_BASE_URL, LANGFUSE_PUBLIC_KEY, or LANGFUSE_SECRET_KEY.");
  process.exit(1);
}

const entries = await fs.readdir(promptsDir, { withFileTypes: true });
const promptFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => path.join(promptsDir, entry.name));

for (const filePath of promptFiles) {
  const raw = await fs.readFile(filePath, "utf8");
  const prompt = JSON.parse(raw);
  if (!prompt.name || prompt.type !== "chat" || !Array.isArray(prompt.messages)) {
    console.log(`skip ${path.basename(filePath)}: not a chat prompt definition`);
    continue;
  }

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
        source: path.relative(process.cwd(), filePath)
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`failed to sync ${prompt.name}: ${response.status} ${body}`);
  }

  console.log(`synced ${prompt.name} -> ${label}`);
}

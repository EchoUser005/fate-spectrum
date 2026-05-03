import fs from "node:fs/promises";
import path from "node:path";
import { getLangfuseEnv, loadLocalEnv } from "./lib/env.mjs";
import { fetchPrompt, readPromptCatalog } from "./lib/prompt-registry.mjs";

loadLocalEnv();
const config = getLangfuseEnv();

if (!config) {
  console.error("Missing LANGFUSE_BASE_URL, LANGFUSE_PUBLIC_KEY, or LANGFUSE_SECRET_KEY.");
  process.exit(1);
}

for (const localPrompt of await readPromptCatalog()) {
  const response = await fetchPrompt(config, localPrompt.name);

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
  console.log(`pulled ${localPrompt.name} <- ${config.label}`);
}

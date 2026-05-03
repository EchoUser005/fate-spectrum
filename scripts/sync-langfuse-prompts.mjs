import { getLangfuseEnv, loadLocalEnv } from "./lib/env.mjs";
import { createPrompt, readPromptCatalog } from "./lib/prompt-registry.mjs";

loadLocalEnv();
const config = getLangfuseEnv();

if (!config) {
  console.error("Missing LANGFUSE_BASE_URL, LANGFUSE_PUBLIC_KEY, or LANGFUSE_SECRET_KEY.");
  process.exit(1);
}

for (const prompt of await readPromptCatalog()) {
  const response = await createPrompt(config, prompt);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`failed to sync ${prompt.name}: ${response.status} ${body}`);
  }
  console.log(`synced ${prompt.name} -> ${config.label}`);
}

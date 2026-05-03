import { getLangfuseEnv, loadLocalEnv } from "./lib/env.mjs";
import { createPrompt, fetchPrompt, readPromptCatalog } from "./lib/prompt-registry.mjs";

loadLocalEnv();
const config = getLangfuseEnv();

if (!config) {
  console.log("Langfuse env not configured; skipped prompt seed.");
  process.exit(0);
}

for (const prompt of await readPromptCatalog()) {
  const existing = await fetchPrompt(config, prompt.name);
  if (existing.ok) {
    console.log(`exists ${prompt.name} <- ${config.label}`);
    continue;
  }
  if (existing.status !== 404) {
    console.log(`skip ${prompt.name}: ${existing.status}`);
    continue;
  }

  const created = await createPrompt(config, prompt);
  if (!created.ok) {
    const body = await created.text();
    throw new Error(`failed to seed ${prompt.name}: ${created.status} ${body}`);
  }
  console.log(`seeded ${prompt.name} -> ${config.label}`);
}

import { getLangfuseEnv, loadLocalEnv } from "./lib/env.mjs";
import { fetchPrompt, readPromptCatalog } from "./lib/prompt-registry.mjs";

loadLocalEnv();
const config = getLangfuseEnv();
const localPrompts = await readPromptCatalog();

console.log(`local prompts: ${localPrompts.length}`);
for (const prompt of localPrompts) {
  console.log(`local ${prompt.name} v${prompt.version}`);
}

if (!config) {
  console.log("Langfuse env not configured; local fallback is active.");
  process.exit(0);
}

let missing = 0;
let unreachable = 0;
for (const prompt of localPrompts) {
  let response;
  try {
    response = await fetchPrompt(config, prompt.name);
  } catch (error) {
    unreachable += 1;
    console.log(`remote unavailable ${prompt.name} label=${config.label} error=${formatError(error)}`);
    continue;
  }
  if (response.ok) {
    const payload = await response.json();
    console.log(
      `remote ok ${prompt.name} label=${config.label} version=${payload.version ?? "unknown"} localVersion=${payload.config?.localVersion ?? "unknown"}`
    );
    continue;
  }
  missing += 1;
  console.log(`remote missing ${prompt.name} label=${config.label} status=${response.status}`);
}

if (missing > 0) {
  console.log(`missing remote prompts: ${missing}. Run pnpm prompts:seed to create only missing prompts.`);
}
if (unreachable > 0) {
  console.log(`remote unavailable prompts: ${unreachable}. Local fallback remains available.`);
}

function formatError(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

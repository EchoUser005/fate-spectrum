import fs from "node:fs";
import path from "node:path";

export function loadLocalEnv(cwd = process.cwd()) {
  for (const fileName of [".env", ".env.local"]) {
    const filePath = path.join(cwd, fileName);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = unquoteEnvValue(rawValue.trim());
    }
  }
}

function unquoteEnvValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function getLangfuseEnv() {
  const baseUrl = process.env.LANGFUSE_BASE_URL || process.env.LANGFUSE_HOST;
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  const label = process.env.LANGFUSE_PROMPT_LABEL || "prod";
  if (!baseUrl || !publicKey || !secretKey) return null;
  return {
    baseUrl,
    label,
    authorization: `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString("base64")}`
  };
}

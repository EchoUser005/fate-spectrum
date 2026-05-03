"use client";

import { providerPresets } from "@/lib/config/providers";
import type { ProviderConfig } from "@/lib/schemas/provider";

const LLM_SESSION_STORAGE_KEY = "fate-spectrum.llm-session.v1";

export function defaultLlmConfig(): ProviderConfig {
  return {
    provider: "deepseek",
    baseUrl: providerPresets.deepseek.baseUrl,
    model: providerPresets.deepseek.model
  };
}

export function loadLlmSessionConfig(): ProviderConfig {
  try {
    const cached = window.sessionStorage.getItem(LLM_SESSION_STORAGE_KEY);
    if (!cached) return defaultLlmConfig();
    const parsed = JSON.parse(cached) as { config?: ProviderConfig };
    return parsed.config ?? defaultLlmConfig();
  } catch {
    window.sessionStorage.removeItem(LLM_SESSION_STORAGE_KEY);
    return defaultLlmConfig();
  }
}

export function saveLlmSessionConfig(config: ProviderConfig) {
  try {
    window.sessionStorage.setItem(LLM_SESSION_STORAGE_KEY, JSON.stringify({ config }));
  } catch {
    // Session cache is a browser-only convenience.
  }
}

export function clearLlmSessionConfig() {
  window.sessionStorage.removeItem(LLM_SESSION_STORAGE_KEY);
}

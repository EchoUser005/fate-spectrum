import { DEFAULT_SHENJIGE_ENDPOINT } from "@/lib/constants";

export const providerPresets = {
  mock: {
    label: "Mock Demo",
    description: "样例星盘，无需 key，用于演示和测试。"
  },
  customPaipan: {
    label: "Custom Paipan",
    description: "调用用户自己的排盘接口。默认预置 shenjige 映射。",
    endpoint: process.env.SHENJIGE_PAIPAN_ENDPOINT ?? DEFAULT_SHENJIGE_ENDPOINT
  },
  deepseek: {
    label: "DeepSeek",
    description: "只用于生成解释文案，不负责排盘或评分。",
    baseUrl: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
    model: process.env.DEFAULT_DEEPSEEK_MODEL ?? "deepseek-v4-flash"
  },
  openaiCompatible: {
    label: "OpenAI-compatible",
    description: "兼容 /chat/completions 的自定义 LLM 渠道。",
    baseUrl: process.env.OPENAI_COMPATIBLE_BASE_URL ?? "https://api.openai.com/v1",
    model: process.env.DEFAULT_OPENAI_COMPATIBLE_MODEL ?? "gpt-4o-mini"
  }
} as const;

export const deepseekModelOptions = [
  { value: "deepseek-v4-flash", label: "deepseek-v4-flash · V4 Flash" },
  { value: "deepseek-v4-pro", label: "deepseek-v4-pro · V4 Pro" },
  { value: "deepseek-chat", label: "deepseek-chat · legacy alias" }
] as const;

export function allowSessionKeyStorage() {
  return process.env.ALLOW_SESSION_KEY_STORAGE === "true";
}

export function allowInsecureProviderEndpoint() {
  return process.env.ALLOW_INSECURE_PROVIDER_ENDPOINT === "true";
}

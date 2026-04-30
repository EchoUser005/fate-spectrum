import { z } from "zod";

export const ProviderConfigSchema = z.object({
  provider: z.enum(["mock", "deepseek", "openai-compatible", "custom-paipan"]),
  apiKey: z.string().trim().optional(),
  baseUrl: z.string().trim().url().optional().or(z.literal("")),
  model: z.string().trim().optional().or(z.literal("")),
  paipanEndpoint: z.string().trim().url().optional().or(z.literal(""))
});

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;

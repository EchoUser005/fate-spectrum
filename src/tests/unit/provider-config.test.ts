import { describe, expect, it } from "vitest";
import { deepseekModelOptions, providerPresets } from "@/lib/config/providers";

describe("provider presets", () => {
  it("defaults DeepSeek to a V4 model id", () => {
    expect(providerPresets.deepseek.model).toBe("deepseek-v4-flash");
    expect(deepseekModelOptions.map((option) => option.value)).toContain("deepseek-v4-pro");
    expect(deepseekModelOptions.map((option) => option.value)).toContain("deepseek-v4-flash");
  });
});

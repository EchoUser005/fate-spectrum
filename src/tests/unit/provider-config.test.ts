import { describe, expect, it } from "vitest";
import { deepseekModelOptions, providerPresets } from "@/lib/config/providers";

describe("provider presets", () => {
  it("defaults DeepSeek to the high quality V4 model id", () => {
    expect(providerPresets.deepseek.model).toBe("deepseek-v4-pro");
    expect(deepseekModelOptions).toEqual([
      { value: "deepseek-v4-flash", label: "快速", userLabel: "快速" },
      { value: "deepseek-v4-pro", label: "高质量", userLabel: "高质量" },
      { value: "deepseek-chat", label: "兼容", userLabel: "兼容" }
    ]);
  });
});

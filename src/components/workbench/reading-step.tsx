"use client";

import { Trash2 } from "lucide-react";
import { deepseekModelOptions, providerPresets } from "@/lib/config/providers";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  llmConfig: ProviderConfig;
  onLlmChange: (config: ProviderConfig) => void;
  onClearCachedLlm: () => void;
};

export function ReadingStep({
  llmConfig,
  onLlmChange,
  onClearCachedLlm
}: Props) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-[0.7fr_1fr]">
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          模型名称
          <Select
            value={llmConfig.model ?? providerPresets.deepseek.model}
            onChange={(event) => {
              const value = event.target.value;
              onLlmChange({ ...llmConfig, provider: "deepseek", model: value });
            }}
          >
            {deepseekModelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          模型密钥
          <Input
            type="password"
            placeholder="填写后生成解读"
            value={llmConfig.apiKey ?? ""}
            onChange={(event) => onLlmChange({ ...llmConfig, apiKey: event.target.value })}
          />
        </label>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm text-fs-muted">
        <p>密钥只保存在当前浏览器会话，生成时用于文字解读。</p>
        <Button type="button" size="sm" variant="secondary" onClick={onClearCachedLlm}>
          <Trash2 size={14} />
          清除本次密钥
        </Button>
      </div>
    </div>
  );
}

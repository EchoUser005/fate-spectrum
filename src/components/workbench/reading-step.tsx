"use client";

import { ExternalLink, Trash2 } from "lucide-react";
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

const compatibleModelOptions = [
  providerPresets.openaiCompatible.model,
  "gpt-4o-mini",
  "gpt-4.1-mini"
].filter((value, index, options) => options.indexOf(value) === index);

export function ReadingStep({
  llmConfig,
  onLlmChange,
  onClearCachedLlm
}: Props) {
  const defaultModelOptions =
    llmConfig.provider === "openai-compatible"
      ? compatibleModelOptions
      : deepseekModelOptions.map((option) => option.value);
  const modelOptions =
    llmConfig.model && !defaultModelOptions.includes(llmConfig.model)
      ? [llmConfig.model, ...defaultModelOptions]
      : defaultModelOptions;

  return (
    <div className="grid gap-3">
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          模型渠道
          <Select
            value={llmConfig.provider === "openai-compatible" ? "openai-compatible" : "deepseek"}
            onChange={(event) => {
              const provider = event.target.value as "deepseek" | "openai-compatible";
              if (provider === "deepseek") {
                onLlmChange({
                  ...llmConfig,
                  provider,
                  baseUrl: providerPresets.deepseek.baseUrl,
                  model: providerPresets.deepseek.model
                });
                return;
              }
              onLlmChange({
                ...llmConfig,
                provider,
                baseUrl: providerPresets.openaiCompatible.baseUrl,
                model: providerPresets.openaiCompatible.model
              });
            }}
          >
            <option value="deepseek">DeepSeek</option>
            <option value="openai-compatible">兼容渠道</option>
          </Select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          模型名称
          <Select
            value={llmConfig.model || modelOptions[0]}
            onChange={(event) => {
              const value = event.target.value;
              onLlmChange({ ...llmConfig, model: value });
            }}
          >
            {modelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          模型密钥
          <Input
            type="password"
            placeholder="填写后生成完整解读"
            value={llmConfig.apiKey ?? ""}
            onChange={(event) => onLlmChange({ ...llmConfig, apiKey: event.target.value })}
          />
        </label>
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-fs-muted">
        <div className="space-y-1">
          <p>密钥仅保存在当前浏览器会话。</p>
          {llmConfig.provider === "deepseek" ? (
            <a
              href="https://platform.deepseek.com/api_keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-fs-blue transition hover:text-fs-ink"
            >
              DeepSeek API 开放平台
              <ExternalLink size={12} />
            </a>
          ) : null}
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={onClearCachedLlm}>
          <Trash2 size={14} />
          清除密钥
        </Button>
      </div>
    </div>
  );
}

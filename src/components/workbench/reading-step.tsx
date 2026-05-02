"use client";

import { Trash2 } from "lucide-react";
import { deepseekModelOptions, providerPresets } from "@/lib/config/providers";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { readingModeOptions, type ReadingMode } from "@/lib/ui-copy/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  llmConfig: ProviderConfig;
  readingMode: ReadingMode;
  onLlmChange: (config: ProviderConfig) => void;
  onReadingModeChange: (mode: ReadingMode) => void;
  onClearCachedLlm: () => void;
};

export function ReadingStep({
  llmConfig,
  readingMode,
  onLlmChange,
  onReadingModeChange,
  onClearCachedLlm
}: Props) {
  return (
    <div className="grid gap-4">
      <div>
        <p className="mb-2 text-sm font-medium text-fs-ink">模型模式</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {readingModeOptions.map((option) => (
            <ChoiceButton
              key={option.id}
              selected={readingMode === option.id}
              title={option.label}
              text={option.description}
              onClick={() => {
                onReadingModeChange(option.id);
                onLlmChange({
                  ...llmConfig,
                  provider: "deepseek",
                  baseUrl: providerPresets.deepseek.baseUrl,
                  model: modelForMode(option.id)
                });
              }}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[0.7fr_1fr]">
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          模型名称
          <Select
            value={llmConfig.model ?? providerPresets.deepseek.model}
            onChange={(event) => {
              const value = event.target.value;
              onReadingModeChange(modeForModel(value));
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
            placeholder="当前浏览器会话保存"
            value={llmConfig.apiKey ?? ""}
            onChange={(event) => onLlmChange({ ...llmConfig, apiKey: event.target.value })}
          />
        </label>
      </div>
      <div className="flex justify-end">
        <Button type="button" size="sm" variant="secondary" onClick={onClearCachedLlm}>
          <Trash2 size={14} />
          清除本会话 Key
        </Button>
      </div>
    </div>
  );
}

function ChoiceButton({
  selected,
  title,
  text,
  onClick
}: {
  selected: boolean;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border p-4 text-left transition ${
        selected ? "border-fs-gold bg-fs-surface text-fs-ink" : "border-fs-line bg-white text-fs-muted hover:bg-fs-surface"
      }`}
    >
      <span className="font-semibold">{title}</span>
      <span className="mt-1 block text-sm leading-6">{text}</span>
    </button>
  );
}

function modelForMode(mode: ReadingMode) {
  if (mode === "fast") return "deepseek-v4-flash";
  if (mode === "compat") return "deepseek-chat";
  return "deepseek-v4-pro";
}

function modeForModel(model: string): ReadingMode {
  if (model === "deepseek-v4-flash") return "fast";
  if (model === "deepseek-chat") return "compat";
  return "quality";
}

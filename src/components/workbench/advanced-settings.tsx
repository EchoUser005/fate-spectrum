"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import { deepseekModelOptions, providerPresets } from "@/lib/config/providers";
import type { ProviderConfig } from "@/lib/schemas/provider";
import type { ReadingMode } from "@/lib/ui-copy/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  paipanConfig: ProviderConfig;
  llmConfig: ProviderConfig;
  readingMode: ReadingMode;
  onPaipanChange: (config: ProviderConfig) => void;
  onLlmChange: (config: ProviderConfig) => void;
  onReadingModeChange: (mode: ReadingMode) => void;
  onClearCachedLlm: () => void;
};

export function AdvancedSettings({
  paipanConfig,
  llmConfig,
  readingMode,
  onPaipanChange,
  onLlmChange,
  onReadingModeChange,
  onClearCachedLlm
}: Props) {
  return (
    <details className="rounded-md border border-dashed border-fs-line bg-white p-4">
      <summary className="cursor-pointer font-medium text-fs-ink">高级设置</summary>
      <div className="mt-4 grid gap-4">
        <div className="rounded-md bg-fs-bg p-3 text-sm leading-6 text-fs-muted">
          <p>shenjige endpoint、form encoded mapping 和 provider 限制只在这里展示。</p>
          <p>当前真实排盘限制：目前仅支持公历生日；目前需要选择男/女；海外时区和真太阳时校准将在后续版本支持。</p>
        </div>
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          排盘接口地址
          <Input
            value={paipanConfig.paipanEndpoint ?? providerPresets.customPaipan.endpoint}
            onChange={(event) => onPaipanChange({ ...paipanConfig, paipanEndpoint: event.target.value })}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-fs-ink">
            Base URL
            <Input
              disabled={readingMode === "off"}
              value={llmConfig.baseUrl ?? ""}
              onChange={(event) => onLlmChange({ ...llmConfig, baseUrl: event.target.value })}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-fs-ink">
            Chat endpoint
            <Input disabled value="/chat/completions" />
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          Model
          <Select
            disabled={readingMode === "off"}
            value={llmConfig.model ?? providerPresets.deepseek.model}
            onChange={(event) => {
              const value = event.target.value;
              const mode =
                value === "deepseek-v4-flash" ? "fast" : value === "deepseek-chat" ? "compat" : "quality";
              onReadingModeChange(mode);
              onLlmChange({ ...llmConfig, model: value });
            }}
          >
            {deepseekModelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} · {option.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          Key
          <Input
            type="password"
            disabled={readingMode === "off"}
            placeholder="仅保存在当前浏览器会话"
            value={llmConfig.apiKey ?? ""}
            onChange={(event) => onLlmChange({ ...llmConfig, apiKey: event.target.value })}
          />
        </label>
        <div className="flex flex-col gap-3 rounded-md bg-fs-bg p-3 text-sm text-fs-muted sm:flex-row sm:items-center sm:justify-between">
          <span>填写后只缓存在当前浏览器会话，不写入后端或导出文件。</span>
          <Button type="button" size="sm" variant="secondary" onClick={onClearCachedLlm}>
            <Trash2 size={14} />
            清除本会话 Key
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href="https://platform.deepseek.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-fs-cyan hover:text-fs-blue"
          >
            申请 DeepSeek Key
            <ExternalLink size={13} />
          </a>
          <a
            href="https://api-docs.deepseek.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-fs-cyan hover:text-fs-blue"
          >
            查看模型文档
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </details>
  );
}

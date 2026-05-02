"use client";

import { ExternalLink, KeyRound, PlugZap, Trash2 } from "lucide-react";
import { deepseekModelOptions, providerPresets } from "@/lib/config/providers";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  paipanConfig: ProviderConfig;
  llmConfig: ProviderConfig;
  useLlmNarrative: boolean;
  onPaipanChange: (config: ProviderConfig) => void;
  onLlmChange: (config: ProviderConfig) => void;
  onUseLlmChange: (enabled: boolean) => void;
  onClearCachedLlm: () => void;
};

export function ProviderKeyForm({
  paipanConfig,
  llmConfig,
  useLlmNarrative,
  onPaipanChange,
  onLlmChange,
  onUseLlmChange,
  onClearCachedLlm
}: Props) {
  const isDeepSeek = llmConfig.provider === "deepseek";

  return (
    <section className="rounded-md bg-white/92 p-5 shadow-spectrum ring-1 ring-slate-200">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-cyan-50 text-cyan-700">
          <PlugZap size={18} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Provider</p>
          <h2 className="text-xl font-semibold text-ink">渠道与 Key</h2>
        </div>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          排盘 Provider
          <Select
            value={paipanConfig.provider}
            onChange={(event) =>
              onPaipanChange({
                ...paipanConfig,
                provider: event.target.value as ProviderConfig["provider"],
                paipanEndpoint:
                  event.target.value === "custom-paipan"
                    ? providerPresets.customPaipan.endpoint
                    : paipanConfig.paipanEndpoint
              })
            }
          >
            <option value="mock">Mock Demo · 样例星盘</option>
            <option value="custom-paipan">Custom Paipan · 真实接口</option>
          </Select>
        </label>

        {paipanConfig.provider === "custom-paipan" ? (
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Paipan endpoint
              <Input
                value={paipanConfig.paipanEndpoint ?? ""}
                onChange={(event) => onPaipanChange({ ...paipanConfig, paipanEndpoint: event.target.value })}
              />
            </label>
            <div className="rounded-md bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
              <p>shenjige 当前仅支持公历和 male/female。</p>
              <p>暂不处理海外时区换算；真太阳时仅保留开关和提示。</p>
            </div>
          </div>
        ) : (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Mock Demo 一键生成，无需 Key；没有真实排盘接口时会使用匿名样例星盘。
          </p>
        )}

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={useLlmNarrative}
            onChange={(event) => onUseLlmChange(event.target.checked)}
          />
          启用 LLM 解释润色
        </label>
        <p className="rounded-md bg-cyan-50 px-3 py-2 text-sm leading-6 text-cyan-900">
          DeepSeek / OpenAI-compatible 只负责解释已有排盘和规则分数，不负责排盘，也不会改写分数。
        </p>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          LLM Provider
          <Select
            value={llmConfig.provider}
            disabled={!useLlmNarrative}
            onChange={(event) =>
              onLlmChange({
                ...llmConfig,
                provider: event.target.value as ProviderConfig["provider"],
                baseUrl:
                  event.target.value === "deepseek"
                    ? providerPresets.deepseek.baseUrl
                    : providerPresets.openaiCompatible.baseUrl,
                model:
                  event.target.value === "deepseek"
                    ? providerPresets.deepseek.model
                    : providerPresets.openaiCompatible.model
              })
            }
          >
            <option value="deepseek">DeepSeek</option>
            <option value="openai-compatible">OpenAI-compatible Custom</option>
          </Select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Base URL
          <Input
            disabled={!useLlmNarrative}
            value={llmConfig.baseUrl ?? ""}
            onChange={(event) => onLlmChange({ ...llmConfig, baseUrl: event.target.value })}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Model
          {isDeepSeek ? (
            <Select
              disabled={!useLlmNarrative}
              value={llmConfig.model ?? providerPresets.deepseek.model}
              onChange={(event) => onLlmChange({ ...llmConfig, model: event.target.value })}
            >
              {deepseekModelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              disabled={!useLlmNarrative}
              value={llmConfig.model ?? ""}
              onChange={(event) => onLlmChange({ ...llmConfig, model: event.target.value })}
            />
          )}
        </label>

        {isDeepSeek ? (
          <div className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
            <p>DeepSeek V4 当前推荐 `deepseek-v4-flash` 或 `deepseek-v4-pro`；`deepseek-chat` 是旧兼容别名。</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href="https://platform.deepseek.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-cyan-700 hover:text-cyan-900"
              >
                申请 API Key
                <ExternalLink size={13} />
              </a>
              <a
                href="https://api-docs.deepseek.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-cyan-700 hover:text-cyan-900"
              >
                查看模型文档
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ) : null}

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2">
            <KeyRound size={15} />
            API Key
          </span>
          <Input
            type="password"
            disabled={!useLlmNarrative}
            placeholder="仅保存在当前浏览器会话"
            value={llmConfig.apiKey ?? ""}
            onChange={(event) => onLlmChange({ ...llmConfig, apiKey: event.target.value })}
          />
        </label>
        <div className="flex flex-col gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <p>填写后会缓存在当前浏览器会话，刷新页面不用重复输入；不会写入后端、导出文件或源码。</p>
          <Button type="button" size="sm" variant="secondary" onClick={onClearCachedLlm}>
            <Trash2 size={14} />
            清除本会话 Key
          </Button>
        </div>
      </div>
    </section>
  );
}

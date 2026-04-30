"use client";

import { KeyRound, PlugZap } from "lucide-react";
import { providerPresets } from "@/lib/config/providers";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  paipanConfig: ProviderConfig;
  llmConfig: ProviderConfig;
  useLlmNarrative: boolean;
  onPaipanChange: (config: ProviderConfig) => void;
  onLlmChange: (config: ProviderConfig) => void;
  onUseLlmChange: (enabled: boolean) => void;
};

export function ProviderKeyForm({
  paipanConfig,
  llmConfig,
  useLlmNarrative,
  onPaipanChange,
  onLlmChange,
  onUseLlmChange
}: Props) {
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
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Paipan endpoint
            <Input
              value={paipanConfig.paipanEndpoint ?? ""}
              onChange={(event) => onPaipanChange({ ...paipanConfig, paipanEndpoint: event.target.value })}
            />
          </label>
        ) : (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Mock Demo 无需 key，会使用匿名样例排盘。
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
          <Input
            disabled={!useLlmNarrative}
            value={llmConfig.model ?? ""}
            onChange={(event) => onLlmChange({ ...llmConfig, model: event.target.value })}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2">
            <KeyRound size={15} />
            API Key
          </span>
          <Input
            type="password"
            disabled={!useLlmNarrative}
            placeholder="仅本次请求使用，不落库"
            value={llmConfig.apiKey ?? ""}
            onChange={(event) => onLlmChange({ ...llmConfig, apiKey: event.target.value })}
          />
        </label>
      </div>
    </section>
  );
}

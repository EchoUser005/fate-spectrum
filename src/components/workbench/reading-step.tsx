"use client";

import type { ProviderConfig } from "@/lib/schemas/provider";
import { providerPresets } from "@/lib/config/providers";
import { readingModeOptions, type ReadingMode } from "@/lib/ui-copy/labels";
import { AdvancedSettings } from "@/components/workbench/advanced-settings";

type Props = {
  paipanConfig: ProviderConfig;
  llmConfig: ProviderConfig;
  readingMode: ReadingMode;
  onPaipanChange: (config: ProviderConfig) => void;
  onLlmChange: (config: ProviderConfig) => void;
  onReadingModeChange: (mode: ReadingMode) => void;
  onClearCachedLlm: () => void;
};

export function ReadingStep(props: Props) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2">
        <ChoiceButton
          selected={props.paipanConfig.provider === "mock"}
          title="使用样例体验"
          text="无需填写密钥，直接生成完整样例报告。"
          onClick={() => props.onPaipanChange({ provider: "mock", paipanEndpoint: providerPresets.customPaipan.endpoint })}
        />
        <ChoiceButton
          selected={props.paipanConfig.provider === "custom-paipan"}
          title="使用真实排盘"
          text="适合接入自己的真实排盘来源。"
          onClick={() =>
            props.onPaipanChange({
              ...props.paipanConfig,
              provider: "custom-paipan",
              paipanEndpoint: props.paipanConfig.paipanEndpoint ?? providerPresets.customPaipan.endpoint
            })
          }
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-fs-ink">模型润色</p>
        <div className="grid gap-3 md:grid-cols-4">
          {readingModeOptions.map((option) => (
            <ChoiceButton
              key={option.id}
              selected={props.readingMode === option.id}
              title={option.label}
              text={option.description}
              onClick={() => {
                props.onReadingModeChange(option.id);
                props.onLlmChange({
                  ...props.llmConfig,
                  provider: "deepseek",
                  baseUrl: providerPresets.deepseek.baseUrl,
                  model: modelForMode(option.id)
                });
              }}
            />
          ))}
        </div>
      </div>
      <AdvancedSettings {...props} />
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

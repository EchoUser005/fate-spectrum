"use client";

import { Loader2, Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { BirthInput } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";
import type { ReadingMode } from "@/lib/ui-copy/labels";
import { Button } from "@/components/ui/button";
import { BirthStep } from "@/components/workbench/birth-step";
import { GenerationProgress } from "@/components/workbench/generation-progress";
import { ReadingStep } from "@/components/workbench/reading-step";

type Props = {
  form: UseFormReturn<BirthInput>;
  paipanConfig: ProviderConfig;
  llmConfig: ProviderConfig;
  readingMode: ReadingMode;
  status: string[];
  error: string | null;
  isGenerating: boolean;
  onPaipanChange: (config: ProviderConfig) => void;
  onLlmChange: (config: ProviderConfig) => void;
  onReadingModeChange: (mode: ReadingMode) => void;
  onClearCachedLlm: () => void;
  onSubmit: () => void;
};

const steps = ["生辰信息", "解读方式", "生成报告"] as const;

export function GenerationWizard({
  form,
  paipanConfig,
  llmConfig,
  readingMode,
  status,
  error,
  isGenerating,
  onPaipanChange,
  onLlmChange,
  onReadingModeChange,
  onClearCachedLlm,
  onSubmit
}: Props) {
  return (
    <section id="wizard" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-md border border-fs-line bg-fs-surface-2 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-fs-gold">开始生成</p>
            <h2 className="mt-2 text-2xl font-semibold text-fs-ink">三步生成一份人生光谱</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {steps.map((step, index) => (
              <span key={step} className="shrink-0 rounded-full border border-fs-line bg-fs-bg px-3 py-1 text-sm text-fs-muted">
                {index + 1}. {step}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-md bg-fs-bg p-4">
            <h3 className="font-semibold text-fs-ink">第 1 步：生辰信息</h3>
            <div className="mt-4">
              <BirthStep form={form} />
            </div>
          </section>
          <section className="rounded-md bg-fs-bg p-4">
            <h3 className="font-semibold text-fs-ink">第 2 步：解读方式</h3>
            <div className="mt-4">
              <ReadingStep
                paipanConfig={paipanConfig}
                llmConfig={llmConfig}
                readingMode={readingMode}
                onPaipanChange={onPaipanChange}
                onLlmChange={onLlmChange}
                onReadingModeChange={onReadingModeChange}
                onClearCachedLlm={onClearCachedLlm}
              />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-md bg-fs-bg p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-semibold text-fs-ink">第 3 步：生成报告</h3>
              <p className="mt-1 text-sm leading-6 text-fs-muted">生成过程只展示对你有意义的阶段。</p>
            </div>
            <Button type="button" onClick={onSubmit} disabled={isGenerating} className="w-full sm:w-auto">
              {isGenerating ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
              生成报告
            </Button>
          </div>
          <div className="mt-4">
            <GenerationProgress completed={status} />
          </div>
          {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-fs-rose">{error}</p> : null}
        </section>
      </div>
    </section>
  );
}

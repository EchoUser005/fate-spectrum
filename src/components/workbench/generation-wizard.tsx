"use client";

import { Loader2, Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { BirthInput } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { Button } from "@/components/ui/button";
import { BirthStep } from "@/components/workbench/birth-step";
import { GenerationProgress } from "@/components/workbench/generation-progress";
import { ReadingStep } from "@/components/workbench/reading-step";

type Props = {
  form: UseFormReturn<BirthInput>;
  llmConfig: ProviderConfig;
  status: string[];
  error: string | null;
  isGenerating: boolean;
  onLlmChange: (config: ProviderConfig) => void;
  onClearCachedLlm: () => void;
  onSubmit: () => void;
};

export function GenerationWizard({
  form,
  llmConfig,
  status,
  error,
  isGenerating,
  onLlmChange,
  onClearCachedLlm,
  onSubmit
}: Props) {
  return (
    <section id="wizard" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-md border border-fs-line bg-fs-surface-2 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-sm font-medium text-fs-gold">命运光谱</h1>
            <h2 className="mt-2 text-3xl font-semibold text-fs-ink md:text-5xl">一生大运流年维度评分报告</h2>
          </div>
          <Button type="button" onClick={onSubmit} disabled={isGenerating} className="w-full sm:w-auto">
            {isGenerating ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
            生成报告
          </Button>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-md bg-fs-bg p-4">
            <h2 className="text-xl font-semibold text-fs-ink">生辰配置</h2>
            <div className="mt-4">
              <BirthStep form={form} />
            </div>
          </section>
          <section className="rounded-md bg-fs-bg p-4">
            <h2 className="text-xl font-semibold text-fs-ink">模型配置</h2>
            <div className="mt-4">
              <ReadingStep
                llmConfig={llmConfig}
                onLlmChange={onLlmChange}
                onClearCachedLlm={onClearCachedLlm}
              />
            </div>
          </section>
        </div>

        <div className="mt-5">
          <GenerationProgress completed={status} />
        </div>
        {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-fs-rose">{error}</p> : null}
      </div>
    </section>
  );
}

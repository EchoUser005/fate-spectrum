"use client";

import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
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
  onCancelAddProfile?: () => void;
};

export function GenerationWizard({
  form,
  llmConfig,
  status,
  error,
  isGenerating,
  onLlmChange,
  onClearCachedLlm,
  onSubmit,
  onCancelAddProfile
}: Props) {
  return (
    <section id="wizard" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl border border-fs-line bg-fs-surface-2 shadow-[0_24px_80px_rgba(20,33,31,0.08)]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_368px]">
          <div className="p-5 md:p-8">
            <header className="spectrum-banner relative min-h-[260px] overflow-hidden rounded-xl border border-fs-line px-6 py-10 md:px-8 md:py-12">
              <div className="spectrum-wave top-12" />
              <div className="spectrum-wave top-28" />
              <div className="spectrum-wave top-44" />
              <div className="relative z-10">
                <p className="text-sm font-semibold tracking-[0.26em] text-fs-gold">FATE SPECTRUM</p>
                <h1 className="mt-5 text-6xl font-semibold leading-none text-fs-ink md:text-8xl">
                  命运光谱
                </h1>
              </div>
            </header>

            {onCancelAddProfile ? (
              <div className="mt-4 flex justify-end">
                <Button type="button" variant="secondary" onClick={onCancelAddProfile}>
                  返回命盘
                </Button>
              </div>
            ) : null}

            <section className="mt-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-fs-gold">出生信息</p>
                  <h2 className="mt-1 text-2xl font-semibold text-fs-ink">填写生辰</h2>
                </div>
              </div>
              <div className="mt-4">
                <BirthStep form={form} />
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-5 border-t border-fs-line bg-fs-surface p-5 lg:border-l lg:border-t-0 lg:p-6">
            <section>
              <h2 className="text-lg font-semibold text-fs-ink">模型渠道</h2>
              <div className="mt-4">
                <ReadingStep
                  llmConfig={llmConfig}
                  onLlmChange={onLlmChange}
                  onClearCachedLlm={onClearCachedLlm}
                />
              </div>
            </section>

            {error ? (
              <div className="flex items-start gap-2 rounded-md bg-rose-50 p-3 text-sm text-fs-rose">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                <p>{error}</p>
              </div>
            ) : null}

            {status.length > 0 ? <GenerationProgress completed={status} /> : null}

            <Button
              type="button"
              onClick={onSubmit}
              disabled={isGenerating}
              className="h-14 w-full bg-fs-ink text-base font-semibold text-white shadow-sm hover:bg-fs-slate"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  正在生成命运光谱
                </>
              ) : (
                <>
                  生成命运光谱
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}

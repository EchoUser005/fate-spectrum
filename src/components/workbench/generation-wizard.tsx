"use client";

import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { BirthInput } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { Button } from "@/components/ui/button";
import { BirthStep } from "@/components/workbench/birth-step";
import { GenerationProgress } from "@/components/workbench/generation-progress";
import { ReadingStep } from "@/components/workbench/reading-step";
import { generationPhaseLabels } from "@/lib/ui-copy/labels";

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
  const isAddingProfile = Boolean(onCancelAddProfile);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const visibleStatus = status.length > 0 ? status : step === 3 ? [generationPhaseLabels[0]] : [];
  const birthFields: Array<keyof BirthInput> = [
    "gender",
    "calendar",
    "birthDate",
    "birthTime",
    "timeBranch",
    "timezone",
    "useTrueSolarTime"
  ];

  const goNextFromBirth = async () => {
    const ok = await form.trigger(birthFields);
    if (ok) setStep(2);
  };

  const startExploration = async () => {
    const ok = await form.trigger(birthFields);
    if (!ok) {
      setStep(1);
      return;
    }
    if (!llmConfig.apiKey?.trim()) {
      onSubmit();
      return;
    }
    setStep(3);
    window.setTimeout(onSubmit, 0);
  };

  if (isAddingProfile) {
    return (
      <section id="wizard" className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-fs-line bg-fs-surface-2 p-5 shadow-sm md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-fs-gold">出生信息</p>
              <h1 className="mt-1 text-2xl font-semibold text-fs-ink">添加缘主</h1>
            </div>
            <Button type="button" variant="secondary" onClick={onCancelAddProfile}>
              返回命盘
            </Button>
          </div>
          <div className="mt-6">
            <BirthStep form={form} />
          </div>
          {error ? <ErrorNote message={error} /> : null}
          {status.length > 0 ? <div className="mt-4"><GenerationProgress completed={status} /></div> : null}
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isGenerating}
            className="mt-6 h-12 w-full bg-fs-ink text-base font-semibold text-white shadow-sm hover:bg-fs-slate"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                添加命运光谱中
              </>
            ) : (
              <>
                添加命运光谱
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="wizard" className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-[960px] items-center px-4 py-8 sm:px-6">
      <div className="w-full rounded-lg border border-fs-line bg-fs-surface-2 p-5 shadow-[0_24px_70px_rgba(20,33,31,0.08)] md:p-7">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-fs-line pb-5">
          <a href="#wizard" className="inline-flex items-center gap-3 rounded-md border border-fs-line bg-white px-4 py-2">
            <span className="text-xs font-semibold tracking-[0.28em] text-fs-gold">FATE SPECTRUM</span>
            <span className="text-base font-semibold text-fs-ink">命运光谱</span>
          </a>
          <div className="flex items-center gap-1 rounded-full bg-fs-surface px-2 py-1">
            {([1, 2, 3] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (!isGenerating) setStep(item);
                }}
                className={`h-2.5 w-8 rounded-full transition ${
                  step === item ? "bg-fs-ink" : item < step ? "bg-fs-gold" : "bg-fs-line"
                }`}
                aria-label={`第 ${item} 步`}
              />
            ))}
          </div>
        </header>

        <div className="pt-7">
          {step === 1 ? (
            <section className="fade-in">
              <p className="text-sm font-medium text-fs-gold">第一步</p>
              <h1 className="mt-1 text-3xl font-semibold text-fs-ink">填写生辰</h1>
              <div className="mt-6">
                <BirthStep form={form} />
              </div>
              <div className="mt-7 flex justify-end">
                <Button type="button" onClick={() => void goNextFromBirth()}>
                  下一步
                  <ArrowRight size={18} />
                </Button>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="fade-in">
              <p className="text-sm font-medium text-fs-gold">第二步</p>
              <h1 className="mt-1 text-3xl font-semibold text-fs-ink">配置模型</h1>
              <div className="mt-6">
                <ReadingStep
                  llmConfig={llmConfig}
                  onLlmChange={onLlmChange}
                  onClearCachedLlm={onClearCachedLlm}
                />
              </div>
              <div className="mt-7 flex flex-wrap justify-between gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={18} />
                  上一步
                </Button>
                <Button type="button" onClick={() => void startExploration()} disabled={isGenerating}>
                  开始探索命运光谱
                  <ArrowRight size={18} />
                </Button>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="fade-in">
              <p className="text-sm font-medium text-fs-gold">第三步</p>
              <h1 className="mt-1 text-3xl font-semibold text-fs-ink">开始探索命运光谱</h1>
              <div className="mt-6">
                <GenerationProgress completed={visibleStatus} />
              </div>
              {error ? <ErrorNote message={error} /> : null}
              <div className="mt-7 flex flex-wrap justify-between gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(2)} disabled={isGenerating}>
                  <ArrowLeft size={18} />
                  上一步
                </Button>
                <div className="inline-flex h-12 min-w-52 items-center justify-center gap-2 rounded-md bg-fs-surface px-4 text-base font-semibold text-fs-muted">
                  {isGenerating ? <Loader2 size={18} className="animate-spin text-fs-gold" /> : null}
                  探索命运光谱中
                </div>
              </div>
            </section>
          ) : null}

          {step !== 3 && error ? <ErrorNote message={error} /> : null}
        </div>
      </div>
    </section>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-md bg-rose-50 p-3 text-sm text-fs-rose">
      <AlertCircle className="mt-0.5 shrink-0" size={16} />
      <p>{message}</p>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Loader2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { providerPresets } from "@/lib/config/providers";
import type { BirthInput } from "@/lib/schemas/birth";
import { BirthInputSchema } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { ReportResponseSchema, type ReportResponse } from "@/lib/schemas/report";
import { Button } from "@/components/ui/button";
import { BirthForm } from "@/components/birth-form";
import { ProviderKeyForm } from "@/components/provider-key-form";
import { ReportDashboard } from "@/components/report-dashboard";

const generationSteps = ["校验输入", "获取排盘", "归一化排盘", "计算光谱分数", "生成解释", "渲染结果"];

export function AppShell() {
  const [paipanConfig, setPaipanConfig] = useState<ProviderConfig>({
    provider: "mock",
    paipanEndpoint: providerPresets.customPaipan.endpoint
  });
  const [llmConfig, setLlmConfig] = useState<ProviderConfig>({
    provider: "deepseek",
    baseUrl: providerPresets.deepseek.baseUrl,
    model: providerPresets.deepseek.model
  });
  const [useLlmNarrative, setUseLlmNarrative] = useState(false);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [status, setStatus] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<BirthInput>({
    resolver: zodResolver(BirthInputSchema),
    defaultValues: {
      nickname: "匿名样例",
      gender: "female",
      calendar: "solar",
      birthDate: "1999-09-15",
      birthTime: "23:00",
      timeBranch: "子",
      timezone: "Asia/Shanghai",
      birthPlace: "Shanghai",
      useTrueSolarTime: false
    }
  });

  const providerNote = useMemo(() => {
    if (paipanConfig.provider === "mock") {
      return "Mock Demo 一键生成，无需排盘 Key；没有真实排盘接口时使用匿名样例星盘。DeepSeek / OpenAI-compatible 只负责解释已有排盘和规则分数。";
    }
    return "shenjige provider 当前只支持公历和 male/female；暂不处理海外时区换算，真太阳时仅保留开关和提示。";
  }, [paipanConfig.provider]);

  const onSubmit = form.handleSubmit(async (birth) => {
    setIsGenerating(true);
    setError(null);
    setReport(null);
    setStatus([]);

    try {
      for (const step of generationSteps.slice(0, 3)) {
        setStatus((items) => [...items, step]);
      }

      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          birth,
          paipanProvider: paipanConfig,
          llmProvider: llmConfig,
          options: {
            useLlmNarrative,
            includeRawJson: true
          }
        })
      });

      const json = (await response.json()) as unknown;
      if (!response.ok) {
        const message =
          json && typeof json === "object" && "error" in json ? String(json.error) : "报告生成失败。";
        throw new Error(message);
      }

      setStatus(generationSteps);
      setReport(ReportResponseSchema.parse(json));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "报告生成失败。");
    } finally {
      setIsGenerating(false);
    }
  });

  return (
    <main className="min-h-screen bg-mist">
      <section className="spectrum-plane spectral-grid relative overflow-hidden">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8"
        >
          <header className="flex items-center justify-between gap-4 text-white">
            <div className="font-semibold">Fate Spectrum · 命运光谱</div>
            <a
              href="https://github.com/EchoUser005/fate-spectrum"
              className="inline-flex items-center gap-2 rounded-md bg-white/18 px-3 py-2 text-sm backdrop-blur transition hover:bg-white/28"
            >
              <Github size={16} />
              GitHub
            </a>
          </header>

          <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="max-w-xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/78">
                Turn birth charts into explainable multidimensional life spectra.
              </p>
              <h1 className="mt-4 text-5xl font-semibold leading-tight sm:text-6xl">
                Fate Spectrum · 命运光谱
              </h1>
              <p className="mt-5 text-lg leading-8 text-white/88">
                把八字、紫微、大运与流年拆解成可解释的多维人生光谱。
              </p>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/78">
                首屏默认就是 Mock Demo，公开评审可以直接生成样例星盘，不需要填写任何 Key。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
                  生成我的命盘光谱
                </Button>
                <a
                  href="#report"
                  className="inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-ink transition hover:bg-slate-100"
                >
                  查看报告区
                </a>
              </div>
              <p className="mt-5 max-w-lg text-sm leading-6 text-white/78">{providerNote}</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <BirthForm form={form} />
              <ProviderKeyForm
                paipanConfig={paipanConfig}
                llmConfig={llmConfig}
                useLlmNarrative={useLlmNarrative}
                onPaipanChange={setPaipanConfig}
                onLlmChange={setLlmConfig}
                onUseLlmChange={setUseLlmNarrative}
              />
            </div>
          </div>
        </form>
      </section>

      <section id="report" className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-white p-5 ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Generation Status</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">生成状态</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {generationSteps.map((step) => (
                <span
                  key={step}
                  className={`rounded-md px-3 py-2 text-center text-sm ${
                    status.includes(step) ? "bg-cyan-50 text-cyan-800" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
          {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        </div>

        {report ? (
          <ReportDashboard report={report} />
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            等待生成第一份人生光谱报告。
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
        Open source under MIT. Fate Spectrum outputs are for reflection, entertainment, and planning reference.
      </footer>
    </main>
  );
}

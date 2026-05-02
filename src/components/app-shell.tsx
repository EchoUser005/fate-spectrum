"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { providerPresets } from "@/lib/config/providers";
import type { BirthInput } from "@/lib/schemas/birth";
import { BirthInputSchema } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { ReportResponseSchema, type ReportResponse } from "@/lib/schemas/report";
import { generationPhaseLabels, type ReadingMode } from "@/lib/ui-copy/labels";
import { LandingHero } from "@/components/marketing/landing-hero";
import { ReportShell } from "@/components/report/report-shell";
import { GenerationWizard } from "@/components/workbench/generation-wizard";

const LLM_SESSION_STORAGE_KEY = "fate-spectrum.llm-session.v1";

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
  const [readingMode, setReadingMode] = useState<ReadingMode>("off");
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
      birthPlace: "上海",
      useTrueSolarTime: false
    }
  });

  useEffect(() => {
    try {
      const cached = window.sessionStorage.getItem(LLM_SESSION_STORAGE_KEY);
      if (!cached) return;
      const parsed = JSON.parse(cached) as {
        readingMode?: ReadingMode;
        config?: ProviderConfig;
      };
      const timer = window.setTimeout(() => {
        if (parsed.config) setLlmConfig(parsed.config);
        if (parsed.readingMode) setReadingMode(parsed.readingMode);
      }, 0);
      return () => window.clearTimeout(timer);
    } catch {
      window.sessionStorage.removeItem(LLM_SESSION_STORAGE_KEY);
    }
    return undefined;
  }, []);

  useEffect(() => {
    try {
      if (readingMode === "off" && !llmConfig.apiKey) return;
      window.sessionStorage.setItem(
        LLM_SESSION_STORAGE_KEY,
        JSON.stringify({
          readingMode,
          config: llmConfig
        })
      );
    } catch {
      // Session cache is a browser-only convenience.
    }
  }, [llmConfig, readingMode]);

  const clearCachedLlm = () => {
    window.sessionStorage.removeItem(LLM_SESSION_STORAGE_KEY);
    setLlmConfig({
      provider: "deepseek",
      baseUrl: providerPresets.deepseek.baseUrl,
      model: providerPresets.deepseek.model
    });
    setReadingMode("off");
  };

  const generateReport = form.handleSubmit(async (birth) => {
    setIsGenerating(true);
    setError(null);
    setReport(null);
    setStatus([generationPhaseLabels[0]]);

    try {
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
            useLlmNarrative: readingMode !== "off",
            includeRawJson: true
          }
        })
      });

      setStatus([generationPhaseLabels[0], generationPhaseLabels[1], generationPhaseLabels[2]]);
      const json = (await response.json()) as unknown;
      if (!response.ok) {
        const message =
          json && typeof json === "object" && "error" in json ? String(json.error) : "报告生成失败。";
        throw new Error(message);
      }

      setStatus([...generationPhaseLabels]);
      const parsed = ReportResponseSchema.parse(json);
      setReport(parsed);
      window.setTimeout(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }), 80);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "报告生成失败。");
    } finally {
      setIsGenerating(false);
    }
  });

  const scrollToWizard = () => {
    document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-fs-bg text-fs-ink">
      <LandingHero onStart={scrollToWizard} onSampleReport={generateReport} isGenerating={isGenerating} />
      <GenerationWizard
        form={form}
        paipanConfig={paipanConfig}
        llmConfig={llmConfig}
        readingMode={readingMode}
        status={status}
        error={error}
        isGenerating={isGenerating}
        onPaipanChange={setPaipanConfig}
        onLlmChange={setLlmConfig}
        onReadingModeChange={setReadingMode}
        onClearCachedLlm={clearCachedLlm}
        onSubmit={generateReport}
      />
      <section id="report" className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {report ? (
          <ReportShell report={report} />
        ) : (
          <div className="rounded-md border border-dashed border-fs-line bg-white p-8 text-center text-fs-muted">
            生成后会在这里看到总览、大运、流年、星盘和详细解读。
          </div>
        )}
      </section>
      <footer className="border-t border-fs-line bg-fs-surface px-4 py-6 text-center text-sm text-fs-muted">
        开源项目，仅供自我反思、娱乐和规划参考。
      </footer>
    </main>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { providerPresets } from "@/lib/config/providers";
import { consumeAddProfileMode, hasPrimaryReport, savePrimaryReport } from "@/lib/client/profile-storage";
import type { BirthInput } from "@/lib/schemas/birth";
import { BirthInputSchema } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { ReportResponseSchema } from "@/lib/schemas/report";
import { generationPhaseLabels } from "@/lib/ui-copy/labels";
import { GenerationWizard } from "@/components/workbench/generation-wizard";

const LLM_SESSION_STORAGE_KEY = "fate-spectrum.llm-session.v1";

export function AppShell() {
  const router = useRouter();
  const [llmConfig, setLlmConfig] = useState<ProviderConfig>({
    provider: "deepseek",
    baseUrl: providerPresets.deepseek.baseUrl,
    model: providerPresets.deepseek.model
  });
  const [status, setStatus] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingProfile] = useState(() =>
    typeof window === "undefined" ? false : consumeAddProfileMode()
  );

  const form = useForm<BirthInput>({
    resolver: zodResolver(BirthInputSchema),
    defaultValues: {
      nickname: "",
      gender: "female",
      calendar: "solar",
      birthDate: "",
      birthTime: "",
      timeBranch: "子",
      timezone: "Asia/Shanghai",
      birthPlace: "",
      useTrueSolarTime: false
    }
  });

  useEffect(() => {
    if (!isAddingProfile && hasPrimaryReport()) router.replace("/chart");
  }, [isAddingProfile, router]);

  useEffect(() => {
    try {
      const cached = window.sessionStorage.getItem(LLM_SESSION_STORAGE_KEY);
      if (!cached) return;
      const parsed = JSON.parse(cached) as {
        config?: ProviderConfig;
      };
      const timer = window.setTimeout(() => {
        if (parsed.config) setLlmConfig(parsed.config);
      }, 0);
      return () => window.clearTimeout(timer);
    } catch {
      window.sessionStorage.removeItem(LLM_SESSION_STORAGE_KEY);
    }
    return undefined;
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        LLM_SESSION_STORAGE_KEY,
        JSON.stringify({
          config: llmConfig
        })
      );
    } catch {
      // Session cache is a browser-only convenience.
    }
  }, [llmConfig]);

  const clearCachedLlm = () => {
    window.sessionStorage.removeItem(LLM_SESSION_STORAGE_KEY);
    setLlmConfig({
      provider: "deepseek",
      baseUrl: providerPresets.deepseek.baseUrl,
      model: providerPresets.deepseek.model
    });
  };

  const generateReport = form.handleSubmit(
    async (birth) => {
      if (!llmConfig.apiKey?.trim()) {
        setError("请先填写模型密钥。");
        setStatus([]);
        return;
      }

      setIsGenerating(true);
      setError(null);
      setStatus([generationPhaseLabels[0]]);
      let phaseIndex = 0;
      const phaseTimer = window.setInterval(() => {
        phaseIndex = Math.min(phaseIndex + 1, generationPhaseLabels.length - 1);
        setStatus(generationPhaseLabels.slice(0, phaseIndex + 1));
      }, 900);

      try {
        const response = await fetch("/api/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            birth,
            paipanProvider: {
              provider: "custom-paipan",
              paipanEndpoint: providerPresets.customPaipan.endpoint
            },
            llmProvider: llmConfig,
            options: {
              useLlmNarrative: true,
              includeRawJson: false
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
        savePrimaryReport(parsed);
        window.setTimeout(() => router.push("/chart"), 250);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "报告生成失败。");
      } finally {
        window.clearInterval(phaseTimer);
        setIsGenerating(false);
      }
    },
    (invalidFields) => {
      setStatus([]);
      if (invalidFields.birthDate) {
        setError("请先填写公历生日。");
        return;
      }
      if (invalidFields.birthTime) {
        setError("请先填写出生时间。");
        return;
      }
      setError("请先补全生辰信息。");
    }
  );

  return (
    <main className="min-h-screen bg-fs-bg text-fs-ink">
      <GenerationWizard
        form={form}
        llmConfig={llmConfig}
        status={status}
        error={error}
        isGenerating={isGenerating}
        onLlmChange={setLlmConfig}
        onClearCachedLlm={clearCachedLlm}
        onSubmit={generateReport}
      />
      <footer className="border-t border-fs-line bg-fs-surface px-4 py-6 text-center text-sm text-fs-muted">
        仅供自我反思、娱乐和规划参考。
      </footer>
    </main>
  );
}

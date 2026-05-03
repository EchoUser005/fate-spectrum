"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { providerPresets } from "@/lib/config/providers";
import type { ProfileRelationship } from "@/lib/client/profile-storage";
import type { BirthInput } from "@/lib/schemas/birth";
import { BirthInputSchema } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { ReportResponseSchema, type ReportResponse } from "@/lib/schemas/report";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { BirthStep } from "@/components/workbench/birth-step";
import { GenerationProgress } from "@/components/workbench/generation-progress";
import { ReadingStep } from "@/components/workbench/reading-step";
import { generationPhaseLabels } from "@/lib/ui-copy/labels";

type AddProfileModalProps = {
  open: boolean;
  llmConfig: ProviderConfig;
  onClose: () => void;
  onGenerated: (report: ReportResponse, relationship?: ProfileRelationship) => void;
  onOpenModelConfig: () => void;
};

export function AddProfileModal({
  open,
  llmConfig,
  onClose,
  onGenerated,
  onOpenModelConfig
}: AddProfileModalProps) {
  const [relationship, setRelationship] = useState<ProfileRelationship | "">("");
  const [status, setStatus] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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

  if (!open) return null;

  const generateGuest = form.handleSubmit(
    async (birth) => {
      if (!llmConfig.apiKey?.trim()) {
        setError("请先在个人中心完成模型配置。");
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
              includeRawJson: false,
              profileRole: "guest"
            }
          })
        });

        const json = (await response.json()) as unknown;
        if (!response.ok) {
          const message =
            json && typeof json === "object" && "error" in json ? String(json.error) : "报告生成失败。";
          throw new Error(message);
        }

        setStatus([...generationPhaseLabels]);
        onGenerated(ReportResponseSchema.parse(json), relationship || undefined);
        form.reset();
        setRelationship("");
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "报告生成失败。");
      } finally {
        window.clearInterval(phaseTimer);
        setIsGenerating(false);
      }
    },
    () => {
      setError("请先补全生辰信息。");
    }
  );

  return (
    <ModalShell title="新增命盘" onClose={onClose}>
      <div className="grid gap-5">
        <BirthStep form={form} />
        <label className="grid gap-1 text-sm font-medium text-fs-ink">
          缘主关系
          <Select
            value={relationship}
            onChange={(event) => setRelationship(event.target.value as ProfileRelationship | "")}
          >
            <option value="">不设置</option>
            <option value="friend">朋友</option>
            <option value="family">家人</option>
          </Select>
        </label>
        {!llmConfig.apiKey?.trim() ? (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-fs-ink">
            <AlertCircle className="mt-0.5 shrink-0 text-fs-gold" size={16} />
            <div className="space-y-2">
              <p>还没有可用的模型密钥。</p>
              <Button type="button" size="sm" variant="secondary" onClick={onOpenModelConfig}>
                模型配置
              </Button>
            </div>
          </div>
        ) : null}
        {error ? <ErrorNote message={error} /> : null}
        {status.length > 0 ? <GenerationProgress completed={status} /> : null}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isGenerating}>
            取消
          </Button>
          <Button type="button" onClick={() => void generateGuest()} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                添加命运光谱中...
              </>
            ) : (
              "添加命运光谱"
            )}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

export function ModelConfigModal({
  open,
  llmConfig,
  onLlmChange,
  onClearCachedLlm,
  onClose
}: {
  open: boolean;
  llmConfig: ProviderConfig;
  onLlmChange: (config: ProviderConfig) => void;
  onClearCachedLlm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <ModalShell title="模型配置" onClose={onClose}>
      <ReadingStep llmConfig={llmConfig} onLlmChange={onLlmChange} onClearCachedLlm={onClearCachedLlm} />
      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={onClose}>
          保存
        </Button>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  children,
  onClose
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fs-ink/35 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-fs-line bg-fs-surface-2 p-5 shadow-2xl md:p-6">
        <header className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-fs-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-fs-line bg-white text-fs-muted transition hover:text-fs-ink"
            aria-label="关闭弹窗"
          >
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-rose-50 p-3 text-sm text-fs-rose">
      <AlertCircle className="mt-0.5 shrink-0" size={16} />
      <p>{message}</p>
    </div>
  );
}

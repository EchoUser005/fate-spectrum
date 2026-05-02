import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ReportApiRequestSchema } from "@/lib/schemas/report";
import { getPaipanProvider } from "@/lib/paipan/providers";
import { buildRuleBasedReport } from "@/lib/scoring/engine";
import { generateLlmNarrative } from "@/lib/llm";
import { readJsonWithLimit, safeErrorResponse } from "@/app/api/_lib";

export async function POST(request: NextRequest) {
  try {
    const payload = ReportApiRequestSchema.parse(await readJsonWithLimit(request));
    if (payload.options.useLlmNarrative && !payload.llmProvider.apiKey?.trim()) {
      throw new Error("请先填写模型密钥。");
    }

    const provider = getPaipanProvider(payload.paipanProvider);
    const paipan = await provider.generate(payload.birth, payload.paipanProvider);
    const generatedAt = new Date().toISOString();
    const baseReport = buildRuleBasedReport({
      birth: payload.birth,
      paipan,
      provider: payload.paipanProvider,
      generatedAt
    });

    if (!payload.options.useLlmNarrative) {
      return NextResponse.json(baseReport);
    }

    const narrative = await generateLlmNarrative(baseReport, payload.llmProvider);
    if (!narrative) {
      throw new Error("模型解读失败，请检查模型密钥或稍后重试。");
    }

    return NextResponse.json(
      buildRuleBasedReport({
        birth: payload.birth,
        paipan,
        provider: payload.paipanProvider,
        generatedAt,
        narrativeOverride: narrative
      })
    );
  } catch (error) {
    return safeErrorResponse(error);
  }
}

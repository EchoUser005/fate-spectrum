import type { NormalizedPaipan } from "@/lib/schemas/paipan";
import type { ChatMessage } from "@/lib/llm/openai-compatible";
import type { DayunScore, DimensionDefinition, YearlyScore } from "@/lib/schemas/report";
import {
  GENERAL_DISCLAIMER,
  HEALTH_DISCLAIMER,
  WEALTH_DISCLAIMER
} from "@/lib/constants";
import narrativePromptDefinition from "../../../prompts/fate-spectrum-narrative.v1.json";

type LocalPromptDefinition = {
  name: string;
  version: number;
  type: "chat";
  messages: ChatMessage[];
};

const localNarrativePrompt = narrativePromptDefinition as LocalPromptDefinition;

export const LOCAL_NARRATIVE_PROMPT_NAME = localNarrativePrompt.name;
export const LOCAL_NARRATIVE_PROMPT_VERSION = localNarrativePrompt.version;

export function buildNarrativePrompt(input: {
  normalized: NormalizedPaipan;
  dimensions: DimensionDefinition[];
  dayunScores: DayunScore[];
  yearlyScores: YearlyScore[];
}) {
  const context = JSON.stringify(
    {
      task: "生成人生光谱报告 narrative。",
      outputShape: {
        overview: "string",
        dimensions: {
          wealth: "string",
          career: "string",
          comfort: "string",
          selfValue: "string",
          relationship: "string",
          healthEnergy: "string",
          riskControl: "string"
        },
        keyWindows: [
          {
            title: "string",
            startYear: "number",
            endYear: "number",
            reason: "string",
            actions: ["string"]
          }
        ],
        actionPlan: ["string"]
      },
      requiredDisclaimers: [GENERAL_DISCLAIMER, HEALTH_DISCLAIMER, WEALTH_DISCLAIMER],
      normalized: input.normalized,
      dimensions: input.dimensions,
      dayunScores: input.dayunScores,
      yearlyScores: input.yearlyScores.slice(0, 12)
    },
    null,
    2
  );
  const messages = localNarrativePrompt.messages.map((message) => ({
    role: message.role,
    content: compileTemplate(message.content, { context })
  }));
  const system = messages.find((message) => message.role === "system")?.content;
  const user = messages.find((message) => message.role === "user")?.content;

  return {
    system: system ?? "",
    user: user ?? context
  };
}

function compileTemplate(template: string, variables: Record<string, string>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => variables[key] ?? "");
}

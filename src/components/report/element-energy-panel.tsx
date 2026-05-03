"use client";

import { useMemo, useState } from "react";
import type { ElementEnergyNode, ElementInteraction, ReportResponse } from "@/lib/schemas/report";
import { getReportAnalysis } from "@/lib/analysis/report-analysis";
import { wuxingTheme } from "@/lib/wuxing";

const elementOrder = ["fire", "wood", "metal", "water", "earth"] as const;

export function ElementEnergyPanel({ report }: { report: ReportResponse }) {
  const analysis = getReportAnalysis(report);
  const profile = report.narratives.elementProfile ?? analysis.elementProfile;
  const nodes = profile.nodes;
  const interactions = profile.interactions ?? [];
  const [selectedId, setSelectedId] = useState(nodes[0]?.id ?? "");
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) ?? nodes[0],
    [nodes, selectedId]
  );

  if (nodes.length === 0) return null;

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
      <div className="rounded-md border border-fs-line bg-white p-5 md:p-6">
        <div className="rounded-md border border-fs-line bg-fs-surface p-4">
          <p className="text-sm font-semibold text-fs-ink">总体能量偏好</p>
          <p className="mt-2 text-sm leading-6 text-fs-muted">{profile.overall}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
            {profile.favorableElements.map((element) => (
              <span
                key={`fav-${element}`}
                className="rounded-full px-2.5 py-1"
                style={{ backgroundColor: wuxingTheme[element].background, color: wuxingTheme[element].color }}
              >
                喜 {wuxingTheme[element].label}
              </span>
            ))}
            {profile.unfavorableElements.map((element) => (
              <span key={`unfav-${element}`} className="rounded-full bg-rose-50 px-2.5 py-1 text-fs-rose">
                忌 {wuxingTheme[element].label}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-md border border-fs-line bg-fs-surface-2 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-fs-ink">能量谱</p>
            <span className="text-xs text-fs-muted">点按节点查看具体解释</span>
          </div>
          <div className="relative mt-4 h-64 border-l border-b border-fs-line">
            {[100, 80, 60, 40].map((score) => (
              <div
                key={score}
                className="absolute left-0 right-0 border-t border-dashed border-fs-line/70"
                style={{ bottom: `${score - 20}%` }}
              >
                <span className="-ml-9 -translate-y-1/2 text-xs text-fs-muted">{score}</span>
              </div>
            ))}
            {nodes.map((node, index) => (
              <button
                key={node.id}
                type="button"
                aria-label={`${node.label} ${node.score}`}
                onClick={() => setSelectedId(node.id)}
                className="absolute flex -translate-x-1/2 translate-y-1/2 flex-col items-center gap-1 text-xs font-semibold transition hover:scale-105"
                style={{
                  left: `${getNodeX(node, index)}%`,
                  bottom: `${Math.max(4, Math.min(96, node.score))}%`,
                  color: wuxingTheme[node.element].color
                }}
              >
                <span>{node.symbol}</span>
                <span
                  className={`h-4 w-4 rounded-full border-2 ${node.stance === "unfavorable" ? "border-dashed" : ""}`}
                  style={{
                    borderColor: getNodeBorder(node),
                    backgroundColor: selectedNode?.id === node.id ? wuxingTheme[node.element].color : "#ffffff"
                  }}
                />
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-5 text-center text-xs font-medium text-fs-muted">
            {elementOrder.map((element) => (
              <span key={element}>{wuxingTheme[element].label}</span>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {nodes.map((node) => (
              <button
                key={`chip-${node.id}`}
                type="button"
                onClick={() => setSelectedId(node.id)}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition hover:bg-white ${
                  selectedNode?.id === node.id ? "border-fs-ink bg-white" : "border-fs-line bg-fs-surface"
                }`}
              >
                <span className="font-semibold text-fs-ink">
                  {node.carrier} · {node.label}
                </span>
                <span className={getStanceClass(node.stance)}>{getStanceLabel(node.stance)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedNode ? <EnergyNodeCard node={selectedNode} /> : null}
      {interactions.length > 0 ? <InteractionList interactions={interactions} /> : null}
    </section>
  );
}

function EnergyNodeCard({ node }: { node: ElementEnergyNode }) {
  const theme = wuxingTheme[node.element];
  return (
    <article className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold text-fs-ink">{node.label}</p>
          <p className="mt-1 text-sm text-fs-muted">
            {node.tenGod} · {node.carrier}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-sm font-semibold"
          style={{ backgroundColor: node.stance === "unfavorable" ? "#fbf0f1" : theme.background, color: getBadgeColor(node) }}
        >
          {getStanceLabel(node.stance)} · {node.score}
        </span>
      </div>
      {node.relationTags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {node.relationTags.map((tag) => (
            <span key={tag} className="rounded-full border border-fs-line bg-fs-surface px-2.5 py-1 text-xs text-fs-muted">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-5 text-sm leading-7 text-fs-muted">{node.description}</p>
    </article>
  );
}

function InteractionList({ interactions }: { interactions: ElementInteraction[] }) {
  return (
    <div className="lg:col-span-2 rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-fs-ink">干支作用</p>
          <p className="mt-1 text-xs text-fs-muted">合、半合、三合局和三会方会改变单个节点的实际表现。</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {interactions.map((interaction) => (
          <article key={interaction.id} className="rounded-md border border-fs-line bg-fs-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-fs-ink">{interaction.title}</p>
                <p className="mt-1 text-xs text-fs-muted">
                  {interaction.type} · {interaction.participants.join("、")}
                </p>
              </div>
              <span className={getStanceClass(interaction.stance)}>{getStanceLabel(interaction.stance)}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-fs-muted">{interaction.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function getNodeX(node: ElementEnergyNode, nodeIndex: number) {
  const elementIndex = elementOrder.indexOf(node.element as (typeof elementOrder)[number]);
  if (elementIndex < 0) return 50;
  const jitter = ((nodeIndex % 3) - 1) * 4;
  return Math.max(6, Math.min(94, 10 + elementIndex * 20 + jitter));
}

function getNodeBorder(node: ElementEnergyNode) {
  if (node.stance === "favorable") return wuxingTheme[node.element].color;
  if (node.stance === "unfavorable") return "#c45b73";
  if (node.stance === "mixed") return "#b58a35";
  return wuxingTheme[node.element].border;
}

function getBadgeColor(node: ElementEnergyNode) {
  if (node.stance === "unfavorable") return "#c45b73";
  return wuxingTheme[node.element].color;
}

function getStanceLabel(stance: ElementEnergyNode["stance"]) {
  if (stance === "favorable") return "偏喜";
  if (stance === "unfavorable") return "偏忌";
  if (stance === "mixed") return "喜忌混杂";
  return "中性";
}

function getStanceClass(stance: ElementEnergyNode["stance"]) {
  if (stance === "favorable") return "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-fs-green";
  if (stance === "unfavorable") return "rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-fs-rose";
  if (stance === "mixed") return "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-fs-gold";
  return "rounded-full bg-fs-surface-2 px-2.5 py-1 text-xs font-semibold text-fs-muted";
}

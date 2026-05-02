import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SampleReportPreview } from "@/components/marketing/sample-report-preview";

type Props = {
  onStart: () => void;
  onSampleReport: () => void;
  isGenerating: boolean;
};

export function LandingHero({ onStart, onSampleReport, isGenerating }: Props) {
  return (
    <section className="bg-fs-bg">
      <div className="mx-auto grid min-h-[76svh] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="text-sm font-medium text-fs-gold">多维度人生光谱</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-normal text-fs-ink sm:text-6xl lg:text-7xl">命运光谱</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-fs-muted">
            把八字、紫微、大运与流年拆解成可解释的人生维度报告。
          </p>
          <div className="mt-7 grid gap-3 text-sm leading-6 text-fs-muted sm:grid-cols-3">
            <Benefit title="先看阶段" text="十年主线和年度变化放在前面。" />
            <Benefit title="分维度读" text="财富、舒适、自我价值分开判断。" />
            <Benefit title="给行动" text="机会、风险、下一步一起看。" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button" onClick={onStart}>
              <Sparkles size={17} />
              开始生成
            </Button>
            <Button type="button" variant="secondary" onClick={onSampleReport} disabled={isGenerating}>
              <ArrowDown size={17} />
              查看样例报告
            </Button>
          </div>
        </div>
        <SampleReportPreview />
      </div>
    </section>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-l border-fs-line pl-3">
      <p className="font-semibold text-fs-ink">{title}</p>
      <p className="mt-1">{text}</p>
    </div>
  );
}

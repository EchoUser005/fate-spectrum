import { expect, test, type Page } from "@playwright/test";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { PaipanResponseSchema } from "@/lib/schemas/paipan";
import type { Narrative, ReportApiRequest } from "@/lib/schemas/report";
import { buildRuleBasedReport } from "@/lib/scoring/engine";

const screenshotDir = "docs/design-review/screenshots";
const narrativeOverride: Narrative = {
  overview: "戊寅大运：当前主战场，开创、竞争、身份升级，但很耗。",
  dimensions: {
    wealth: "财富机会来自资源整合和现金流边界。",
    career: "事业推进适合争取更高可见度。",
    comfort: "舒适度偏低，注意长期消耗。",
    selfValue: "自我价值成就是当前主线。",
    relationship: "关系助力可用，但要控制沟通成本。",
    healthEnergy: "健康能量需要主动管理。",
    riskControl: "先设边界，再放大机会。"
  },
  keyWindows: [],
  actionPlan: ["先稳住现金流和健康边界。"]
};

async function mockReportApi(page: Page) {
  let payload: ReportApiRequest | null = null;
  await page.route("**/api/report", async (route) => {
    const requestPayload = route.request().postDataJSON() as ReportApiRequest;
    payload = requestPayload;
    const report = buildRuleBasedReport({
      birth: requestPayload.birth,
      paipan: PaipanResponseSchema.parse(samplePaipan),
      provider: requestPayload.paipanProvider,
      generatedAt: "2026-05-02T00:00:00.000Z",
      narrativeOverride
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(report)
    });
  });
  return () => payload;
}

async function fillBirth(page: Page) {
  await page.getByLabel("昵称").fill("匿名");
  await page.getByLabel("公历生日").fill("1999-09-15");
  await page.getByLabel("出生时间").fill("23:00");
  await page.getByLabel("出生地").fill("上海");
}

test("desktop user flow renders the report workbench and table-first report", async ({ page }) => {
  const getPayload = await mockReportApi(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "命运光谱" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "生辰配置" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "模型配置" })).toBeVisible();
  await expect(page.getByRole("button", { name: "生成报告" })).toBeVisible();
  await expect(page.getByText("使用样例体验")).not.toBeVisible();
  await expect(page.getByText("查看样例报告")).not.toBeVisible();
  await expect(page.getByText("Step")).not.toBeVisible();
  await expect(page.getByText("第 1 步")).not.toBeVisible();
  await expect(page.getByText("可选")).not.toBeVisible();
  await expect(page.getByText("高级设置")).not.toBeVisible();
  await expect(page.getByText("模型模式")).not.toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/desktop-home.png`, fullPage: true });

  await fillBirth(page);
  await page.getByRole("button", { name: "生成报告" }).click();
  await expect(page.getByText("请先填写模型密钥。")).toBeVisible();
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "生成报告" }).click();

  await expect(page.getByText("正在排盘")).toBeVisible();
  await expect(page.getByText("正在计算维度")).toBeVisible();
  await expect(page.getByText("正在生成报告")).toBeVisible();
  await expect(page.getByText("正在绘制图表")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("总览")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("大运")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("流年")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("高级数据")).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "命盘摘要" })).toBeVisible();
  await expect(page.getByText("财富量级").first()).toBeVisible();
  await expect(page.getByText("生活舒适度").first()).toBeVisible();
  await expect(page.getByText("自我价值成就").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "大运维度评分曲线" })).toBeVisible();
  await expect(page.getByText("先看这八步怎么起伏")).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "大运色阶图" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "大运评分表" })).toBeVisible();
  await expect(page.locator("#dayun").getByRole("columnheader", { name: "机会" })).toBeVisible();
  await expect(page.locator("#dayun").getByRole("columnheader", { name: "风险", exact: true })).toBeVisible();
  await expect(page.locator("#dayun").getByRole("columnheader", { name: "行动" })).toBeVisible();
  await expect(page.getByText("原始排盘 JSON")).not.toBeVisible();
  await expect(page.getByText("高级数据")).not.toBeVisible();
  expect(getPayload()).toMatchObject({
    birth: {
      nickname: "匿名",
      birthDate: "1999-09-15",
      birthTime: "23:00",
      birthPlace: "上海"
    },
    paipanProvider: {
      provider: "custom-paipan"
    },
    llmProvider: {
      provider: "deepseek",
      apiKey: "sk-test-session",
      model: "deepseek-v4-pro"
    },
    options: {
      useLlmNarrative: true
    }
  });

  await page.screenshot({ path: `${screenshotDir}/desktop-report-overview.png`, fullPage: true });
  await page.getByRole("navigation").getByText("大运").click();
  await expect(page.getByRole("heading", { name: "大运评分表" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/desktop-dayun.png`, fullPage: true });
});

test("model configuration is visible without advanced settings", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("模型模式")).not.toBeVisible();
  await expect(page.getByText("关闭")).not.toBeVisible();
  await expect(page.getByText("使用本地规则解读")).not.toBeVisible();
  await expect(page.getByText("模型密钥")).toBeVisible();
  await expect(page.getByText("shenjige endpoint")).not.toBeVisible();

  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.reload();
  await expect(page.getByLabel("模型密钥")).toHaveValue("sk-test-session");
  await page.getByRole("button", { name: /清除本次密钥/ }).click();
  await expect(page.getByLabel("模型密钥")).toHaveValue("");
});

test("mobile report stays readable with contained overflow", async ({ page }) => {
  await mockReportApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "命运光谱" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "生辰配置" })).toBeVisible();
  await expect(page.getByRole("button", { name: "生成报告" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/mobile-home.png`, fullPage: true });

  await fillBirth(page);
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "生成报告" }).click();
  await expect(page.getByRole("navigation").getByText("总览")).toBeVisible();
  await expect(page.getByRole("button", { name: "导出报告" })).toBeVisible();
  await expect(page.getByText("原始排盘 JSON")).not.toBeVisible();
  await expect(page.getByText("高级数据")).not.toBeVisible();
  await expect(page.getByText("Report Status")).not.toBeVisible();
  await expect(page.getByText("Dimension Spectrum")).not.toBeVisible();

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(hasPageOverflow).toBe(false);

  await page.screenshot({ path: `${screenshotDir}/mobile-report.png`, fullPage: true });
});

test("tablet layout keeps report navigation and tables usable", async ({ page }) => {
  await mockReportApi(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  await fillBirth(page);
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "生成报告" }).click();

  await expect(page.getByRole("navigation").getByText("流年")).toBeVisible();
  await page.getByRole("navigation").getByText("流年").click();
  await expect(page.getByRole("heading", { name: "流年维度评分表" })).toBeVisible();

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(hasPageOverflow).toBe(false);
});

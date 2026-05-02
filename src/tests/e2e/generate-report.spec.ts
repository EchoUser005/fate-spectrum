import { expect, test, type Page } from "@playwright/test";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { PaipanResponseSchema } from "@/lib/schemas/paipan";
import type { Narrative, ReportApiRequest } from "@/lib/schemas/report";
import { buildRuleBasedReport } from "@/lib/scoring/engine";

const screenshotDir = "docs/design-review/screenshots";
const narrativeOverride: Narrative = {
  overview: "日主: 戊土重承载。\n命盘格局: 当前主战场，开创、竞争、身份升级。\n喜用神: 先看火土承接。\n忌神: 避免长期高压。",
  currentEnvironment: "当前正行戊寅大运（2024-2033年），开创、竞争、身份升级，但很耗。2026 年适合把压力转成学习、证书、贵人和项目推进。",
  dimensions: {
    wealth: "财富机会来自资源整合和现金流边界。",
    career: "事业推进适合争取更高可见度。",
    comfort: "舒适度偏低，注意长期消耗。",
    selfValue: "自我价值成就是当前主线。",
    relationship: "感情关系可用，但要控制沟通成本。",
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

async function fillBirth(page: Page, nickname = "匿名") {
  await page.getByLabel("昵称").fill(nickname);
  await page.getByLabel("出生年份").selectOption("1999");
  await page.getByLabel("出生月份").selectOption("09");
  await page.getByLabel("出生日期").selectOption("15");
  await page.getByLabel("出生小时").selectOption("21");
  await page.getByLabel("出生分钟").selectOption("30");
  await expect(page.getByText("亥时")).toBeVisible();
  await expect(page.getByText("21:00-22:59")).toBeVisible();
  await page.getByLabel("出生地").fill("上海");
}

test("desktop user flow renders the report workbench and visual report", async ({ page }) => {
  const getPayload = await mockReportApi(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "命运光谱" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "填写生辰" })).toBeVisible();
  await expect(page.getByText("FATE SPECTRUM")).toBeVisible();
  await expect(page.getByText("四条主线")).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "模型渠道" })).toBeVisible();
  await expect(page.getByText("模型名称")).toBeVisible();
  await expect(page.getByLabel("模型渠道")).toContainText("DeepSeek");
  await expect(page.getByLabel("模型渠道")).toContainText("兼容渠道");
  await expect(page.getByLabel("模型名称")).toContainText("deepseek-v4-pro");
  await expect(page.getByLabel("模型名称")).toContainText("deepseek-v4-flash");
  await expect(page.getByLabel("模型名称")).toContainText("deepseek-chat");
  await expect(page.getByRole("button", { name: "生成命运光谱" })).toBeVisible();
  await expect(page.getByRole("button", { name: /亥时|子时|丑时|寅时/ })).not.toBeVisible();
  await expect(page.getByText("使用样例体验")).not.toBeVisible();
  await expect(page.getByText("查看样例报告")).not.toBeVisible();
  await expect(page.getByText("Step")).not.toBeVisible();
  await expect(page.getByText("第 1 步")).not.toBeVisible();
  await expect(page.getByText("可选")).not.toBeVisible();
  await expect(page.getByText("高级设置")).not.toBeVisible();
  await expect(page.getByText("模型模式")).not.toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/desktop-home.png`, fullPage: true });

  await fillBirth(page, "命主A");
  await page.getByRole("button", { name: "生成命运光谱" }).click();
  await expect(page.getByText("请先填写模型密钥。")).toBeVisible();
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "生成命运光谱" }).click();

  await expect(page.getByText("正在排盘")).toBeVisible();
  await expect(page.getByText("正在计算维度")).toBeVisible();
  await expect(page.getByText("正在写解读")).toBeVisible();
  await expect(page.getByText("正在绘制图表")).toBeVisible();
  await expect(page).toHaveURL(/\/chart$/);
  await expect(page.getByRole("navigation").getByText("FATE SPECTRUM")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("总览")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("大运")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("流年")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("星盘")).toBeVisible();
  await expect(page.getByLabel("命盘切换")).toBeVisible();
  await expect(page.getByRole("button", { name: "新增命盘" })).toBeVisible();
  await expect(page.getByRole("navigation").getByText("详细解读")).not.toBeVisible();
  await expect(page.getByRole("navigation").getByText("高级数据")).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "总览" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "命盘摘要" })).not.toBeVisible();
  await expect(page.getByText("财富量级").first()).toBeVisible();
  await expect(page.getByText("生活舒适度").first()).toBeVisible();
  await expect(page.getByText("自我价值成就").first()).toBeVisible();
  await expect(page.getByText("感情关系").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "大运维度评分曲线" })).toBeVisible();
  await expect(page.getByText("先看这八步怎么起伏")).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "大运色阶图" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "大运评分表" })).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "星盘要点" })).not.toBeVisible();
  await page.getByRole("navigation").getByText("星盘").click();
  await expect(page.getByText("当前阶段 · 紫微")).toBeVisible();
  await expect(page.getByRole("heading", { name: "紫微十二宫" })).toBeVisible();
  await page.getByRole("navigation").getByText("总览").click();
  await expect(page.getByText("当前阶段 · 八字")).toBeVisible();
  await expect(page.getByRole("heading", { name: "八字四柱" })).toBeVisible();
  await expect(page.getByText("藏干未返回")).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "七个维度分别看" })).not.toBeVisible();
  await expect(page.getByText("原始排盘 JSON")).not.toBeVisible();
  await expect(page.getByText("高级数据")).not.toBeVisible();
  expect(getPayload()).toMatchObject({
    birth: {
      nickname: "命主A",
      birthDate: "1999-09-15",
      birthTime: "21:30",
      timeBranch: "亥",
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
  await expect(page.getByRole("heading", { name: "大运维度评分曲线" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/desktop-dayun.png`, fullPage: true });
  await page.getByRole("button", { name: "新增命盘" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "填写生辰" })).toBeVisible();
  await fillBirth(page, "缘主A");
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "生成命运光谱" }).click();
  await expect(page).toHaveURL(/\/chart$/);
  await expect(page.getByLabel("命盘切换")).toContainText("缘主 · 缘主A");
  await page.getByLabel("命盘切换").selectOption({ label: "命主 · 命主A" });
  await expect(page.locator("#overview").getByText("命主A").first()).toBeVisible();
  await expect(page.getByLabel("命盘切换")).toContainText("命主 · 命主A");
  await page.getByRole("button", { name: "新增命盘" }).click();
  await expect(page.getByRole("button", { name: "返回命盘" })).toBeVisible();
  await page.getByRole("button", { name: "返回命盘" }).click();
  await expect(page).toHaveURL(/\/chart$/);
});

test("model configuration is visible without advanced settings", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("模型模式")).not.toBeVisible();
  await expect(page.getByText("关闭")).not.toBeVisible();
  await expect(page.getByText("使用本地规则解读")).not.toBeVisible();
  await expect(page.getByText("解读质量")).not.toBeVisible();
  await expect(page.getByText("快速")).not.toBeVisible();
  await expect(page.getByText("高质量")).not.toBeVisible();
  await expect(page.getByText("模型密钥")).toBeVisible();
  await expect(page.getByText("shenjige endpoint")).not.toBeVisible();

  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.reload();
  await expect(page.getByLabel("模型密钥")).toHaveValue("sk-test-session");
  await page.getByRole("button", { name: /清除密钥/ }).click();
  await expect(page.getByLabel("模型密钥")).toHaveValue("");
});

test("mobile report stays readable with contained overflow", async ({ page }) => {
  await mockReportApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "命运光谱" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "填写生辰" })).toBeVisible();
  await expect(page.getByRole("button", { name: "生成命运光谱" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/mobile-home.png`, fullPage: true });

  await fillBirth(page);
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "生成命运光谱" }).click();
  await expect(page).toHaveURL(/\/chart$/);
  await expect(page.getByRole("navigation").getByText("总览")).toBeVisible();
  await expect(page.getByRole("button", { name: "分享到微信" })).toBeVisible();
  await expect(page.getByRole("button", { name: "分享到小红书" })).toBeVisible();
  await expect(page.getByText("导出内容包含免责声明")).not.toBeVisible();
  await expect(page.getByText("生成说明")).not.toBeVisible();
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
  await page.getByRole("button", { name: "生成命运光谱" }).click();

  await expect(page).toHaveURL(/\/chart$/);
  await expect(page.getByRole("navigation").getByText("流年")).toBeVisible();
  await page.getByRole("navigation").getByText("流年").click();
  await expect(page.getByRole("heading", { name: "流年维度评分表" })).toBeVisible();

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(hasPageOverflow).toBe(false);
});

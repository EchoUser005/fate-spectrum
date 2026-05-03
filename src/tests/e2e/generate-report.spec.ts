import { expect, test, type Page } from "@playwright/test";
import samplePaipan from "@/fixtures/sample-paipan.json";
import { PaipanResponseSchema } from "@/lib/schemas/paipan";
import type { Narrative, ReportApiRequest } from "@/lib/schemas/report";
import { buildRuleBasedReport } from "@/lib/scoring/engine";

const screenshotDir = "docs/design-review/screenshots";
const narrativeOverride: Narrative = {
  overview: "日主: 匿名结构样例。\n命盘格局: 仅用于验证报告排版。\n喜用神: 示例文本不对应真实命盘。\n忌神: 示例文本不对应真实命盘。",
  currentEnvironment: "当前使用匿名结构样例验证阶段卡片。2026 年文本只用于 UI 回归，不对应真实命盘。",
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
  await page.getByLabel("出生年份").selectOption("1992");
  await page.getByLabel("出生月份").selectOption("09");
  await page.getByLabel("出生日期").selectOption("29");
  await page.getByLabel("出生小时").selectOption("12");
  await page.getByLabel("出生分钟").selectOption("00");
  await expect(page.getByText("午时")).toBeVisible();
  await expect(page.getByText("11:00-12:59")).toBeVisible();
  await page.getByLabel("出生地").fill("示例城市");
}

test("desktop user flow renders the report workbench and visual report", async ({ page }) => {
  const getPayload = await mockReportApi(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "填写生辰" })).toBeVisible();
  await expect(page.getByText("FATE SPECTRUM")).toBeVisible();
  await expect(page.getByText("四条主线")).not.toBeVisible();
  await expect(page.getByText("模型渠道")).not.toBeVisible();
  await expect(page.getByText("模型名称")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "生成命运光谱" })).not.toBeVisible();
  await fillBirth(page, "命主A");
  await page.getByRole("button", { name: "下一步" }).click();
  await expect(page.getByRole("heading", { name: "配置模型" })).toBeVisible();
  await expect(page.getByText("模型渠道")).toBeVisible();
  await expect(page.getByText("模型名称")).toBeVisible();
  await expect(page.getByLabel("模型渠道")).toContainText("DeepSeek");
  await expect(page.getByLabel("模型渠道")).toContainText("兼容渠道");
  await expect(page.getByLabel("模型名称")).toContainText("deepseek-v4-pro");
  await expect(page.getByLabel("模型名称")).toContainText("deepseek-v4-flash");
  await expect(page.getByLabel("模型名称")).toContainText("deepseek-chat");
  await expect(page.getByRole("link", { name: /DeepSeek API 开放平台/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "开始探索命运光谱" })).toBeVisible();
  await expect(page.getByRole("button", { name: /亥时|子时|丑时|寅时/ })).not.toBeVisible();
  await expect(page.getByText("使用样例体验")).not.toBeVisible();
  await expect(page.getByText("查看样例报告")).not.toBeVisible();
  await expect(page.getByText("Step")).not.toBeVisible();
  await expect(page.getByText("第 1 步")).not.toBeVisible();
  await expect(page.getByText("可选")).not.toBeVisible();
  await expect(page.getByText("高级设置")).not.toBeVisible();
  await expect(page.getByText("模型模式")).not.toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/desktop-home.png`, fullPage: true });

  await page.getByRole("button", { name: "开始探索命运光谱" }).click();
  await expect(page.getByText("请先填写模型密钥。")).toBeVisible();
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "开始探索命运光谱" }).click();

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
  await page.getByLabel("个人中心").click();
  await expect(page.getByLabel("命盘切换")).toBeVisible();
  await expect(page.getByRole("button", { name: "模型配置" })).toBeVisible();
  await expect(page.getByRole("button", { name: "新增命盘" })).toBeVisible();
  await expect(page.getByRole("button", { name: "注销命主" })).toBeVisible();
  await expect(page.getByRole("navigation").getByText("详细解读")).not.toBeVisible();
  await expect(page.getByRole("navigation").getByText("高级数据")).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "总览" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "命盘摘要" })).not.toBeVisible();
  await expect(page.getByText("格局重点")).toBeVisible();
  await expect(page.getByText("总体能量偏好")).toBeVisible();
  await expect(page.getByText("能量谱")).toBeVisible();
  await expect(page.getByText("干支作用")).toBeVisible();
  await expect(page.getByText("点按节点查看具体解释")).toBeVisible();
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
      birthDate: "1992-09-29",
      birthTime: "12:00",
      timeBranch: "午",
      birthPlace: "示例城市"
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
      useLlmNarrative: true,
      profileRole: "owner"
    }
  });

  await page.screenshot({ path: `${screenshotDir}/desktop-report-overview.png`, fullPage: true });
  await page.getByRole("navigation").getByText("大运").click();
  await expect(page.getByRole("heading", { name: "大运维度评分曲线" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/desktop-dayun.png`, fullPage: true });
  await page.getByLabel("个人中心").click();
  await page.getByRole("button", { name: "新增命盘" }).click();
  await expect(page).toHaveURL(/\/chart(#.*)?$/);
  await expect(page.getByRole("heading", { name: "新增命盘" })).toBeVisible();
  await fillBirth(page, "缘主A");
  await page.getByLabel("缘主关系").selectOption("friend");
  await page.getByRole("button", { name: "添加命运光谱" }).click();
  await expect(page).toHaveURL(/\/chart(#.*)?$/);
  expect(getPayload()).toMatchObject({
    birth: {
      nickname: "缘主A"
    },
    options: {
      profileRole: "guest"
    }
  });
  await page.getByLabel("个人中心").click();
  await expect(page.getByLabel("命盘切换")).toContainText("缘主 · 缘主A");
  await page.getByLabel("命盘切换").selectOption({ label: "命主 · 命主A" });
  await expect(page.locator("#overview").getByText("命主A").first()).toBeVisible();
  await expect(page.getByLabel("命盘切换")).toContainText("命主 · 命主A");
  await page.getByLabel("个人中心").click();
  await page.getByRole("button", { name: "新增命盘" }).click();
  await expect(page.getByRole("heading", { name: "新增命盘" })).toBeVisible();
  await page.getByLabel("关闭弹窗").click();
  await expect(page).toHaveURL(/\/chart(#.*)?$/);
});

test("model configuration is visible without advanced settings", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("第 2 步").click();
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
  await page.getByLabel("第 2 步").click();
  await expect(page.getByLabel("模型密钥")).toHaveValue("sk-test-session");
  await page.getByRole("button", { name: /清除密钥/ }).click();
  await expect(page.getByLabel("模型密钥")).toHaveValue("");
});

test("mobile report stays readable with contained overflow", async ({ page }) => {
  await mockReportApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "填写生辰" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/mobile-home.png`, fullPage: true });

  await fillBirth(page);
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "开始探索命运光谱" }).click();
  await expect(page).toHaveURL(/\/chart$/);
  await expect(page.getByRole("navigation").getByText("总览")).toBeVisible();
  await expect(page.getByLabel("复制水印截图")).toBeVisible();
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
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByLabel("模型密钥").fill("sk-test-session");
  await page.getByRole("button", { name: "开始探索命运光谱" }).click();

  await expect(page).toHaveURL(/\/chart$/);
  await expect(page.getByRole("navigation").getByText("流年")).toBeVisible();
  await page.getByRole("navigation").getByText("流年").click();
  await expect(page.getByRole("heading", { name: "流年维度评分表" })).toBeVisible();

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(hasPageOverflow).toBe(false);
});

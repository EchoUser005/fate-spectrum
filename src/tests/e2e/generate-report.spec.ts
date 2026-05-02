import { expect, test } from "@playwright/test";

const screenshotDir = "docs/design-review/screenshots";

test("desktop user flow renders the redesigned visual report", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "命运光谱" })).toBeVisible();
  await expect(page.getByText("把八字、紫微、大运与流年拆解成可解释的人生维度报告。")).toBeVisible();
  await expect(page.getByRole("button", { name: "开始生成" })).toBeVisible();
  await expect(page.getByRole("button", { name: "查看样例报告" })).toBeVisible();
  await expect(page.getByText("Provider")).not.toBeVisible();
  await expect(page.getByText("Paipan")).not.toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/desktop-home.png`, fullPage: true });

  await page.getByRole("button", { name: "查看样例报告" }).click();

  await expect(page.getByText("正在排盘")).toBeVisible();
  await expect(page.getByText("正在计算维度")).toBeVisible();
  await expect(page.getByText("正在生成报告")).toBeVisible();
  await expect(page.getByText("正在绘制图表")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("总览")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("大运")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("流年")).toBeVisible();
  await expect(page.getByRole("heading", { name: "命盘摘要" })).toBeVisible();
  await expect(page.getByText("财富量级").first()).toBeVisible();
  await expect(page.getByText("生活舒适度").first()).toBeVisible();
  await expect(page.getByText("自我价值成就").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "先看这八步怎么起伏" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "大运色阶图" })).toBeVisible();
  await expect(page.getByText("原始排盘 JSON")).not.toBeVisible();

  await page.screenshot({ path: `${screenshotDir}/desktop-report-overview.png`, fullPage: true });
  await page.getByRole("navigation").getByText("大运").click();
  await expect(page.getByRole("heading", { name: "大运评分表" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/desktop-dayun.png`, fullPage: true });
});

test("advanced settings contain technical details without polluting the main interface", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("使用样例体验")).toBeVisible();
  await expect(page.getByText("使用真实排盘")).toBeVisible();
  await expect(page.getByText("shenjige endpoint")).not.toBeVisible();

  await page.getByText("高级设置").click();
  await expect(page.getByText("shenjige endpoint")).toBeVisible();
  await expect(page.getByText("Base URL")).toBeVisible();

  await page.getByRole("button", { name: "高质量 适合生成更完整的文字报告" }).click();
  await page.getByLabel("Key").fill("sk-test-session");
  await page.reload();
  await page.getByText("高级设置").click();
  await expect(page.getByLabel("Key")).toHaveValue("sk-test-session");
  await page.getByRole("button", { name: /清除本会话 Key/ }).click();
  await expect(page.getByLabel("Key")).toHaveValue("");
});

test("mobile report stays readable with contained overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "命运光谱" })).toBeVisible();
  await expect(page.getByRole("button", { name: "开始生成" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/mobile-home.png`, fullPage: true });

  await page.getByRole("button", { name: "查看样例报告" }).click();
  await expect(page.getByRole("navigation").getByText("总览")).toBeVisible();
  await expect(page.getByRole("navigation").getByText("高级数据")).toBeVisible();
  await expect(page.getByRole("button", { name: "导出报告" })).toBeVisible();
  await expect(page.getByRole("button", { name: "导出数据" })).toBeVisible();
  await expect(page.getByText("原始排盘 JSON")).not.toBeVisible();
  await expect(page.getByText("Report Status")).not.toBeVisible();
  await expect(page.getByText("Dimension Spectrum")).not.toBeVisible();

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(hasPageOverflow).toBe(false);

  await page.getByRole("navigation").getByText("高级数据").click();
  await page.locator("section#developer summary").first().click();
  await expect(page.getByText("原始排盘 JSON")).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/mobile-report.png`, fullPage: true });
});

test("tablet layout keeps report navigation and tables usable", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  await page.getByRole("button", { name: "查看样例报告" }).click();

  await expect(page.getByRole("navigation").getByText("流年")).toBeVisible();
  await page.getByRole("navigation").getByText("流年").click();
  await expect(page.getByRole("heading", { name: "先看当前阶段内的年份变化" })).toBeVisible();

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(hasPageOverflow).toBe(false);
});

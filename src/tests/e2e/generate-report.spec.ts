import { expect, test } from "@playwright/test";

test("mock demo generates an outcome-first spectrum report", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Fate Spectrum · 命运光谱").first()).toBeVisible();
  await expect(page.getByText("先看未来阶段怎么发力")).toBeVisible();
  await expect(page.getByText("原始排盘和 JSON 会保留在高级源数据里")).toBeVisible();
  await page.getByRole("button", { name: /生成我的人生光谱/ }).click();

  await expect(page.getByText("校验输入")).toBeVisible();
  await expect(page.getByText("获取排盘")).toBeVisible();
  await expect(page.getByText("归一化排盘")).toBeVisible();
  await expect(page.getByText("计算光谱分数")).toBeVisible();
  await expect(page.getByText("生成解释")).toBeVisible();
  await expect(page.getByText("渲染结果")).toBeVisible();
  await expect(page.getByRole("heading", { name: "先看你的节奏，不看原始数据" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "你的能量形状" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "接下来可以怎么做" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "值得提前准备的窗口" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "十年节奏表" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "年度色阶" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "阶段色阶图" })).toBeVisible();
  await expect(page.getByText("不构成医疗、法律、投资、心理诊断或其他专业建议").first()).toBeVisible();
  await expect(page.getByText("原始排盘 JSON")).not.toBeVisible();

  await page.getByText("高级源数据：排盘结构与原始 JSON").click();
  await expect(page.getByRole("heading", { name: "八字四柱" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "星盘宫格" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "原始排盘 JSON" })).toBeVisible();
  await expect(page.getByRole("button", { name: /导出光谱报告/ })).toBeEnabled();
});

test("DeepSeek V4 guidance and session key cache work", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("启用 LLM 解释润色").check();
  await expect(page.getByLabel("Model")).toHaveValue("deepseek-v4-flash");
  await expect(page.getByText("申请 API Key")).toBeVisible();
  await page.getByLabel("API Key").fill("sk-test-session");
  await expect(page.getByLabel("API Key")).toHaveValue("sk-test-session");

  await page.reload();
  await expect(page.getByLabel("启用 LLM 解释润色")).toBeChecked();
  await expect(page.getByLabel("API Key")).toHaveValue("sk-test-session");

  await page.getByRole("button", { name: /清除本会话 Key/ }).click();
  await expect(page.getByLabel("启用 LLM 解释润色")).not.toBeChecked();
  await expect(page.getByLabel("API Key")).toHaveValue("");
});

test("mock demo remains usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByText("Fate Spectrum · 命运光谱").first()).toBeVisible();
  await page.getByRole("button", { name: /生成我的人生光谱/ }).click();

  await expect(page.getByText("报告生成进度")).toBeVisible();
  await expect(page.getByText("你的能量形状")).toBeVisible();
  await expect(page.getByRole("button", { name: /导出 JSON/ })).toBeEnabled();
});

import { expect, test } from "@playwright/test";

test("mock demo can generate a complete spectrum report", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Fate Spectrum · 命运光谱").first()).toBeVisible();
  await expect(page.getByText("Mock Demo 一键生成，无需 Key")).toBeVisible();
  await expect(
    page.getByText("DeepSeek / OpenAI-compatible 只负责解释已有排盘和规则分数，不负责排盘，也不会改写分数。")
  ).toBeVisible();
  await page.getByRole("button", { name: /生成我的命盘光谱/ }).click();

  await expect(page.getByText("校验输入")).toBeVisible();
  await expect(page.getByText("获取排盘")).toBeVisible();
  await expect(page.getByText("归一化排盘")).toBeVisible();
  await expect(page.getByText("计算光谱分数")).toBeVisible();
  await expect(page.getByText("生成解释")).toBeVisible();
  await expect(page.getByText("渲染结果")).toBeVisible();
  await expect(page.getByRole("heading", { name: "八字四柱" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "多维度能量谱" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "大运光谱" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "流年色阶" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "光谱曲线" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "色阶图" })).toBeVisible();
  await expect(page.getByText("本报告以七个维度的色阶和曲线呈现能量分布")).toBeVisible();
  await expect(page.getByText("导出内容包含免责声明")).toBeVisible();
  await expect(page.getByText("不构成医疗、法律、投资、心理诊断或其他专业建议")).toBeVisible();
  await expect(page.getByText("原始排盘 JSON")).toBeVisible();
  await expect(page.getByRole("button", { name: /导出光谱报告/ })).toBeEnabled();
});

test("mock demo remains usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByText("Fate Spectrum · 命运光谱").first()).toBeVisible();
  await page.getByRole("button", { name: /生成我的命盘光谱/ }).click();

  await expect(page.getByText("生成状态")).toBeVisible();
  await expect(page.getByText("多维度能量谱")).toBeVisible();
  await expect(page.getByRole("button", { name: /导出 JSON/ })).toBeEnabled();
  await expect(page.getByText("原始排盘 JSON")).toBeVisible();
});

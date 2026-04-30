import { expect, test } from "@playwright/test";

test("mock demo can generate a complete spectrum report", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Fate Spectrum · 命运光谱").first()).toBeVisible();
  await page.getByRole("button", { name: /生成我的命盘光谱/ }).click();

  await expect(page.getByText("八字四柱")).toBeVisible();
  await expect(page.getByText("大运光谱")).toBeVisible();
  await expect(page.getByText("流年色阶")).toBeVisible();
  await expect(page.getByText("色阶图")).toBeVisible();
  await expect(page.getByText("原始排盘 JSON")).toBeVisible();
  await expect(page.getByRole("button", { name: /导出光谱报告/ })).toBeEnabled();
});

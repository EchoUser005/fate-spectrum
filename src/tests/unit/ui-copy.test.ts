import { describe, expect, it } from "vitest";
import {
  BANNED_PUBLIC_TERMS,
  INTERNAL_TECHNICAL_COPY,
  PUBLIC_UI_COPY
} from "@/lib/ui-copy/glossary";

describe("user-facing copy", () => {
  it("keeps ordinary UI copy free from technical terms", () => {
    const publicCopy = PUBLIC_UI_COPY.join("\n");

    for (const term of BANNED_PUBLIC_TERMS) {
      expect(publicCopy).not.toContain(term);
    }
  });

  it("keeps ordinary UI copy free from manual-like flow words", () => {
    const publicCopy = PUBLIC_UI_COPY.join("\n");

    for (const term of ["使用样例体验", "查看样例报告", "Step", "第 1 步", "可选", "高级设置", "高级数据"]) {
      expect(publicCopy).not.toContain(term);
    }
  });

  it("tracks technical copy separately from public UI copy", () => {
    const internalCopy = INTERNAL_TECHNICAL_COPY.join("\n");

    expect(internalCopy).toContain("shenjige");
    expect(internalCopy).toContain("endpoint");
    expect(internalCopy).toContain("JSON");
  });
});

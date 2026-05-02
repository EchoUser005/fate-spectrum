import { describe, expect, it } from "vitest";
import {
  ADVANCED_TECHNICAL_COPY,
  BANNED_PUBLIC_TERMS,
  PUBLIC_UI_COPY
} from "@/lib/ui-copy/glossary";

describe("user-facing copy", () => {
  it("keeps ordinary UI copy free from technical terms", () => {
    const publicCopy = PUBLIC_UI_COPY.join("\n");

    for (const term of BANNED_PUBLIC_TERMS) {
      expect(publicCopy).not.toContain(term);
    }
  });

  it("keeps technical copy inside advanced/developer areas", () => {
    const advancedCopy = ADVANCED_TECHNICAL_COPY.join("\n");

    expect(advancedCopy).toContain("shenjige");
    expect(advancedCopy).toContain("endpoint");
    expect(advancedCopy).toContain("JSON");
  });
});

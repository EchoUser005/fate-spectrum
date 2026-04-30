import { describe, expect, it } from "vitest";
import { extractJsonObject } from "@/lib/llm/safe-json";

describe("safe json extraction", () => {
  it("parses direct JSON", () => {
    expect(extractJsonObject('{"overview":"ok"}')).toEqual({ overview: "ok" });
  });

  it("parses fenced JSON", () => {
    expect(extractJsonObject('```json\n{"overview":"ok"}\n```')).toEqual({ overview: "ok" });
  });

  it("parses JSON embedded in prose", () => {
    expect(extractJsonObject('结果如下：{"overview":"ok"}')).toEqual({ overview: "ok" });
  });

  it("throws when JSON is absent", () => {
    expect(() => extractJsonObject("not json")).toThrow();
  });
});

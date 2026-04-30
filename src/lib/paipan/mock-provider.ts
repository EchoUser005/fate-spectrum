import samplePaipan from "@/fixtures/sample-paipan.json";
import { PaipanResponseSchema, type PaipanResponse } from "@/lib/schemas/paipan";
import type { PaipanProvider } from "@/lib/paipan/providers";

export const mockPaipanProvider: PaipanProvider = {
  id: "mock",
  name: "Mock Demo",
  async generate(): Promise<PaipanResponse> {
    return PaipanResponseSchema.parse(samplePaipan);
  }
};

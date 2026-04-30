import type { BirthInput } from "@/lib/schemas/birth";
import type { PaipanResponse } from "@/lib/schemas/paipan";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { customPaipanProvider } from "@/lib/paipan/custom-provider";
import { mockPaipanProvider } from "@/lib/paipan/mock-provider";

export interface PaipanProvider {
  id: string;
  name: string;
  generate(input: BirthInput, config: ProviderConfig): Promise<PaipanResponse>;
}

export function getPaipanProvider(config: ProviderConfig): PaipanProvider {
  if (config.provider === "custom-paipan") {
    return customPaipanProvider;
  }
  return mockPaipanProvider;
}

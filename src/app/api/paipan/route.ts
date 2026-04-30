import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PaipanApiRequestSchema } from "@/lib/schemas/report";
import { getPaipanProvider } from "@/lib/paipan/providers";
import { normalizePaipan } from "@/lib/paipan/normalize";
import { readJsonWithLimit, safeErrorResponse } from "@/app/api/_lib";

export async function POST(request: NextRequest) {
  try {
    const payload = PaipanApiRequestSchema.parse(await readJsonWithLimit(request));
    const provider = getPaipanProvider(payload.provider);
    const paipan = await provider.generate(payload.birth, payload.provider);
    const normalized = normalizePaipan(paipan).normalized;
    return NextResponse.json({ paipan, normalized });
  } catch (error) {
    return safeErrorResponse(error);
  }
}

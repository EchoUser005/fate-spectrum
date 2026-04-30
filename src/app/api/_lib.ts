import { NextResponse, type NextRequest } from "next/server";
import { MAX_API_BODY_BYTES } from "@/lib/constants";

export async function readJsonWithLimit(request: NextRequest): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_API_BODY_BYTES) {
    throw new Error("Request body is too large.");
  }
  return request.json();
}

export function safeErrorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Unexpected error.";
  return NextResponse.json({ error: sanitizeSecret(message) }, { status });
}

export function sanitizeSecret(message: string) {
  return message
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/sk-[A-Za-z0-9._-]+/g, "sk-[REDACTED]")
    .replace(/api[_-]?key["':=\s]+[A-Za-z0-9._-]+/gi, "apiKey [REDACTED]");
}

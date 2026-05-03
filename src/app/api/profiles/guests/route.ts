import type { NextRequest } from "next/server";
import { readJsonWithLimit } from "@/app/api/_lib";
import { proxyMemoryJson } from "@/lib/memory/api";

export async function GET() {
  return proxyMemoryJson("/profiles/guests");
}

export async function POST(request: NextRequest) {
  return proxyMemoryJson("/profiles/guests", {
    method: "POST",
    body: await readJsonWithLimit(request)
  });
}

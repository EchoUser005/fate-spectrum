import type { NextRequest } from "next/server";
import { readJsonWithLimit } from "@/app/api/_lib";
import { proxyMemoryJson } from "@/lib/memory/api";

export async function GET() {
  return proxyMemoryJson("/profiles/owner");
}

export async function PUT(request: NextRequest) {
  return proxyMemoryJson("/profiles/owner", {
    method: "PUT",
    body: await readJsonWithLimit(request)
  });
}

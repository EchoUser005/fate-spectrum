import { proxyMemoryJson } from "@/lib/memory/api";

export async function GET() {
  return proxyMemoryJson("/profiles");
}

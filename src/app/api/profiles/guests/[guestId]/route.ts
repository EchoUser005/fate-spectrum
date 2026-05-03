import { proxyMemoryJson } from "@/lib/memory/api";

export async function GET(_request: Request, context: { params: Promise<{ guestId: string }> }) {
  const { guestId } = await context.params;
  return proxyMemoryJson(`/profiles/guests/${encodeURIComponent(guestId)}`);
}

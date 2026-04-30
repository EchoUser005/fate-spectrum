import { NextResponse } from "next/server";
import { ENGINE_VERSION } from "@/lib/constants";

export function GET() {
  return NextResponse.json({
    ok: true,
    version: ENGINE_VERSION
  });
}

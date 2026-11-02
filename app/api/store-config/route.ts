import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";
import { storeConfigFromSettings } from "@/lib/store-config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { config: storeConfigFromSettings(getSettings()) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

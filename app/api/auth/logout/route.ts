import { NextResponse } from "next/server";
import { logout } from "@/lib/auth-server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope");
  await logout(scope === "admin" ? "admin" : "customer");
  return NextResponse.redirect(new URL(scope === "admin" ? "/admin/login" : "/", url.origin), 303);
}

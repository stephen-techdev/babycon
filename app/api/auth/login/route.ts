import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { loginAs } from "@/lib/auth-server";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const { email, password, next } = await request.json();
    const user = findUserByEmail(String(email || ""));
    if (!user || user.role !== "customer" || !verifyPassword(String(password || ""), user.passwordHash)) {
      return NextResponse.json(
        { ok: false, message: "Those details don't match our records." },
        { status: 401 }
      );
    }
    await loginAs(user.id, "customer");
    return NextResponse.json({ ok: true, redirect: next || "/account" });
  } catch {
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { loginAs } from "@/lib/auth-server";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = findUserByEmail(String(email || ""));
    if (!user || user.role !== "admin" || !verifyPassword(String(password || ""), user.passwordHash)) {
      return NextResponse.json(
        { ok: false, message: "Invalid admin credentials." },
        { status: 401 }
      );
    }
    await loginAs(user.id, "admin");
    return NextResponse.json({ ok: true, redirect: "/admin" });
  } catch {
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 400 });
  }
}

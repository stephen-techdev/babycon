import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { loginAs } from "@/lib/auth-server";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();
    if (!name || String(name).trim().length < 2)
      return NextResponse.json({ ok: false, message: "Please enter your name." }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(String(email || "")))
      return NextResponse.json({ ok: false, message: "Please enter a valid email." }, { status: 400 });
    if (String(password || "").length < 8)
      return NextResponse.json(
        { ok: false, message: "Use at least 8 characters for your password." },
        { status: 400 }
      );
    if (findUserByEmail(String(email)))
      return NextResponse.json(
        { ok: false, message: "An account already exists with this email." },
        { status: 409 }
      );
    const user = createUser({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || "").replace(/\D/g, "").slice(-10),
      passwordHash: hashPassword(String(password)),
    });
    await loginAs(user.id, "customer");
    return NextResponse.json({ ok: true, redirect: "/account" });
  } catch {
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 400 });
  }
}

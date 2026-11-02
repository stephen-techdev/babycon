import { NextResponse } from "next/server";
import { createMessage } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    if (name.length < 2) return NextResponse.json({ ok: false, message: "Please share your name." }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ ok: false, message: "Please enter a valid email." }, { status: 400 });
    if (message.length < 10)
      return NextResponse.json({ ok: false, message: "Please add a little more detail." }, { status: 400 });
    createMessage({
      name,
      email,
      phone: String(body.phone || "").trim(),
      subject: String(body.subject || "General enquiry"),
      message,
    });
    return NextResponse.json({ ok: true, message: "Thank you — we'll reply within one working day." });
  } catch {
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 400 });
  }
}

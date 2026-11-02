import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!/^\S+@\S+\.\S+$/.test(String(email || ""))) {
      return NextResponse.json({ ok: false, message: "Enter a valid email." }, { status: 400 });
    }
    const added = addSubscriber(String(email).trim());
    return NextResponse.json({
      ok: true,
      message: added ? "You're on the list. Welcome to the family." : "You're already subscribed.",
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 400 });
  }
}

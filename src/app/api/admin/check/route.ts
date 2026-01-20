import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const ok = cookie
    .split(";")
    .map((c) => c.trim())
    .some((c) => c.startsWith("ccb_admin=1"));
  if (ok) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false }, { status: 401 });
}

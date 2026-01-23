import { NextResponse } from "next/server";

export async function POST() {
  // Clear cookie
  const cookie = `ccb_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Set-Cookie": cookie } },
  );
}

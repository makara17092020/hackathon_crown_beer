import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // set http-only cookie
      const maxAge = 60 * 60 * 8; // 8 hours
      const secureFlag =
        process.env.NODE_ENV === "production" ? "; Secure" : "";
      const cookie = `ccb_admin=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;

      return NextResponse.json(
        { ok: true },
        { status: 200, headers: { "Set-Cookie": cookie } },
      );
    }

    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Bad request" },
      { status: 400 },
    );
  }
}

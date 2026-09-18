import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, setAdminSessionCookie } from "@/lib/admin-auth";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(`admin-login:${requestIp(req.headers)}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    const { passcode } = await req.json();
    if (typeof passcode !== "string" || !passcode.trim()) {
      return NextResponse.json({ success: false, message: "Passcode is required." }, { status: 400 });
    }

    const envPasscode = process.env.ADMIN_PASSCODE || process.env.ADMIN_SECRET_KEY;
    if (!envPasscode) {
      return NextResponse.json(
        { success: false, message: "Admin authentication is not configured." },
        { status: 503 },
      );
    }

    const supplied = Buffer.from(passcode.trim());
    const expected = Buffer.from(envPasscode.trim());
    const matches =
      supplied.length === expected.length &&
      crypto.timingSafeEqual(supplied, expected);

    if (!matches) {
      return NextResponse.json({ success: false, message: "Invalid admin passcode." }, { status: 401 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@ecovolt.co.ke";
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      adminEmail,
    });
    setAdminSessionCookie(response, createAdminSession(adminEmail));
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during authentication." },
      { status: 500 },
    );
  }
}

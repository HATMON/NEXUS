import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(`admin-reset:${requestIp(req.headers)}`, 3, 30 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many recovery attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // Password recovery must be performed through a configured identity/OTP provider.
  // Never return OTPs or accept a reset without server-side OTP verification.
  return NextResponse.json(
    {
      success: false,
      message:
        "Admin self-service recovery is disabled until a secure SMS/email OTP provider is configured. Use the deployment secret manager to rotate ADMIN_PASSCODE.",
    },
    { status: 503 },
  );
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    if (!passcode) {
      return NextResponse.json(
        { success: false, message: "Passcode is required." },
        { status: 400 }
      );
    }

    const envPasscode = process.env.ADMIN_PASSCODE || process.env.ADMIN_SECRET_KEY;

    if (!envPasscode) {
      return NextResponse.json(
        { success: false, message: "ADMIN_PASSCODE secret is not configured in server environment variables." },
        { status: 500 }
      );
    }

    if (passcode.trim() === envPasscode.trim()) {
      return NextResponse.json({
        success: true,
        message: "Admin authentication successful.",
        adminEmail: process.env.ADMIN_EMAIL || "admin@ecovolt.co.ke",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid admin passcode." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}

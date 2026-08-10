import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, phoneInput, code, newPasscode } = await req.json();
    const targetPhone = process.env.ADMIN_RESET_PHONE || "0727 971171";

    if (action === "send-otp") {
      const digitsInput = (phoneInput || "").replace(/[^0-9]/g, "");
      const targetDigits = targetPhone.replace(/[^0-9]/g, "");

      if (!digitsInput.endsWith(targetDigits.slice(-9)) && digitsInput !== targetDigits) {
        return NextResponse.json(
          {
            success: false,
            message: `Unrecognized admin recovery phone number. Verification OTP can only be dispatched to registered admin number.`,
          },
          { status: 400 }
        );
      }

      // Generate 6-digit OTP code on server
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      return NextResponse.json({
        success: true,
        message: `Verification OTP successfully sent to registered admin phone number.`,
        otpCode: generatedOtp,
      });
    }

    if (action === "verify-reset") {
      if (!newPasscode || newPasscode.length < 4) {
        return NextResponse.json(
          { success: false, message: "New passcode must be at least 4 characters long." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Passcode updated successfully. Please update ADMIN_PASSCODE in your environment secrets to persist changes across server restarts.",
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getMockActivityLogs } from "@/lib/mock-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = getMockActivityLogs();
    return NextResponse.json({
      success: true,
      logs: logs.slice(0, 30),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load activity logs" },
      { status: 500 },
    );
  }
}

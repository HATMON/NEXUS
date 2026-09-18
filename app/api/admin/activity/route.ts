import { NextRequest, NextResponse } from "next/server";
import { getMockActivityLogs } from "@/lib/mock-store";

import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {\n  const auth = requireAdmin(request);\n  if (auth.response) return auth.response;
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

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getMockOrders } from "@/lib/mock-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;
  try {
    const db = await connectToDatabase();

    if (db) {
      const count = await Order.countDocuments();

      const latestOrder = await Order.findOne()
        .sort({ createdAt: -1 })
        .select(
          "orderNumber trackingCode status total createdAt",
        )
        .lean();

      return NextResponse.json({
        success: true,
        count,
        latestOrder,
      });
    }

    const mockOrders = getMockOrders();
    return NextResponse.json({
      success: true,
      count: mockOrders.length,
      latestOrder: mockOrders[0] ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to read orders.",
      },
      {
        status: 500,
      },
    );
  }
}

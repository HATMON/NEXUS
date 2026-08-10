import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getMockOrders } from "@/lib/mock-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
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

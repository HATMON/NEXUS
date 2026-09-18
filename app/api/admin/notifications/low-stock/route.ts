import { NextRequest, NextResponse } from "next/server";
import { getMockProducts, getMockStockAlerts, triggerLowStockEmail } from "@/lib/mock-store";

import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;
  try {
    const products = getMockProducts();
    const lowStockProducts = products.filter((p) => p.stock <= p.lowStockLevel);
    const alerts = getMockStockAlerts();

    return NextResponse.json({
      success: true,
      lowStockProducts,
      recentAlerts: alerts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load low stock alerts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    const { productId, recipientEmail } = body;

    const products = getMockProducts();
    const prod = products.find((p) => p._id === productId);

    if (!prod) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    const alert = triggerLowStockEmail(prod, recipientEmail || "inventory-alerts@ecovolt.co.ke");

    return NextResponse.json({
      success: true,
      alert,
      message: `Low stock email alert dispatched for '${prod.name}' to ${alert.recipient}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to dispatch email alert" },
      { status: 500 },
    );
  }
}

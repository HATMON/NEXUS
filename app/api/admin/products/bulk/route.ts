import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import {
  updateMockProduct,
  addMockActivityLog,
  getMockProducts,
  triggerLowStockEmail,
} from "@/lib/mock-store";

import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {\n  const auth = requireAdmin(request);\n  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    const { productIds, action, stockValue, activeValue, lowStockValue } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "No products selected for bulk operation." },
        { status: 400 },
      );
    }

    const updates: Record<string, any> = {};

    if (action === "update-stock" && stockValue !== undefined) {
      updates.stock = Number(stockValue);
    } else if (action === "set-active" && activeValue !== undefined) {
      updates.active = Boolean(activeValue);
    } else if (action === "update-low-stock" && lowStockValue !== undefined) {
      updates.lowStockLevel = Number(lowStockValue);
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid bulk action specification." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    let updatedCount = 0;

    if (db) {
      const res = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: updates },
      );
      updatedCount = res.modifiedCount;
    } else {
      productIds.forEach((id: string) => {
        const res = updateMockProduct(id, updates, "Admin Bulk Action");
        if (res) updatedCount++;
      });
    }

    // Log the bulk activity
    const desc =
      action === "update-stock"
        ? `Set stock to ${stockValue} for ${updatedCount} products`
        : action === "set-active"
        ? `Updated status to ${activeValue ? "Active" : "Disabled"} for ${updatedCount} products`
        : `Set low stock threshold to ${lowStockValue} for ${updatedCount} products`;

    addMockActivityLog({
      action: "Bulk Product Update",
      entityType: "product",
      details: desc,
      performedBy: "Admin User",
    });

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Successfully updated ${updatedCount} products.`,
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Bulk update failed.",
      },
      { status: 500 },
    );
  }
}

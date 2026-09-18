import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import {
  getMockProducts,
  addMockProduct,
  updateMockProduct,
  deleteMockProduct,
} from "@/lib/mock-store";

import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;
  try {
    const db = await connectToDatabase();
    if (db) {
      const dbProducts = await Product.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({
        success: true,
        count: dbProducts.length,
        products: dbProducts,
      });
    }

    const mockProducts = getMockProducts();
    return NextResponse.json({
      success: true,
      count: mockProducts.length,
      products: mockProducts,
    });
  } catch (error) {
    console.warn("GET products error, using mock:", error);
    const mockProducts = getMockProducts();
    return NextResponse.json({
      success: true,
      count: mockProducts.length,
      products: mockProducts,
    });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      category,
      brand,
      price,
      compareAtPrice,
      stock,
      lowStockLevel,
      images,
      featured,
      active,
    } = body;

    if (!name || !price || !sku || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required product fields." },
        { status: 400 },
      );
    }

    const productData = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku,
      description: description || "",
      shortDescription: shortDescription || "",
      category,
      brand: brand || "",
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      stock: Number(stock || 0),
      lowStockLevel: Number(lowStockLevel || 5),
      images: Array.isArray(images) ? images : [],
      featured: Boolean(featured),
      active: active !== undefined ? Boolean(active) : true,
    };

    const db = await connectToDatabase();
    if (db) {
      const newProd = await Product.create(productData);
      return NextResponse.json(
        { success: true, product: newProd },
        { status: 201 },
      );
    }

    const mockProd = addMockProduct(productData);
    return NextResponse.json(
      { success: true, product: mockProd },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST product error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unable to save product.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    const { productId, ...updates } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    if (db) {
      const updated = await Product.findByIdAndUpdate(productId, updates, {
        new: true,
      });
      if (updated) {
        return NextResponse.json({ success: true, product: updated });
      }
    }

    const updatedMock = updateMockProduct(productId, updates);
    if (!updatedMock) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, product: updatedMock });
  } catch (error) {
    console.error("PATCH product error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update product.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    if (db) {
      await Product.findByIdAndDelete(productId);
      return NextResponse.json({ success: true });
    }

    deleteMockProduct(productId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete product.",
      },
      { status: 500 },
    );
  }
}

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalisePhone(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (/^0[17]\d{8}$/.test(cleaned)) {
    return `254${cleaned.slice(1)}`;
  }

  if (/^\+254[17]\d{8}$/.test(cleaned)) {
    return cleaned.slice(1);
  }

  if (/^254[17]\d{8}$/.test(cleaned)) {
    return cleaned;
  }

  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      reference?: string;
      phone?: string;
    };

    const reference =
      body.reference?.trim().toUpperCase() ?? "";

    const phone = normalisePhone(
      body.phone?.trim() ?? "",
    );

    if (!reference || !phone) {
      return NextResponse.json(
        {
          error:
            "Enter the order number or tracking code and phone number.",
        },
        {
          status: 400,
        },
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const order = await Order.findOne({
        "customer.phone": phone,

        $or: [
          {
            orderNumber: reference,
          },
          {
            trackingCode: reference,
          },
        ],
      })
        .select(
          [
            "orderNumber",
            "trackingCode",
            "customer.firstName",
            "delivery.county",
            "delivery.town",
            "delivery.method",
            "payment.method",
            "payment.status",
            "items.name",
            "items.quantity",
            "items.total",
            "subtotal",
            "deliveryFee",
            "total",
            "currency",
            "status",
            "estimatedDelivery",
            "trackingHistory",
            "createdAt",
            "updatedAt",
          ].join(" "),
        )
        .lean();

      if (order) {
        return NextResponse.json({
          success: true,
          order,
        });
      }
    }

    const { findMockOrder } = await import("@/lib/mock-store");
    const mockOrder = findMockOrder(reference, phone);

    if (!mockOrder) {
      return NextResponse.json(
        {
          error:
            "No matching order was found. Check the order reference and phone number.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      order: mockOrder,
    });
  } catch (error) {
    console.error("Order tracking error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve the order.",
      },
      {
        status: 500,
      },
    );
  }
}
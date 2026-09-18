import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Order, {
  ORDER_STATUSES,
} from "@/models/Order";

import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderStatus =
  (typeof ORDER_STATUSES)[number];

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

const paymentStatuses: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const statusMessages: Record<OrderStatus, string> = {
  "pending-payment":
    "Your order has been received and is awaiting payment confirmation.",

  "payment-confirmed":
    "Payment has been confirmed successfully.",

  processing:
    "Your order is being prepared.",

  "ready-for-dispatch":
    "Your order has been prepared and is ready for dispatch.",

  dispatched:
    "Your order has been dispatched.",

  "out-for-delivery":
    "Your order is out for delivery.",

  delivered:
    "Your order has been delivered successfully.",

  cancelled:
    "Your order has been cancelled.",
};

export async function GET(request: NextRequest) {\n  const auth = requireAdmin(request);\n  if (auth.response) return auth.response;
  try {
    const db = await connectToDatabase();

    if (db) {
      const orders = await Order.find()
        .sort({
          createdAt: -1,
        })
        .lean();

      return NextResponse.json({
        success: true,
        count: orders.length,
        orders,
      });
    }

    const { getMockOrders } = await import("@/lib/mock-store");
    const mockOrders = getMockOrders();

    return NextResponse.json({
      success: true,
      count: mockOrders.length,
      orders: mockOrders,
    });
  } catch (error) {
    console.warn("Admin orders error, using mock:", error);

    const { getMockOrders } = await import("@/lib/mock-store");
    const mockOrders = getMockOrders();

    return NextResponse.json({
      success: true,
      count: mockOrders.length,
      orders: mockOrders,
    });
  }
}

export async function PATCH(\n  request: NextRequest,\n) {\n  const auth = requireAdmin(request);\n  if (auth.response) return auth.response;
  try {
    const body = (await request.json()) as {
      orderId?: string;
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      paymentReference?: string;
      message?: string;
      location?: string;
    };

    const orderId = body.orderId?.trim() ?? "";

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Order ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.status &&
      !ORDER_STATUSES.includes(body.status)
    ) {
      return NextResponse.json(
        {
          error: "Invalid order status.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.paymentStatus &&
      !paymentStatuses.includes(
        body.paymentStatus,
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid payment status.",
        },
        {
          status: 400,
        },
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const order = await Order.findById(orderId);

      if (order) {
        const previousStatus = order.status;

        if (!order.payment) {
          order.payment = {
            method: "mpesa",
            status: "pending",
            reference: "",
          };
        }

        if (body.paymentStatus) {
          order.payment.status = body.paymentStatus;
        }

        if (body.paymentReference !== undefined) {
          order.payment.reference =
            body.paymentReference.trim();
        }

        if (
          body.status &&
          body.status !== previousStatus
        ) {
          order.status = body.status;

          order.trackingHistory.push({
            status: body.status,

            message:
              body.message?.trim() ||
              statusMessages[body.status],

            location:
              body.location?.trim() ||
              "EcoVolt Nexus",

            date: new Date(),
          });

          if (body.status === "payment-confirmed") {
            order.payment.status = "paid";
          }

          if (body.status === "delivered") {
            order.estimatedDelivery = new Date();
          }
        }

        await order.save();

        return NextResponse.json({
          success: true,
          message: "Order updated successfully.",
          order,
        });
      }
    }

    const { getMockOrders, updateMockOrder } = await import("@/lib/mock-store");
    const mockOrders = getMockOrders();
    const existingMock = mockOrders.find((ord) => ord._id === orderId);

    if (!existingMock) {
      return NextResponse.json(
        {
          error: "Order not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updates: Record<string, unknown> = {};
    const trackingHistory = [...existingMock.trackingHistory];

    if (body.paymentStatus) {
      updates.payment = {
        ...existingMock.payment,
        status: body.paymentStatus,
      };
    }

    if (body.paymentReference !== undefined) {
      updates.payment = {
        ...(updates.payment as typeof existingMock.payment || existingMock.payment),
        reference: body.paymentReference.trim(),
      };
    }

    if (body.status && body.status !== existingMock.status) {
      updates.status = body.status;
      trackingHistory.push({
        status: body.status,
        message: body.message?.trim() || statusMessages[body.status],
        location: body.location?.trim() || "EcoVolt Nexus",
        date: new Date().toISOString(),
      });
      updates.trackingHistory = trackingHistory;

      if (body.status === "payment-confirmed") {
        updates.payment = {
          ...(updates.payment as typeof existingMock.payment || existingMock.payment),
          status: "paid",
        };
      }

      if (body.status === "delivered") {
        updates.estimatedDelivery = new Date().toISOString();
      }
    }

    const updatedMock = updateMockOrder(orderId, updates);

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
      order: updatedMock,
    });
  } catch (error) {
    console.error(
      "Admin order update error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update the order.",
      },
      {
        status: 500,
      },
    );
  }
}
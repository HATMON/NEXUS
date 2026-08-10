import crypto from "node:crypto";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { products } from "@/lib/products";
import Order from "@/models/Order";

export const runtime = "nodejs";

type IncomingItem = {
  slug: string;
  quantity: number;
};

type DeliveryMethod =
  | "standard"
  | "express"
  | "pickup";

type PaymentMethod =
  | "mpesa"
  | "card"
  | "bank-transfer";

type OrderPayload = {
  customer?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };

  delivery?: {
    county?: string;
    town?: string;
    address?: string;
    notes?: string;
    method?: DeliveryMethod;
  };

  paymentMethod?: PaymentMethod;
  items?: IncomingItem[];
};

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

function validPhone(phone: string) {
  return /^254[17]\d{8}$/.test(phone);
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateOrderNumber() {
  const now = new Date();

  const date = [
    now.getFullYear().toString().slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const random = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();

  return `EVN-${date}-${random}`;
}

function generateTrackingCode() {
  return `TRK-${crypto
    .randomBytes(5)
    .toString("hex")
    .toUpperCase()}`;
}

function calculateDeliveryFee(
  county: string,
  method: DeliveryMethod,
) {
  if (method === "pickup") {
    return 0;
  }

  const isNairobi =
    county.trim().toLowerCase() === "nairobi";

  if (method === "express") {
    return isNairobi ? 1000 : 1800;
  }

  return isNairobi ? 500 : 1000;
}

function estimatedDeliveryDate(
  method: DeliveryMethod,
) {
  if (method === "pickup") {
    return null;
  }

  const date = new Date();

  date.setDate(
    date.getDate() +
      (method === "express" ? 2 : 5),
  );

  return date;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderPayload;

    const firstName =
      body.customer?.firstName?.trim() ?? "";

    const lastName =
      body.customer?.lastName?.trim() ?? "";

    const email =
      body.customer?.email?.trim().toLowerCase() ??
      "";

    const phone = normalisePhone(
      body.customer?.phone?.trim() ?? "",
    );

    if (!firstName || !lastName) {
      return NextResponse.json(
        {
          error: "Enter the customer's full name.",
        },
        {
          status: 400,
        },
      );
    }

    if (!validPhone(phone)) {
      return NextResponse.json(
        {
          error:
            "Enter a valid Kenyan mobile phone number.",
        },
        {
          status: 400,
        },
      );
    }

    if (!validEmail(email)) {
      return NextResponse.json(
        {
          error: "Enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    const county =
      body.delivery?.county?.trim() ?? "";

    const town =
      body.delivery?.town?.trim() ?? "";

    const address =
      body.delivery?.address?.trim() ?? "";

    const notes =
      body.delivery?.notes?.trim() ?? "";

    const deliveryMethod = body.delivery?.method;

    const allowedDeliveryMethods: DeliveryMethod[] =
      ["standard", "express", "pickup"];

    if (!county || !town || !address) {
      return NextResponse.json(
        {
          error: "Complete the delivery information.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !deliveryMethod ||
      !allowedDeliveryMethods.includes(
        deliveryMethod,
      )
    ) {
      return NextResponse.json(
        {
          error: "Select a valid delivery method.",
        },
        {
          status: 400,
        },
      );
    }

    const paymentMethod = body.paymentMethod;

    const allowedPaymentMethods: PaymentMethod[] =
      ["mpesa", "card", "bank-transfer"];

    if (
      !paymentMethod ||
      !allowedPaymentMethods.includes(paymentMethod)
    ) {
      return NextResponse.json(
        {
          error: "Select a valid payment method.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "The cart is empty.",
        },
        {
          status: 400,
        },
      );
    }

    const orderItems = body.items.map((item) => {
      const product = products.find(
        (candidate) => candidate.slug === item.slug,
      );

      if (!product) {
        throw new Error(
          `Product not found: ${item.slug}`,
        );
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        throw new Error(
          `Invalid quantity for ${product.name}.`,
        );
      }

      return {
        slug: product.slug,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    const deliveryFee = calculateDeliveryFee(
      county,
      deliveryMethod,
    );

    const total = subtotal + deliveryFee;

    const orderPayload = {
      orderNumber: generateOrderNumber(),
      trackingCode: generateTrackingCode(),

      customer: {
        firstName,
        lastName,
        phone,
        email,
      },

      delivery: {
        county,
        town,
        address,
        notes,
        method: deliveryMethod,
        fee: deliveryFee,
      },

      payment: {
        method: paymentMethod,
        status: "pending" as const,
        reference: "",
      },

      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      currency: "KES",
      status: "pending-payment" as const,

      estimatedDelivery:
        estimatedDeliveryDate(deliveryMethod),

      trackingHistory: [
        {
          status: "pending-payment",
          message:
            "Your order has been received and is awaiting payment confirmation.",
          location: "EcoVolt Nexus",
          date: new Date(),
        },
      ],
    };

    const db = await connectToDatabase();
    if (db) {
      const order = await Order.create(orderPayload);
      return NextResponse.json(
        {
          success: true,
          orderNumber: order.orderNumber,
          trackingCode: order.trackingCode,
          status: order.status,
        },
        { status: 201 },
      );
    }

    const { addMockOrder } = await import("@/lib/mock-store");
    const mockOrder = addMockOrder({
      ...orderPayload,
      _id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        orderNumber: mockOrder.orderNumber,
        trackingCode: mockOrder.trackingCode,
        status: mockOrder.status,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create the order.",
      },
      {
        status: 500,
      },
    );
  }
}
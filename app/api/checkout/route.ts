import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPurchasableProducts } from "@/lib/catalog";

type IncomingItem = {
  slug: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      items?: IncomingItem[];
    };

    const items = body.items;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 },
      );
    }

    const lineItems = items.map((item) => {
      const product = products.find(
        (storedProduct) => storedProduct.slug === item.slug,
      );

      if (!product) {
        throw new Error(`Product not found: ${item.slug}`);
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > product.stock) {
        throw new Error(`Invalid quantity for ${product.name}`);
      }

      return {
        price_data: {
          currency: "kes",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin =
      req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      success_url: `${origin}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["KE"],
      },

      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        store: "EcoVolt Nexus",
        currency: "KES",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout session error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start checkout.",
      },
      { status: 500 },
    );
  }
}
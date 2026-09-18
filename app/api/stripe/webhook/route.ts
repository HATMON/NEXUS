import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { confirmOrderPayment } from "@/lib/order-payment";

export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  let event;
  try { event = stripe.webhooks.constructEvent(await req.text(), signature, secret); }
  catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const db = await connectToDatabase();
      if (!db) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
      const order: any = await Order.findById(orderId);
      if (order && order.payment.status !== "paid") {
        await confirmOrderPayment(String(order._id), String(session.payment_intent || session.id), "Card payment confirmed successfully.");
      }
    }
  }
  return NextResponse.json({ received: true });
}

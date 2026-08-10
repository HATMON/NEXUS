import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Don't throw at import time in dev without keys configured yet —
  // but the checkout route will fail loudly if this is actually called.
  console.warn("STRIPE_SECRET_KEY is not set. Checkout will not work until it is.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

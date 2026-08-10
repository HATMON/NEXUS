# EcoVolt — solar marketplace starter

Next.js 14 (App Router) + TypeScript + Tailwind + Zustand + Stripe Checkout.

## What's here

- `lib/products.ts` — product data. Static array for now; swap the function
  bodies for real database queries (Postgres/Supabase/etc.) when ready. This
  is the only file the rest of the app touches for product data, so the swap
  stays contained.
- `lib/cart-store.ts` — client-side cart state (Zustand, persisted to
  localStorage so the cart survives a refresh).
- `app/api/checkout/route.ts` — creates a Stripe Checkout Session server-side.
- `app/` — pages: catalog (`/`), product detail (`/product/[slug]`), cart
  (`/cart`), checkout (`/checkout`).

## Setup

```bash
npm install
cp .env.example .env.local
# fill in your Stripe test keys in .env.local
npm run dev
```

Get Stripe test keys at https://dashboard.stripe.com/test/apikeys — no real
charges happen with test keys, and Stripe gives you test card numbers
(4242 4242 4242 4242, any future date/CVC) to run through checkout.

## Known gaps to fill in before going live

- **Price tampering**: the checkout API route currently trusts the price sent
  from the client. Before launch, look up each item's real price from
  `lib/products.ts` server-side inside the route instead.
- **No real database**: products are a static array. Move to Postgres
  (Supabase or Neon are easy with Vercel) once you're past the prototype
  stage — you'll want this before you have real inventory to manage.
- **No accounts/order history**: add auth (Clerk or Auth.js) plus an `orders`
  table when you want repeat customers to see past purchases.
- **No webhook**: Stripe Checkout redirects on success, but for reliable
  order fulfillment (in case someone closes the tab mid-redirect) add a
  Stripe webhook listening for `checkout.session.completed` and write the
  order to your database there, not just on the client.
- **Shipping/tax**: currently flat — Stripe Tax or a shipping API (Shippo,
  EasyPost) can be added to the Checkout Session config in
  `app/api/checkout/route.ts`.

## Deploying

Push to GitHub, import into Vercel, add the same env vars from `.env.local`
in the Vercel project settings. Vercel auto-detects Next.js — no config
needed.

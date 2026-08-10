"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal, clear } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <section className="container py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl">
              🛒
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
              Your cart is empty
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              You have not added any solar products to your cart yet.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-xl bg-[#005b4f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#00483e]"
              >
                Browse Products
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700"
              >
                ← Return Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-emerald-700">
              Home
            </Link>

            <span>/</span>

            <span className="font-semibold text-slate-800">Cart</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review your products before proceeding to checkout.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1fr_120px_150px_90px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-600 md:grid">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
              <span className="text-right">Action</span>
            </div>

            <div>
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="grid gap-5 border-b border-slate-200 px-5 py-6 last:border-b-0 md:grid-cols-[1fr_120px_150px_90px] md:items-center md:px-6"
                >
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-base font-extrabold text-slate-900 hover:text-emerald-700"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-1 text-sm text-slate-500">
                      Unit price: {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center md:justify-center">
                    <button
                      type="button"
                      aria-label={`Reduce quantity of ${item.name}`}
                      onClick={() =>
                        setQuantity(item.slug, item.quantity - 1)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        setQuantity(
                          item.slug,
                          Number.parseInt(event.target.value, 10) || 0,
                        )
                      }
                      aria-label={`Quantity for ${item.name}`}
                      className="h-10 w-14 border-y border-slate-300 bg-white text-center text-sm font-bold text-slate-900 outline-none"
                    />

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() =>
                        setQuantity(item.slug, item.quantity + 1)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 md:hidden">
                      Total
                    </p>

                    <strong className="text-lg text-[#005b4f]">
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>

                  <div className="md:text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="text-sm font-bold text-red-500 transition hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700"
                >
                  ← Continue Shopping
                </Link>

                <Link
                  href="/"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700"
                >
                  Return Home
                </Link>
              </div>

              <button
                type="button"
                onClick={clear}
                className="rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subtotal</span>
                <strong className="text-slate-900">
                  {formatPrice(subtotal())}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className="text-slate-500">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Total</span>

                <strong className="text-2xl text-[#005b4f]">
                  {formatPrice(subtotal())}
                </strong>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block rounded-xl bg-[#005b4f] px-6 py-4 text-center text-sm font-extrabold text-white transition hover:bg-[#00483e]"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-4 text-center text-xs leading-6 text-slate-500">
              Delivery charges and payment details will be confirmed during
              checkout.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
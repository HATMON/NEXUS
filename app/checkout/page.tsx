"use client";

import Link from "next/link";
import {
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthStore } from "@/lib/auth-store";
import AuthModal from "@/components/auth/AuthModal";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

type PaymentMethod = "mpesa" | "card" | "bank-transfer";

type OrderResponse = {
  success?: boolean;
  orderNumber?: string;
  error?: string;
};

function CheckoutForm() {
  const searchParams = useSearchParams();
  const stripeSuccess = searchParams.get("success");

  const { items, subtotal, clear } = useCart();
  const { user, openAuthModal } = useAuthStore();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mpesa");

  const [county, setCounty] = useState(user?.county || "Nairobi");
  const [deliveryMethod, setDeliveryMethod] =
    useState("standard");

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState(
    user?.name ? user.name.split(" ")[0] : "",
  );
  const [lastName, setLastName] = useState(
    user?.name ? user.name.split(" ").slice(1).join(" ") : "",
  );
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [town, setTown] = useState(user?.town || "");
  const [address, setAddress] = useState(user?.address || "");

  useEffect(() => {
    if (user) {
      if (user.name) {
        const parts = user.name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
      if (user.county) setCounty(user.county);
      if (user.town) setTown(user.town);
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  useEffect(() => {
    if (stripeSuccess) {
      clear();
    }
  }, [stripeSuccess, clear]);

  const deliveryFee = useMemo(() => {
    if (deliveryMethod === "pickup") {
      return 0;
    }

    if (deliveryMethod === "express") {
      return county === "Nairobi" ? 1000 : 1800;
    }

    return county === "Nairobi" ? 500 : 1000;
  }, [county, deliveryMethod]);

  const cartSubtotal = subtotal();
  const orderTotal = cartSubtotal + deliveryFee;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === "card") {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              slug: item.slug,
              quantity: item.quantity,
            })),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to start card checkout.",
          );
        }

        if (!data.url) {
          throw new Error(
            "The payment checkout URL was not returned.",
          );
        }

        window.location.href = data.url;
        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName: String(
              formData.get("firstName") || "",
            ).trim(),
            lastName: String(
              formData.get("lastName") || "",
            ).trim(),
            phone: String(
              formData.get("phone") || "",
            ).trim(),
            email: String(
              formData.get("email") || "",
            ).trim(),
          },
          delivery: {
            county: String(
              formData.get("county") || "",
            ).trim(),
            town: String(
              formData.get("town") || "",
            ).trim(),
            address: String(
              formData.get("address") || "",
            ).trim(),
            notes: String(
              formData.get("notes") || "",
            ).trim(),
            method: deliveryMethod,
            fee: deliveryFee,
          },
          paymentMethod,
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as OrderResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to place your order.",
        );
      }

      setOrderNumber(data.orderNumber || "");
      setOrderPlaced(true);
      clear();
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to complete checkout.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (stripeSuccess || orderPlaced) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <section className="container py-20">
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
              ✓
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-emerald-700">
              Order Confirmed
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
              Thank you for your order
            </h1>

            {orderNumber && (
              <div className="mx-auto mt-5 max-w-sm rounded-xl bg-slate-100 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Order Number
                </p>

                <p className="mt-1 text-lg font-extrabold text-[#005b4f]">
                  {orderNumber}
                </p>
              </div>
            )}

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Your order has been received. EcoVolt Nexus
              will contact you to confirm payment and
              delivery details.
            </p>

            {paymentMethod === "mpesa" &&
              !stripeSuccess && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-left">
                  <p className="font-bold text-emerald-900">
                    M-Pesa payment
                  </p>

                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    Your order is awaiting payment. You will
                    receive M-Pesa payment instructions or an
                    STK push once M-Pesa integration is
                    activated.
                  </p>
                </div>
              )}

            {paymentMethod === "bank-transfer" &&
              !stripeSuccess && (
                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-left">
                  <p className="font-bold text-blue-900">
                    Bank transfer
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-800">
                    EcoVolt Nexus will send you the bank
                    account details and confirm your order
                    after payment is received.
                  </p>
                </div>
              )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-xl bg-[#005b4f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#00483e]"
              >
                Continue Shopping
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700"
              >
                Return Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <section className="container py-20">
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Your cart is empty
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Add products to your cart before proceeding to
              checkout.
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
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-700"
              >
                Return Home
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
            <Link
              href="/"
              className="hover:text-emerald-700"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/cart"
              className="hover:text-emerald-700"
            >
              Cart
            </Link>

            <span>/</span>

            <span className="font-semibold text-slate-800">
              Checkout
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your delivery and payment details to place
            your order.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="container grid gap-8 py-10 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          {/* User Account Login Banner */}
          {!user ? (
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[10px] text-white">⚡</span>
                  Have an EcoVolt Account?
                </p>
                <p className="mt-1 text-xs text-emerald-800">
                  Sign in with Google or OTP to auto-fill saved addresses & track your solar orders.
                </p>
              </div>

              <button
                type="button"
                onClick={openAuthModal}
                className="shrink-0 rounded-xl bg-[#005b4f] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#00483e] active:scale-[0.99]"
              >
                Log In / Register →
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-extrabold text-white text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Logged in as {user.name} ({user.email})
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Saved customer & delivery details auto-filled
                  </p>
                </div>
              </div>

              <a
                href="/account"
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Manage Profile
              </a>
            </div>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">
              Customer Details
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                First Name
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Last Name
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  autoComplete="tel"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Email Address
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">
              Delivery Address
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                County
                <select
                  name="county"
                  value={county}
                  onChange={(event) =>
                    setCounty(event.target.value)
                  }
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {counties.map((countyName) => (
                    <option
                      key={countyName}
                      value={countyName}
                    >
                      {countyName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Town / Area
                <input
                  type="text"
                  name="town"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="For example, Westlands"
                  autoComplete="address-level2"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Street, Building or Landmark
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, estate, building or nearby landmark"
                  autoComplete="street-address"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Order Notes
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Optional delivery or installation instructions"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">
              Delivery Method
            </h2>

            <div className="mt-5 space-y-3">
              {[
                {
                  value: "standard",
                  title: "Standard Delivery",
                  description:
                    "Normal delivery within the estimated timeframe.",
                  price:
                    county === "Nairobi"
                      ? "KSh 500"
                      : "KSh 1,000",
                },
                {
                  value: "express",
                  title: "Express Delivery",
                  description:
                    "Priority delivery for urgent orders.",
                  price:
                    county === "Nairobi"
                      ? "KSh 1,000"
                      : "KSh 1,800",
                },
                {
                  value: "pickup",
                  title: "Store Pickup",
                  description:
                    "Collect your order from the EcoVolt Nexus store.",
                  price: "Free",
                },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition ${
                    deliveryMethod === method.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {method.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {method.description}
                    </p>

                    <p className="mt-2 text-sm font-extrabold text-[#005b4f]">
                      {method.price}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={method.value}
                    checked={
                      deliveryMethod === method.value
                    }
                    onChange={(event) =>
                      setDeliveryMethod(event.target.value)
                    }
                    className="mt-1 h-4 w-4 accent-emerald-600"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">
              Payment Method
            </h2>

            <div className="mt-5 space-y-3">
              {[
                {
                  value: "mpesa" as PaymentMethod,
                  title: "M-Pesa",
                  description:
                    "Pay using your Safaricom M-Pesa number.",
                },
                {
                  value: "card" as PaymentMethod,
                  title: "Card Payment",
                  description:
                    "Pay securely using a debit or credit card.",
                },
                {
                  value: "bank-transfer" as PaymentMethod,
                  title: "Bank Transfer",
                  description:
                    "Receive bank payment instructions after placing your order.",
                },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === method.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {method.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {method.description}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={
                      paymentMethod === method.value
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target
                          .value as PaymentMethod,
                      )
                    }
                    className="mt-1 h-4 w-4 accent-emerald-600"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <h2 className="text-xl font-extrabold text-slate-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-5">
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <strong className="shrink-0 text-sm text-[#005b4f]">
                  {formatPrice(
                    item.price * item.quantity,
                  )}
                </strong>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Subtotal
              </span>

              <strong className="text-slate-900">
                {formatPrice(cartSubtotal)}
              </strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Delivery
              </span>

              <strong className="text-slate-900">
                {deliveryFee === 0
                  ? "Free"
                  : formatPrice(deliveryFee)}
              </strong>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-slate-900">
                Total
              </span>

              <strong className="text-2xl text-[#005b4f]">
                {formatPrice(orderTotal)}
              </strong>
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#005b4f] px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#00483e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : paymentMethod === "card"
                ? "Continue to Card Payment"
                : paymentMethod === "mpesa"
                  ? "Place Order with M-Pesa"
                  : "Place Order"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            By placing your order, you confirm that the
            information provided is accurate.
          </p>

          <Link
            href="/cart"
            className="mt-4 block text-center text-sm font-bold text-slate-600 transition hover:text-emerald-700"
          >
            ← Return to Cart
          </Link>
        </aside>
      </form>
      <AuthModal />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-sm text-slate-500">
          Loading checkout...
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
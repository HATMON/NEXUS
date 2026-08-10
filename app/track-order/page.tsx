"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type OrderStatus =
  | "pending-payment"
  | "payment-confirmed"
  | "processing"
  | "ready-for-dispatch"
  | "dispatched"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

type TrackingHistoryItem = {
  status: OrderStatus;
  message: string;
  location?: string;
  date: string;
};

type TrackedOrder = {
  orderNumber: string;
  trackingCode: string;

  customer: {
    firstName: string;
  };

  delivery: {
    county: string;
    town: string;
    method: string;
  };

  payment: {
    method: string;
    status: string;
  };

  items: Array<{
    name: string;
    quantity: number;
    total: number;
  }>;

  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  status: OrderStatus;
  estimatedDelivery?: string | null;
  trackingHistory: TrackingHistoryItem[];
  createdAt: string;
};

const statusSteps: Array<{
  value: OrderStatus;
  label: string;
}> = [
  {
    value: "pending-payment",
    label: "Pending Payment",
  },
  {
    value: "payment-confirmed",
    label: "Payment Confirmed",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "ready-for-dispatch",
    label: "Ready for Dispatch",
  },
  {
    value: "dispatched",
    label: "Dispatched",
  },
  {
    value: "out-for-delivery",
    label: "Out for Delivery",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
];

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getStatusLabel(status: OrderStatus) {
  if (status === "cancelled") {
    return "Cancelled";
  }

  return (
    statusSteps.find((step) => step.value === status)
      ?.label ?? status
  );
}

function getDeliveryMethodLabel(method: string) {
  if (method === "pickup") {
    return "Store Pickup";
  }

  if (method === "express") {
    return "Express Delivery";
  }

  return "Standard Delivery";
}

function getPaymentMethodLabel(method: string) {
  if (method === "mpesa") {
    return "M-Pesa";
  }

  if (method === "bank-transfer") {
    return "Bank Transfer";
  }

  if (method === "card") {
    return "Card";
  }

  return method;
}

export default function TrackOrderPage() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] =
    useState<TrackedOrder | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(
        "/api/orders/track",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference,
            phone,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to track the order.",
        );
      }

      setOrder(data.order);
    } catch (trackingError) {
      setError(
        trackingError instanceof Error
          ? trackingError.message
          : "Unable to track the order.",
      );
    } finally {
      setLoading(false);
    }
  }

  const activeStepIndex = order
    ? statusSteps.findIndex(
        (step) => step.value === order.status,
      )
    : -1;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/"
              className="hover:text-emerald-700"
            >
              Home
            </Link>

            <span>/</span>

            <span className="font-semibold text-slate-800">
              Track Order
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
            Track Your Order
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Enter your order number or tracking code together
            with the phone number used during checkout.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Order Number or Tracking Code

                <input
                  type="text"
                  value={reference}
                  onChange={(event) =>
                    setReference(event.target.value)
                  }
                  placeholder="EVN-260730-251F13"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 uppercase outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Phone Number

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="0712 345 678"
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>

            {error && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 rounded-xl bg-[#005b4f] px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#00483e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Finding Order..."
                : "Track Order"}
            </button>
          </form>

          {order && (
            <div className="mt-8 space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Order Number
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                      {order.orderNumber}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Tracking code:{" "}
                      <strong className="text-slate-800">
                        {order.trackingCode}
                      </strong>
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                      order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {order.customer.firstName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Destination
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {order.delivery.town},{" "}
                      {order.delivery.county}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Delivery
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {getDeliveryMethodLabel(
                        order.delivery.method,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Total
                    </p>

                    <p className="mt-1 font-extrabold text-[#005b4f]">
                      {formatMoney(order.total)}
                    </p>
                  </div>
                </div>

                {order.estimatedDelivery && (
                  <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-500">
                      Estimated delivery:{" "}
                      <strong className="text-slate-800">
                        {formatDate(
                          order.estimatedDelivery,
                        )}
                      </strong>
                    </p>
                  </div>
                )}
              </section>

              {order.status !== "cancelled" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Delivery Progress
                  </h2>

                  <div className="mt-8 space-y-0">
                    {statusSteps.map((step, index) => {
                      const isCompleted =
                        index <= activeStepIndex;

                      const isCurrent =
                        index === activeStepIndex;

                      return (
                        <div
                          key={step.value}
                          className="relative flex gap-4 pb-8 last:pb-0"
                        >
                          {index <
                            statusSteps.length - 1 && (
                            <div
                              className={`absolute left-[15px] top-8 h-full w-0.5 ${
                                index < activeStepIndex
                                  ? "bg-emerald-500"
                                  : "bg-slate-200"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                              isCompleted
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-slate-300 bg-white text-slate-400"
                            }`}
                          >
                            {isCompleted
                              ? "✓"
                              : index + 1}
                          </div>

                          <div className="pt-1">
                            <p
                              className={`font-bold ${
                                isCurrent
                                  ? "text-emerald-700"
                                  : isCompleted
                                    ? "text-slate-900"
                                    : "text-slate-400"
                              }`}
                            >
                              {step.label}
                            </p>

                            {isCurrent && (
                              <p className="mt-1 text-sm text-slate-500">
                                Current order status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Tracking Updates
                </h2>

                {order.trackingHistory.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    No tracking updates are available yet.
                  </p>
                ) : (
                  <div className="mt-6 space-y-5">
                    {[...order.trackingHistory]
                      .reverse()
                      .map((update, index) => (
                        <div
                          key={`${update.date}-${index}`}
                          className="border-l-2 border-emerald-500 pl-5"
                        >
                          <p className="font-bold text-slate-900">
                            {getStatusLabel(
                              update.status,
                            )}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {update.message}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                            <span>
                              {formatDate(update.date)}
                            </span>

                            {update.location && (
                              <span>
                                {update.location}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Order Items
                </h2>

                <div className="mt-5 divide-y divide-slate-100">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex justify-between gap-4 py-4 first:pt-0"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <strong className="text-[#005b4f]">
                        {formatMoney(item.total)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Subtotal
                    </span>

                    <strong>
                      {formatMoney(order.subtotal)}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Delivery
                    </span>

                    <strong>
                      {order.deliveryFee === 0
                        ? "Free"
                        : formatMoney(
                            order.deliveryFee,
                          )}
                    </strong>
                  </div>

                  <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                    <span className="font-bold text-slate-900">
                      Total
                    </span>

                    <strong className="text-[#005b4f]">
                      {formatMoney(order.total)}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Payment Information
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {getPaymentMethodLabel(
                        order.payment.method,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Payment Status
                    </p>

                    <p className="mt-1 font-semibold capitalize text-slate-800">
                      {order.payment.status}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type OrderStatus =
  | "pending-payment"
  | "payment-confirmed"
  | "processing"
  | "ready-for-dispatch"
  | "dispatched"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

type AdminOrder = {
  _id: string;
  orderNumber: string;
  trackingCode: string;

  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };

  delivery: {
    county: string;
    town: string;
    address: string;
    notes?: string;
    method: string;
    fee: number;
  };

  payment: {
    method: string;
    status: PaymentStatus;
    reference?: string;
  };

  items: Array<{
    slug: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;

  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

const orderStatuses: Array<{
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
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

const paymentStatuses: Array<{
  value: PaymentStatus;
  label: string;
}> = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "failed",
    label: "Failed",
  },
  {
    value: "refunded",
    label: "Refunded",
  },
];

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "KES",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("KSh", "KSh ");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getStatusLabel(status: OrderStatus) {
  return (
    orderStatuses.find(
      (candidate) => candidate.value === status,
    )?.label ?? status
  );
}

function getPaymentMethod(method: string) {
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

function getStatusClasses(status: OrderStatus) {
  if (status === "delivered") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "cancelled") {
    return "bg-red-100 text-red-700";
  }

  if (
    status === "dispatched" ||
    status === "out-for-delivery"
  ) {
    return "bg-blue-100 text-blue-700";
  }

  if (
    status === "processing" ||
    status === "ready-for-dispatch"
  ) {
    return "bg-violet-100 text-violet-700";
  }

  return "bg-amber-100 text-amber-800";
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAdminAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<
    AdminOrder[]
  >([]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAdminAuthenticated, router]);

  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [newStatus, setNewStatus] =
    useState<OrderStatus>("pending-payment");

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("pending");

  const [paymentReference, setPaymentReference] =
    useState("");

  const [trackingMessage, setTrackingMessage] =
    useState("");

  const [trackingLocation, setTrackingLocation] =
    useState("EcoVolt Nexus");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/admin/orders",
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load orders.",
        );
      }

      setOrders(data.orders || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!selectedOrder) {
      return;
    }

    setNewStatus(selectedOrder.status);
    setPaymentStatus(
      selectedOrder.payment.status,
    );

    setPaymentReference(
      selectedOrder.payment.reference || "",
    );

    setTrackingMessage("");
    setTrackingLocation("EcoVolt Nexus");
    setSuccess(null);
    setError(null);
  }, [selectedOrder]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        order.status === statusFilter;

      const matchesSearch =
        !query ||
        order.orderNumber
          .toLowerCase()
          .includes(query) ||
        order.trackingCode
          .toLowerCase()
          .includes(query) ||
        order.customer.firstName
          .toLowerCase()
          .includes(query) ||
        order.customer.lastName
          .toLowerCase()
          .includes(query) ||
        order.customer.phone.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter(
        (order) =>
          order.payment.status === "paid",
      )
      .reduce(
        (sum, order) => sum + order.total,
        0,
      );
  }, [orders]);

  const pendingOrders = orders.filter(
    (order) =>
      order.status !== "delivered" &&
      order.status !== "cancelled",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  async function updateOrder() {
    if (!selectedOrder) {
      return;
    }

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "/api/admin/orders",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: selectedOrder._id,
            status: newStatus,
            paymentStatus,
            paymentReference,
            message: trackingMessage,
            location: trackingLocation,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update order.",
        );
      }

      const updatedOrder =
        data.order as AdminOrder;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === updatedOrder._id
            ? updatedOrder
            : order,
        ),
      );

      setSelectedOrder(updatedOrder);

      setSuccess(
        "Order updated successfully. The tracking page now shows the new information.",
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update order.",
      );
    } finally {
      setUpdating(false);
    }
  }

  function handleExportCSV() {
    if (!orders || orders.length === 0) return;

    const headers = [
      "Order Number",
      "Tracking Code",
      "Customer First Name",
      "Customer Last Name",
      "Phone",
      "Email",
      "County",
      "Town",
      "Delivery Address",
      "Payment Method",
      "Payment Status",
      "Payment Reference",
      "Items",
      "Subtotal (KES)",
      "Delivery Fee (KES)",
      "Total (KES)",
      "Order Status",
      "Created Date",
    ];

    const rows = filteredOrders.map((ord) => [
      `"${ord.orderNumber}"`,
      `"${ord.trackingCode}"`,
      `"${(ord.customer.firstName || "").replace(/"/g, '""')}"`,
      `"${(ord.customer.lastName || "").replace(/"/g, '""')}"`,
      `"${ord.customer.phone}"`,
      `"${ord.customer.email}"`,
      `"${ord.delivery.county}"`,
      `"${ord.delivery.town}"`,
      `"${(ord.delivery.address || "").replace(/"/g, '""')}"`,
      `"${ord.payment.method}"`,
      `"${ord.payment.status}"`,
      `"${ord.payment.reference || ""}"`,
      `"${ord.items.map((i) => `${i.name} (x${i.quantity})`).join("; ")}"`,
      ord.subtotal,
      ord.deliveryFee,
      ord.total,
      `"${ord.status}"`,
      `"${new Date(ord.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ecovolt_orders_export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="container py-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                EcoVolt Admin
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                Orders
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                View orders, confirm payments and
                update delivery progress.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                className="rounded-xl border border-emerald-500 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 flex items-center gap-2"
              >
                <span>📥</span> Export Orders (CSV)
              </button>

              <button
                type="button"
                onClick={() => void loadOrders()}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
              >
                Refresh Orders
              </button>

              <Link
                href="/"
                className="rounded-xl bg-[#005b4f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00483e]"
              >
                View Store
              </Link>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Link
              href="/admin"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              Overview
            </Link>

            <Link
              href="/admin/orders"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-sm"
            >
              Orders ({orders.length})
            </Link>

            <Link
              href="/admin/products"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              Products
            </Link>
          </nav>
        </div>
      </header>

      <section className="container py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total Orders
            </p>

            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Active Orders
            </p>

            <p className="mt-3 text-3xl font-extrabold text-amber-700">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Delivered
            </p>

            <p className="mt-3 text-3xl font-extrabold text-emerald-700">
              {deliveredOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Paid Revenue
            </p>

            <p className="mt-3 text-2xl font-extrabold text-[#005b4f]">
              {formatMoney(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_430px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search order, customer or phone"
                  className="h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value,
                    )
                  }
                  className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="all">
                    All Statuses
                  </option>

                  {orderStatuses.map((status) => (
                    <option
                      key={status.value}
                      value={status.value}
                    >
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm font-semibold text-slate-500">
                Loading orders...
              </div>
            ) : error && orders.length === 0 ? (
              <div className="p-10 text-center text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-10 text-center text-sm font-semibold text-slate-500">
                No matching orders were found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <button
                    key={order._id}
                    type="button"
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                    className={`block w-full p-5 text-left transition hover:bg-slate-50 ${
                      selectedOrder?._id ===
                      order._id
                        ? "bg-emerald-50"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-extrabold text-slate-900">
                            {order.orderNumber}
                          </p>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                              order.status,
                            )}`}
                          >
                            {getStatusLabel(
                              order.status,
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-700">
                          {
                            order.customer
                              .firstName
                          }{" "}
                          {order.customer.lastName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.customer.phone} ·{" "}
                          {formatDate(
                            order.createdAt,
                          )}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <p className="font-extrabold text-[#005b4f]">
                          {formatMoney(order.total)}
                        </p>

                        <p className="mt-1 text-xs font-semibold capitalize text-slate-500">
                          {getPaymentMethod(
                            order.payment.method,
                          )}{" "}
                          · {order.payment.status}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6">
            {!selectedOrder ? (
              <div className="py-14 text-center">
                <p className="text-lg font-extrabold text-slate-900">
                  Select an order
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select an order from the list to
                  view and update its information.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Order
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                      {selectedOrder.orderNumber}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {
                        selectedOrder.trackingCode
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedOrder(null)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {
                        selectedOrder.customer
                          .firstName
                      }{" "}
                      {
                        selectedOrder.customer
                          .lastName
                      }
                    </p>

                    <p className="mt-1 text-slate-500">
                      {
                        selectedOrder.customer
                          .phone
                      }
                    </p>

                    <p className="text-slate-500">
                      {
                        selectedOrder.customer
                          .email
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Delivery Address
                    </p>

                    <p className="mt-1 font-semibold leading-6 text-slate-700">
                      {
                        selectedOrder.delivery
                          .address
                      }
                      ,{" "}
                      {
                        selectedOrder.delivery
                          .town
                      }
                      ,{" "}
                      {
                        selectedOrder.delivery
                          .county
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Order Total
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-[#005b4f]">
                      {formatMoney(
                        selectedOrder.total,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="block text-sm font-bold text-slate-700">
                    Order Status

                    <select
                      value={newStatus}
                      onChange={(event) =>
                        setNewStatus(
                          event.target
                            .value as OrderStatus,
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      {orderStatuses.map(
                        (status) => (
                          <option
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label className="block text-sm font-bold text-slate-700">
                    Payment Status

                    <select
                      value={paymentStatus}
                      onChange={(event) =>
                        setPaymentStatus(
                          event.target
                            .value as PaymentStatus,
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      {paymentStatuses.map(
                        (status) => (
                          <option
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label className="block text-sm font-bold text-slate-700">
                    Payment Reference

                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(event) =>
                        setPaymentReference(
                          event.target.value,
                        )
                      }
                      placeholder="M-Pesa or bank reference"
                      className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block text-sm font-bold text-slate-700">
                    Tracking Message

                    <textarea
                      value={trackingMessage}
                      onChange={(event) =>
                        setTrackingMessage(
                          event.target.value,
                        )
                      }
                      rows={3}
                      placeholder="Optional custom message"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block text-sm font-bold text-slate-700">
                    Current Location

                    <input
                      type="text"
                      value={trackingLocation}
                      onChange={(event) =>
                        setTrackingLocation(
                          event.target.value,
                        )
                      }
                      placeholder="EcoVolt Nexus"
                      className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </div>

                {error && (
                  <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-700">
                    {success}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    void updateOrder()
                  }
                  disabled={updating}
                  className="mt-6 w-full rounded-xl bg-[#005b4f] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#00483e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating
                    ? "Updating Order..."
                    : "Save Order Update"}
                </button>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import AuthModal from "@/components/auth/AuthModal";

type UserOrder = {
  _id: string;
  orderNumber: string;
  trackingCode: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number }>;
};

export default function AccountPage() {
  const { user, logout, updateProfile, openAuthModal } = useAuthStore();

  const [county, setCounty] = useState(user?.county || "Nairobi");
  const [town, setTown] = useState(user?.town || "Westlands");
  const [address, setAddress] = useState(user?.address || "");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      setCounty(user.county || "Nairobi");
      setTown(user.town || "Westlands");
      setAddress(user.address || "");
      setName(user.name || "");
      setPhone(user.phone || "");

      // Fetch user's orders by phone/email
      setLoadingOrders(true);
      fetch(`/api/admin/orders`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.orders)) {
            const matched = data.orders.filter(
              (o: { customer?: { phone?: string; email?: string } }) =>
                (user.phone && o.customer?.phone === user.phone) ||
                (user.email && o.customer?.email === user.email),
            );
            setUserOrders(matched);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      county,
      town,
      address,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 pb-24">
        <div className="container max-w-xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl text-emerald-700">
              👤
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
              Welcome to EcoVolt Customer Portal
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Log in or create an account to view your past solar orders, track deliveries in real time, and save default shipping details for 1-click checkout.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={openAuthModal}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] font-bold text-white transition hover:bg-[#00483e] active:scale-[0.99]"
              >
                Log In / Create Account with Google or OTP →
              </button>

              <Link
                href="/shop"
                className="block text-center text-xs font-bold text-slate-500 hover:text-slate-800 py-2"
              >
                Continue Browsing Products
              </Link>
            </div>
          </div>
        </div>
        <AuthModal />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-8">
      <div className="container space-y-8">
        {/* User Profile Banner */}
        <div className="rounded-3xl bg-[#003f36] p-6 text-white shadow-md md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 font-extrabold text-white text-2xl shadow">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold">{user.name}</h1>
                  <span className="rounded-full bg-emerald-700/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-100 uppercase tracking-wider">
                    {user.authProvider === "google" ? "Google Auth" : "Verified OTP"}
                  </span>
                </div>
                <p className="text-xs text-emerald-100">{user.email} • {user.phone}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-emerald-400/40 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 self-start md:self-auto"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Saved Delivery Info Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">
              Saved Delivery Address
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your default delivery details will auto-fill on checkout for rapid order placement.
            </p>

            {savedSuccess && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
                ✓ Saved address updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    County
                  </label>
                  <input
                    type="text"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Town / Area
                  </label>
                  <input
                    type="text"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Detailed Physical Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, building, apartment/house number..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#005b4f] text-sm font-bold text-white transition hover:bg-[#00483e]"
              >
                Save Shipping Profile
              </button>
            </form>
          </div>

          {/* User Orders History */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">
              My Solar Orders
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Orders associated with {user.phone || user.email}
            </p>

            {loadingOrders ? (
              <p className="mt-6 text-center text-sm text-slate-400">Loading orders...</p>
            ) : userOrders.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
                <p className="text-sm font-semibold text-slate-700">No orders found yet</p>
                <p className="mt-1 text-xs text-slate-500">
                  When you make a purchase, your tracked orders will appear here automatically.
                </p>
                <Link
                  href="/shop"
                  className="mt-4 inline-block rounded-xl bg-[#ffc400] px-4 py-2 text-xs font-bold text-black"
                >
                  Explore Solar Products
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {userOrders.map((ord) => (
                  <div
                    key={ord._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-emerald-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {ord.orderNumber}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        {ord.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      {ord.items?.map((i) => i.name).join(", ")}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs">
                      <span className="font-extrabold text-[#005b4f]">
                        KES {ord.total?.toLocaleString()}
                      </span>

                      <Link
                        href={`/track-order?reference=${ord.orderNumber}&phone=${user.phone}`}
                        className="font-bold text-emerald-700 hover:underline"
                      >
                        Track Shipment →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

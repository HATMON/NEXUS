"use client";

import { useState } from "react";
import { Ticket, Plus, Calendar, Tag, Percent, Users, Trash2, Check, AlertCircle } from "lucide-react";

type CouponCode = {
  id: string;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  minOrder: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
};

const initialCoupons: CouponCode[] = [
  {
    id: "coup-1",
    code: "SAVE500",
    type: "fixed",
    value: 500,
    minOrder: 10000,
    expiryDate: "2026-12-31",
    usageLimit: 100,
    timesUsed: 42,
    active: true,
  },
  {
    id: "coup-2",
    code: "SOLAR10",
    type: "percentage",
    value: 10,
    minOrder: 50000,
    expiryDate: "2026-08-31",
    usageLimit: 50,
    timesUsed: 19,
    active: true,
  },
  {
    id: "coup-3",
    code: "ECOKITS",
    type: "fixed",
    value: 2500,
    minOrder: 150000,
    expiryDate: "2026-09-15",
    usageLimit: 25,
    timesUsed: 8,
    active: true,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponCode[]>(initialCoupons);
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState("GREEN2026");
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
  const [val, setVal] = useState(1000);
  const [minOrd, setMinOrd] = useState(20000);
  const [expiry, setExpiry] = useState("2026-12-31");
  const [limit, setLimit] = useState(100);

  function handleCreateCoupon() {
    if (!newCode) return;
    const c: CouponCode = {
      id: `coup-${Date.now()}`,
      code: newCode.toUpperCase(),
      type: discountType,
      value: val,
      minOrder: minOrd,
      expiryDate: expiry,
      usageLimit: limit,
      timesUsed: 0,
      active: true,
    };
    setCoupons((prev) => [c, ...prev]);
    setShowModal(false);
  }

  function toggleCoupon(id: string) {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  }

  function deleteCoupon(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Ticket className="h-6 w-6 text-emerald-400" />
            <span>Coupons & Discount Promotions</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create checkout promo codes, limit usage quotas, set minimum cart totals & expiration dates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg shadow-emerald-950"
        >
          <Plus className="h-4 w-4" />
          <span>Create Promo Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`rounded-2xl border bg-slate-950 p-5 space-y-4 flex flex-col justify-between transition ${
              c.active ? "border-slate-800" : "border-slate-800 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-black text-lg text-emerald-400 tracking-wider bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-xl">
                  {c.code}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                    c.active
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : "bg-red-950 text-red-400 border-red-800"
                  }`}
                >
                  {c.active ? "Active" : "Disabled"}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <p className="text-white font-extrabold text-base">
                  Discount: {c.type === "fixed" ? `KES ${c.value.toLocaleString()} Off` : `${c.value}% Off Total`}
                </p>

                <p className="text-slate-400 text-xs font-medium">
                  Min. Cart Requirement: KES {c.minOrder.toLocaleString()}
                </p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Usage Quota:</span>
                    <span className="font-bold text-white">{c.timesUsed} / {c.usageLimit} customers</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (c.timesUsed / c.usageLimit) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1">Expiry Date: {c.expiryDate}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => toggleCoupon(c.id)}
                className="text-xs font-bold text-slate-300 hover:text-white"
              >
                {c.active ? "Deactivate Code" : "Activate Code"}
              </button>
              <button
                onClick={() => deleteCoupon(c.id)}
                className="p-2 rounded-lg bg-red-950/30 text-red-400 hover:bg-red-900/50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <h2 className="text-base font-extrabold text-white mb-4">Create New Promo Coupon</h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-mono font-bold tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white"
                  >
                    <option value="fixed">Fixed KES Off</option>
                    <option value="percentage">Percentage % Off</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Value</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => setVal(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Minimum Order Amount (KES)</label>
                <input
                  type="number"
                  value={minOrd}
                  onChange={(e) => setMinOrd(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Save & Enable Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, CheckCircle2, Clock, RefreshCw, Search, ShieldCheck } from "lucide-react";

type PaymentTransaction = {
  id: string;
  orderNumber: string;
  customerName: string;
  method: "M-Pesa STK Push" | "Stripe Card" | "Bank Wire Transfer";
  amount: number;
  reference: string;
  status: "Completed" | "Pending Approval" | "Failed" | "Refunded";
  timestamp: string;
  proofUrl?: string;
};

const mockTransactions: PaymentTransaction[] = [
  {
    id: "tx-1",
    orderNumber: "EVN-260730-A1B2C3",
    customerName: "Dr. Evans Kimani",
    method: "M-Pesa STK Push",
    amount: 163000,
    reference: "RKN7892341",
    status: "Completed",
    timestamp: "2026-07-30T14:22:00Z",
  },
  {
    id: "tx-2",
    orderNumber: "EVN-260728-K8J7H6",
    customerName: "Grace Wanjiku",
    method: "Stripe Card",
    amount: 195000,
    reference: "ch_3N8xYz2eZvKYLO2C0w",
    status: "Completed",
    timestamp: "2026-07-28T09:47:00Z",
  },
  {
    id: "tx-3",
    orderNumber: "EVN-260725-P5O4N3",
    customerName: "Peter Mwangi",
    method: "Bank Wire Transfer",
    amount: 125000,
    reference: "WIRE-KCB-9921",
    status: "Pending Approval",
    timestamp: "2026-07-25T16:15:00Z",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
  },
  {
    id: "tx-4",
    orderNumber: "EVN-260720-Q1W2E3",
    customerName: "Sarah Achieng",
    method: "M-Pesa STK Push",
    amount: 350000,
    reference: "RKP4451092",
    status: "Completed",
    timestamp: "2026-07-20T11:05:00Z",
  },
];

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(mockTransactions);
  const [search, setSearch] = useState("");
  const [selectedProof, setSelectedProof] = useState<PaymentTransaction | null>(null);

  function confirmPayment(id: string) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Completed" } : t)),
    );
    setSelectedProof(null);
  }

  function refundPayment(id: string) {
    if (confirm("Issue a full refund for this transaction?")) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "Refunded" } : t)),
      );
    }
  }

  const filtered = transactions.filter(
    (t) =>
      t.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.method.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-emerald-400" />
            <span>Payments Gateway & Reconciliation</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            M-Pesa C2B/STK Push validation, Stripe credit settlements, and Bank Wire manual approvals.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-2 rounded-xl flex items-center gap-1.5">
            <Smartphone className="h-4 w-4" /> M-Pesa Express Active
          </span>
          <span className="text-xs font-bold text-blue-400 bg-blue-950 border border-blue-800 px-3 py-2 rounded-xl flex items-center gap-1.5">
            <CreditCard className="h-4 w-4" /> Stripe Live
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order #, M-Pesa Code, Customer..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Order & Customer</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Reference Code</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Settlement Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-4">
                    <p className="font-mono font-extrabold text-emerald-400">{t.orderNumber}</p>
                    <p className="text-slate-400 font-bold mt-0.5">{t.customerName}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      {t.method.includes("M-Pesa") ? (
                        <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                      ) : t.method.includes("Stripe") ? (
                        <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                      ) : (
                        <Building2 className="h-3.5 w-3.5 text-purple-400" />
                      )}
                      {t.method}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-300 font-bold">{t.reference}</td>
                  <td className="p-4 font-black text-white text-sm">
                    KES {t.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {t.status === "Completed" ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        ✓ Settled
                      </span>
                    ) : t.status === "Pending Approval" ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                        ⏳ Verification Required
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                        ↩ {t.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {t.proofUrl && t.status === "Pending Approval" && (
                      <button
                        onClick={() => setSelectedProof(t)}
                        className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900 text-xs font-bold"
                      >
                        Review Bank Slip
                      </button>
                    )}

                    {t.status === "Completed" && (
                      <button
                        onClick={() => refundPayment(t.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 text-[11px] font-bold"
                      >
                        Issue Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <h2 className="text-base font-extrabold text-white mb-2">Verify Bank Transfer Proof</h2>
            <p className="text-xs text-slate-400 mb-4">
              Order: {selectedProof.orderNumber} · KES {selectedProof.amount.toLocaleString()}
            </p>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 mb-4 h-48">
              <img src={selectedProof.proofUrl} alt="Bank Slip" className="w-full h-full object-cover" />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedProof(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-400"
              >
                Reject & Flag
              </button>
              <button
                onClick={() => confirmPayment(selectedProof.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Approve Payment (Confirm Order)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

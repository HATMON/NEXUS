"use client";

import { useEffect, useState } from "react";
import { Users, Search, ShoppingBag, Phone, Mail, MapPin, DollarSign, Calendar } from "lucide-react";

type CustomerRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  county: string;
  town: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  orders: Array<{ orderNumber: string; total: number; status: string; date: string }>;
};

const mockCustomers: CustomerRecord[] = [
  {
    id: "cust-1",
    name: "Dr. Evans Kimani",
    phone: "+254 722 123 456",
    email: "evans.kimani@hospital.co.ke",
    county: "Nairobi",
    town: "Karen",
    totalSpent: 485000,
    ordersCount: 3,
    lastOrderDate: "2026-07-30T14:20:00Z",
    orders: [
      { orderNumber: "EVN-260730-A1B2C3", total: 163000, status: "processing", date: "2026-07-30" },
      { orderNumber: "EVN-260515-F4E3D2", total: 225000, status: "delivered", date: "2026-05-15" },
      { orderNumber: "EVN-260210-C9B8A7", total: 97000, status: "delivered", date: "2026-02-10" },
    ],
  },
  {
    id: "cust-2",
    name: "Grace Wanjiku",
    phone: "+254 711 987 654",
    email: "grace.wanjiku@farm.co.ke",
    county: "Nakuru",
    town: "Naivasha",
    totalSpent: 310000,
    ordersCount: 2,
    lastOrderDate: "2026-07-28T09:45:00Z",
    orders: [
      { orderNumber: "EVN-260728-K8J7H6", total: 195000, status: "delivered", date: "2026-07-28" },
      { orderNumber: "EVN-260401-M2L1K0", total: 115000, status: "delivered", date: "2026-04-01" },
    ],
  },
  {
    id: "cust-3",
    name: "Peter Mwangi",
    phone: "+254 733 456 789",
    email: "peter.mwangi@techsol.co.ke",
    county: "Kiambu",
    town: "Riru",
    totalSpent: 125000,
    ordersCount: 1,
    lastOrderDate: "2026-07-25T16:10:00Z",
    orders: [
      { orderNumber: "EVN-260725-P5O4N3", total: 125000, status: "dispatched", date: "2026-07-25" },
    ],
  },
  {
    id: "cust-4",
    name: "Sarah Achieng",
    phone: "+254 700 888 999",
    email: "sarah.achieng@resort.co.ke",
    county: "Mombasa",
    town: "Nyali",
    totalSpent: 720000,
    ordersCount: 4,
    lastOrderDate: "2026-07-20T11:00:00Z",
    orders: [
      { orderNumber: "EVN-260720-Q1W2E3", total: 350000, status: "delivered", date: "2026-07-20" },
      { orderNumber: "EVN-260610-R4T5Y6", total: 370000, status: "delivered", date: "2026-06-10" },
    ],
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(mockCustomers);
  const [search, setSearch] = useState("");
  const [selectedCust, setSelectedCust] = useState<CustomerRecord | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.county.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="h-6 w-6 text-emerald-400" />
            <span>Customer Profiles & Purchasing History</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Track lifetime spending, order velocity, location clusters, and customer contact data.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-bold bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
          Total Registered Accounts: <span className="text-emerald-400 font-black">{customers.length}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, email, county..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Location</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-4 font-extrabold text-white">{c.name}</td>
                  <td className="p-4">
                    <p className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Phone className="h-3 w-3 text-emerald-400" /> {c.phone}
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                      <Mail className="h-3 w-3 text-slate-500" /> {c.email}
                    </p>
                  </td>
                  <td className="p-4 font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-400" /> {c.town}, {c.county}
                    </span>
                  </td>
                  <td className="p-4 font-black text-emerald-400 text-sm">
                    KES {c.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-white">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
                      {c.ordersCount} orders
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedCust(c)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900 font-bold text-xs"
                    >
                      View Profile & History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-black text-white">{selectedCust.name}</h2>
                <p className="text-xs text-slate-400">{selectedCust.email} · {selectedCust.phone}</p>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Lifetime Value</p>
                <p className="text-lg font-black text-emerald-400 mt-1">KES {selectedCust.totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Delivery Location</p>
                <p className="text-sm font-bold text-white mt-1">{selectedCust.town}, {selectedCust.county}</p>
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Order History</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedCust.orders.map((ord) => (
                <div key={ord.orderNumber} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <p className="font-mono font-bold text-emerald-400">{ord.orderNumber}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ord.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-white">KES {ord.total.toLocaleString()}</p>
                    <span className="text-[10px] uppercase font-bold text-blue-400">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedCust(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { UserCheck, Plus, Shield, Check, Lock, Trash2, Mail } from "lucide-react";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Sales" | "Inventory" | "Delivery" | "Support";
  status: "Active" | "Suspended";
  lastActive: string;
};

const mockStaff: StaffUser[] = [
  {
    id: "stf-1",
    name: "Super Admin",
    email: "ecovoltsolar145@gmail.com",
    role: "Super Admin",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "stf-2",
    name: "John Kamau",
    email: "john.kamau@ecovolt.co.ke",
    role: "Inventory",
    status: "Active",
    lastActive: "10 mins ago",
  },
  {
    id: "stf-3",
    name: "Mary Otieno",
    email: "mary.otieno@ecovolt.co.ke",
    role: "Sales",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: "stf-4",
    name: "Joseph Mwangi",
    email: "joseph.mwangi@ecovolt.co.ke",
    role: "Delivery",
    status: "Active",
    lastActive: "Yesterday",
  },
];

export default function AdminUsersPage() {
  const [staffList, setStaffList] = useState<StaffUser[]>(mockStaff);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffUser["role"]>("Sales");

  function handleCreateStaff() {
    if (!name || !email) return;
    const newStaff: StaffUser = {
      id: `stf-${Date.now()}`,
      name,
      email,
      role,
      status: "Active",
      lastActive: "Never",
    };
    setStaffList([...staffList, newStaff]);
    setShowModal(false);
    setName("");
    setEmail("");
  }

  function toggleStatus(id: string) {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" } : s,
      ),
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <UserCheck className="h-6 w-6 text-emerald-400" />
            <span>Staff User Management & Role Permissions</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Provision staff accounts, assign granular role boundaries (Super Admin, Inventory, Sales, Delivery, Support).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg shadow-emerald-950"
        >
          <Plus className="h-4 w-4" />
          <span>Add Staff Account</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staffList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-4">
                    <p className="font-extrabold text-white">{s.name}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{s.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-[11px] flex items-center gap-1 w-fit">
                      <Shield className="h-3 w-3" /> {s.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        s.status === "Active"
                          ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                          : "bg-red-950 text-red-400 border-red-800"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-[11px] font-mono">{s.lastActive}</td>
                  <td className="p-4 text-right space-x-2">
                    {s.role !== "Super Admin" && (
                      <button
                        onClick={() => toggleStatus(s.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold"
                      >
                        {s.status === "Active" ? "Suspend Access" : "Re-activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <h2 className="text-base font-extrabold text-white mb-4">Provision Staff Account</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mwangi"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="david@ecovolt.co.ke"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Role & Permissions Boundary</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white font-bold"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Admin">Admin (All Store Modules)</option>
                  <option value="Sales">Sales (Orders, Customers & Coupons)</option>
                  <option value="Inventory">Inventory (Stock & Restock)</option>
                  <option value="Delivery">Delivery (Couriers & Dispatch)</option>
                  <option value="Support">Support (Reviews & Chat)</option>
                </select>
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
                onClick={handleCreateStaff}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Send Invite & Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

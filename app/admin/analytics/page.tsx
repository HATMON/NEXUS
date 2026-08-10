"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  BarChart2,
  Users,
  Percent,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const categoryData = [
  { name: "Solar Panels", value: 45, color: "#10b981" },
  { name: "Inverters", value: 30, color: "#3b82f6" },
  { name: "Batteries", value: 15, color: "#8b5cf6" },
  { name: "Solar Kits", value: 10, color: "#f59e0b" },
];

const monthlyData = [
  { month: "Jan", revenue: 2400000 },
  { month: "Feb", revenue: 2900000 },
  { month: "Mar", revenue: 3100000 },
  { month: "Apr", revenue: 3800000 },
  { month: "May", revenue: 4100000 },
  { month: "Jun", revenue: 4500000 },
  { month: "Jul", revenue: 4280000 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <span>Store Analytics & Revenue Intelligence</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Visual breakdown of monthly revenue trajectories, equipment category mix, conversion rate & AOV.
          </p>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Average Order Value (AOV)</p>
          <p className="text-2xl font-black text-white mt-2">KES 89,160</p>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">+8.4% this month</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Storefront Conversion Rate</p>
          <p className="text-2xl font-black text-emerald-400 mt-2">4.85%</p>
          <p className="text-xs text-slate-400 mt-1 font-semibold">1,240 monthly visitors</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Repeat Customer Rate</p>
          <p className="text-2xl font-black text-purple-400 mt-2">38.2%</p>
          <p className="text-xs text-slate-400 mt-1 font-semibold">High contractor loyalty</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">YTD Total Revenue</p>
          <p className="text-2xl font-black text-cyan-400 mt-2">KES 25.08M</p>
          <p className="text-xs text-cyan-400 mt-1 font-semibold">2026 Growth Target: On Track</p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <h2 className="text-base font-extrabold text-white mb-4">Monthly Revenue Growth (KES)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `K${v / 1000000}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                  formatter={(v: any) => [`KES ${Number(v).toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white mb-4">Category Revenue Share</h2>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-slate-800">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                  {c.name}
                </span>
                <span className="font-extrabold text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

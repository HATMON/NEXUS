"use client";

import { useEffect, useState } from "react";
import { History, Search, RefreshCw, Filter, User, Calendar } from "lucide-react";

type AuditItem = {
  _id: string;
  action: string;
  entityType: "order" | "product" | "system" | "notification";
  entityId?: string;
  details: string;
  performedBy: string;
  timestamp: string;
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");

  async function fetchLogs() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activity?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.performedBy.toLowerCase().includes(search.toLowerCase()) ||
      (l.entityId && l.entityId.toLowerCase().includes(search.toLowerCase()));

    const matchesEntity = entityFilter === "all" || l.entityType === entityFilter;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <History className="h-6 w-6 text-emerald-400" />
            <span>Audit Trail & Security Event Logs</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Immutable tracking of price modifications, stock level adjustments, order status updates & staff logins.
          </p>
        </div>

        <button
          onClick={() => void fetchLogs()}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-extrabold text-xs transition border border-slate-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by staff name, action, product SKU, order #..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white font-bold"
            >
              <option value="all">All Entity Types</option>
              <option value="order">Orders</option>
              <option value="product">Products & Stock</option>
              <option value="notification">Notifications</option>
              <option value="system">System & Security</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {filtered.map((log) => (
            <div key={log._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-900/40 transition">
              <div className="flex items-start gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-emerald-400 font-bold uppercase text-[10px] shrink-0">
                  {log.entityType}
                </span>
                <div>
                  <p className="font-extrabold text-white text-sm">
                    {log.action}{" "}
                    {log.entityId && (
                      <span className="font-mono text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 ml-2">
                        {log.entityId}
                      </span>
                    )}
                  </p>
                  <p className="text-slate-300 mt-0.5">{log.details}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-300 border border-slate-800">
                  👤 {log.performedBy}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

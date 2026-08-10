"use client";

import { useEffect, useState } from "react";
import { Boxes, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Search } from "lucide-react";

type AdminProduct = {
  _id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  lowStockLevel: number;
};

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adjustingProduct, setAdjustingProduct] = useState<AdminProduct | null>(null);
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustType, setAdjustType] = useState<"add" | "set">("add");
  const [msg, setMsg] = useState<string | null>(null);

  async function loadInventory() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInventory();
  }, []);

  async function handleApplyAdjustment() {
    if (!adjustingProduct) return;
    const newStock = adjustType === "add" ? adjustingProduct.stock + adjustQty : adjustQty;

    try {
      const res = await fetch(`/api/admin/products/${adjustingProduct._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`✓ Stock updated for '${adjustingProduct.name}' to ${newStock} units`);
        setAdjustingProduct(null);
        await loadInventory();
        setTimeout(() => setMsg(null), 5000);
      }
    } catch {
      // fallback mock update
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockLevel).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Boxes className="h-6 w-6 text-emerald-400" />
            <span>Inventory & Stock Control</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time stock audit, low-stock reorder thresholds, and manual restock adjustments.
          </p>
        </div>

        <button
          onClick={() => void loadInventory()}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-extrabold text-xs transition border border-slate-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs font-extrabold text-emerald-300">
          {msg}
        </div>
      )}

      {/* Stock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Tracked Items</p>
          <p className="text-2xl font-black text-white mt-2">{products.length} Products</p>
        </div>
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5">
          <p className="text-xs font-bold text-amber-300 uppercase">⚠ Low Stock Warning</p>
          <p className="text-2xl font-black text-amber-400 mt-2">{lowStockCount} Items</p>
        </div>
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5">
          <p className="text-xs font-bold text-red-300 uppercase">❌ Out of Stock</p>
          <p className="text-2xl font-black text-red-400 mt-2">{outOfStockCount} Items</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter inventory by name, SKU..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">SKU & Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= p.lowStockLevel;

                return (
                  <tr key={p._id} className="hover:bg-slate-900/40 transition">
                    <td className="p-4">
                      <p className="font-extrabold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{p.sku}</p>
                    </td>
                    <td className="p-4 text-slate-400 font-medium">{p.category}</td>
                    <td className="p-4 font-bold text-emerald-400">
                      KES {p.price.toLocaleString()}
                    </td>
                    <td className="p-4 font-black text-base text-white">{p.stock}</td>
                    <td className="p-4">
                      {isOut ? (
                        <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                          Out of stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                          Low Stock (≤{p.lowStockLevel})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustingProduct(p);
                          setAdjustQty(10);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900 text-xs font-bold"
                      >
                        + Restock / Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="text-base font-extrabold text-white mb-2">Restock / Adjust Inventory</h2>
            <p className="text-xs text-slate-400 mb-4">{adjustingProduct.name}</p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAdjustType("add")}
                    className={`py-2 rounded-xl border text-xs font-bold ${
                      adjustType === "add"
                        ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    Add Stock (+)
                  </button>
                  <button
                    onClick={() => setAdjustType("set")}
                    className={`py-2 rounded-xl border text-xs font-bold ${
                      adjustType === "set"
                        ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    Set Exact Qty
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-bold"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyAdjustment}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

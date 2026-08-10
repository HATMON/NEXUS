"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Product = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  category: string;
  brand?: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  lowStockLevel: number;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ProductForm = {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  category: string;
  brand: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  lowStockLevel: string;
  imageUrls: string;
  featured: boolean;
  active: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  shortDescription: "",
  category: "Batteries",
  brand: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  lowStockLevel: "5",
  imageUrls: "",
  featured: false,
  active: true,
};

const categories = [
  "Solar Panels",
  "Inverters",
  "Batteries",
  "Solar Kits",
  "Water Pumps",
  "Accessories",
];

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAdminAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<
    Product[]
  >([]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAdminAuthenticated, router]);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Bulk Actions & Email Alerts State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<"stock" | "status" | "lowStock" | null>(null);
  const [bulkStockVal, setBulkStockVal] = useState("10");
  const [bulkLowStockVal, setBulkLowStockVal] = useState("5");
  const [bulkActiveVal, setBulkActiveVal] = useState(true);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [dispatchAlertMsg, setDispatchAlertMsg] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/products?t=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to load products.",
        );
      }

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : [],
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load products.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name
          .toLowerCase()
          .includes(query) ||
        product.sku
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query) ||
        product.brand
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [products, search]);

  const lowStockCount = products.filter(
    (product) =>
      product.stock <= product.lowStockLevel,
  ).length;

  const activeCount = products.filter(
    (product) => product.active,
  ).length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0,
  );

  function toggleSelectAll() {
    if (selectedIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p._id));
    }
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  async function handleExecuteBulkAction() {
    if (selectedIds.length === 0 || !bulkAction) return;

    setBulkProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const bodyData: any = {
        productIds: selectedIds,
      };

      if (bulkAction === "stock") {
        bodyData.action = "update-stock";
        bodyData.stockValue = Number(bulkStockVal);
      } else if (bulkAction === "status") {
        bodyData.action = "set-active";
        bodyData.activeValue = bulkActiveVal;
      } else if (bulkAction === "lowStock") {
        bodyData.action = "update-low-stock";
        bodyData.lowStockValue = Number(bulkLowStockVal);
      }

      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Bulk action failed");
      }

      setSuccess(`✓ ${data.message}`);
      setSelectedIds([]);
      setBulkAction(null);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk action failed");
    } finally {
      setBulkProcessing(false);
    }
  }

  async function handleSendLowStockAlert(product: Product) {
    setDispatchAlertMsg(null);
    try {
      const res = await fetch("/api/admin/notifications/low-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          recipientEmail: "inventory-alerts@ecovolt.co.ke",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatchAlertMsg(
          `📧 Low Stock Email Alert dispatched to inventory-alerts@ecovolt.co.ke for '${product.name}' (Current Stock: ${product.stock}, Limit: ${product.lowStockLevel})`,
        );
        setTimeout(() => setDispatchAlertMsg(null), 7000);
      }
    } catch (e) {
      // ignore
    }
  }

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditing(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,

      shortDescription:
        product.shortDescription || "",

      category: product.category,
      brand: product.brand || "",
      price: String(product.price),

      compareAtPrice:
        product.compareAtPrice === null ||
        product.compareAtPrice === undefined
          ? ""
          : String(product.compareAtPrice),

      stock: String(product.stock),

      lowStockLevel: String(
        product.lowStockLevel,
      ),

      imageUrls: product.images.join("\n"),
      featured: product.featured,
      active: product.active,
    });

    setError(null);
    setSuccess(null);
  }

  function resetForm() {
    setEditingProduct(null);
    setForm(emptyForm);
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "/api/admin/products",
        {
          method: editingProduct
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            productId: editingProduct?._id,
            name: form.name,

            slug:
              form.slug ||
              createSlug(form.name),

            sku: form.sku,
            description: form.description,

            shortDescription:
              form.shortDescription,

            category: form.category,
            brand: form.brand,
            price: Number(form.price),

            compareAtPrice:
              form.compareAtPrice.trim() === ""
                ? null
                : Number(
                    form.compareAtPrice,
                  ),

            stock: Number(form.stock),

            lowStockLevel: Number(
              form.lowStockLevel,
            ),

            images: form.imageUrls
              .split(/\r?\n|,/)
              .map((image) => image.trim())
              .filter(Boolean),

            featured: form.featured,
            active: form.active,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to save product.",
        );
      }

      setSuccess(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully.",
      );

      resetForm();
      await loadProducts();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save product.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}" permanently?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "/api/admin/products",
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            productId: product._id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to delete product.",
        );
      }

      if (
        editingProduct?._id === product._id
      ) {
        resetForm();
      }

      setSuccess(
        "Product deleted successfully.",
      );

      await loadProducts();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete product.",
      );
    }
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
                Products
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Add, edit and manage your product
                catalogue.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/orders"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
              >
                Orders
              </Link>

              <Link
                href="/"
                className="rounded-xl bg-[#005b4f] px-5 py-3 text-sm font-bold text-white hover:bg-[#00483e]"
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
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              Orders
            </Link>

            <Link
              href="/admin/products"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-sm"
            >
              Products ({products.length})
            </Link>
          </nav>
        </div>
      </header>

      <section className="container py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total Products
            </p>

            <p className="mt-3 text-3xl font-extrabold">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Active Products
            </p>

            <p className="mt-3 text-3xl font-extrabold text-emerald-700">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Low Stock
            </p>

            <p className="mt-3 text-3xl font-extrabold text-amber-700">
              {lowStockCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total Units
            </p>

            <p className="mt-3 text-3xl font-extrabold text-[#005b4f]">
              {totalStock}
            </p>
          </div>
        </div>

        {dispatchAlertMsg && (
          <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-bold text-emerald-800 flex items-center justify-between animate-fadeIn">
            <span>{dispatchAlertMsg}</span>
            <button
              onClick={() => setDispatchAlertMsg(null)}
              className="text-xs text-emerald-700 underline font-semibold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_430px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={
                    filteredProducts.length > 0 &&
                    selectedIds.length === filteredProducts.length
                  }
                  onChange={toggleSelectAll}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-bold text-slate-700 cursor-pointer select-none"
                >
                  Select All ({selectedIds.length}/{filteredProducts.length})
                </label>
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product, SKU, brand or category"
                className="h-10 w-full max-w-xs rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
              />
            </div>

            {/* Bulk Action Controls Bar */}
            {selectedIds.length > 0 && (
              <div className="border-b border-emerald-200 bg-emerald-50/90 p-4 transition">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-extrabold text-emerald-900">
                    ⚡ Bulk Actions ({selectedIds.length} items selected):
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={bulkAction || ""}
                      onChange={(e) =>
                        setBulkAction(
                          (e.target.value as any) || null,
                        )
                      }
                      className="h-9 rounded-lg border border-emerald-300 bg-white px-3 text-xs font-bold text-slate-800 outline-none"
                    >
                      <option value="">Select Bulk Operation...</option>
                      <option value="stock">Batch Update Stock Level</option>
                      <option value="status">Batch Toggle Active/Hidden</option>
                      <option value="lowStock">Batch Set Low-Stock Threshold</option>
                    </select>

                    {bulkAction === "stock" && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-600">
                          Stock:
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={bulkStockVal}
                          onChange={(e) => setBulkStockVal(e.target.value)}
                          className="h-9 w-20 rounded-lg border border-emerald-300 px-2 text-xs font-bold bg-white"
                        />
                      </div>
                    )}

                    {bulkAction === "status" && (
                      <div className="flex items-center gap-1">
                        <select
                          value={bulkActiveVal ? "true" : "false"}
                          onChange={(e) =>
                            setBulkActiveVal(e.target.value === "true")
                          }
                          className="h-9 rounded-lg border border-emerald-300 bg-white px-2 text-xs font-bold"
                        >
                          <option value="true">Make Active</option>
                          <option value="false">Make Hidden</option>
                        </select>
                      </div>
                    )}

                    {bulkAction === "lowStock" && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-600">
                          Limit:
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={bulkLowStockVal}
                          onChange={(e) => setBulkLowStockVal(e.target.value)}
                          className="h-9 w-20 rounded-lg border border-emerald-300 px-2 text-xs font-bold bg-white"
                        />
                      </div>
                    )}

                    {bulkAction && (
                      <button
                        type="button"
                        disabled={bulkProcessing}
                        onClick={handleExecuteBulkAction}
                        className="h-9 rounded-lg bg-[#005b4f] px-4 text-xs font-extrabold text-white transition hover:bg-[#00483e] disabled:opacity-50"
                      >
                        {bulkProcessing ? "Applying..." : "Apply Bulk Action"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedIds([])}
                      className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Deselect
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-10 text-center text-sm font-semibold text-slate-500">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-10 text-center text-sm font-semibold text-slate-500">
                No products have been added yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product._id);
                  const isLowStock = product.stock <= product.lowStockLevel;

                  return (
                    <div
                      key={product._id}
                      className={`flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center transition ${
                        isSelected ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(product._id)}
                          className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                        />

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-400">
                              No image
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-extrabold text-slate-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {product.sku} · {product.category}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 items-center">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                product.active
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {product.active ? "Active" : "Hidden"}
                            </span>

                            {product.featured && (
                              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700">
                                Featured
                              </span>
                            )}

                            {isLowStock && (
                              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                                Low stock (≤{product.lowStockLevel})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 md:justify-end">
                        <div className="md:text-right">
                          <p className="font-extrabold text-[#005b4f]">
                            {formatMoney(product.price)}
                          </p>

                          <p className={`mt-1 text-xs font-semibold ${isLowStock ? "text-amber-700 font-extrabold" : "text-slate-500"}`}>
                            Stock: {product.stock} (Threshold: {product.lowStockLevel})
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {isLowStock && (
                            <button
                              type="button"
                              onClick={() => handleSendLowStockAlert(product)}
                              title="Send Email Alert to Inventory Admin"
                              className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-2 text-xs font-extrabold text-amber-800 hover:bg-amber-100 flex items-center gap-1"
                            >
                              <span>📧 Send Email Alert</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => startEditing(product)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 bg-white"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => void deleteProduct(product)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 bg-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {editingProduct
                    ? "Edit Product"
                    : "New Product"}
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  {editingProduct
                    ? editingProduct.name
                    : "Add Product"}
                </h2>
              </div>

              {editingProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <label className="block text-sm font-bold text-slate-700">
                Product Name

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => {
                    updateField(
                      "name",
                      event.target.value,
                    );

                    if (!editingProduct) {
                      updateField(
                        "slug",
                        createSlug(
                          event.target.value,
                        ),
                      );
                    }
                  }}
                  required
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  SKU

                  <input
                    type="text"
                    value={form.sku}
                    onChange={(event) =>
                      updateField(
                        "sku",
                        event.target.value.toUpperCase(),
                      )
                    }
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm uppercase outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Slug

                  <input
                    type="text"
                    value={form.slug}
                    onChange={(event) =>
                      updateField(
                        "slug",
                        createSlug(
                          event.target.value,
                        ),
                      )
                    }
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <label className="block text-sm font-bold text-slate-700">
                Category

                <select
                  value={form.category}
                  onChange={(event) =>
                    updateField(
                      "category",
                      event.target.value,
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Brand

                <input
                  type="text"
                  value={form.brand}
                  onChange={(event) =>
                    updateField(
                      "brand",
                      event.target.value,
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  Price

                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) =>
                      updateField(
                        "price",
                        event.target.value,
                      )
                    }
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Old Price

                  <input
                    type="number"
                    min="0"
                    value={
                      form.compareAtPrice
                    }
                    onChange={(event) =>
                      updateField(
                        "compareAtPrice",
                        event.target.value,
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  Stock

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      updateField(
                        "stock",
                        event.target.value,
                      )
                    }
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Low Stock Alert

                  <input
                    type="number"
                    min="0"
                    value={
                      form.lowStockLevel
                    }
                    onChange={(event) =>
                      updateField(
                        "lowStockLevel",
                        event.target.value,
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <label className="block text-sm font-bold text-slate-700">
                Short Description

                <textarea
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateField(
                      "shortDescription",
                      event.target.value,
                    )
                  }
                  rows={2}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Full Description

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={4}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Image URLs

                <textarea
                  value={form.imageUrls}
                  onChange={(event) =>
                    updateField(
                      "imageUrls",
                      event.target.value,
                    )
                  }
                  rows={3}
                  placeholder="One image URL per line"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateField(
                        "featured",
                        event.target.checked,
                      )
                    }
                    className="h-4 w-4 accent-emerald-600"
                  />

                  Featured
                </label>

                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      updateField(
                        "active",
                        event.target.checked,
                      )
                    }
                    className="h-4 w-4 accent-emerald-600"
                  />

                  Active
                </label>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[#005b4f] px-5 py-4 text-sm font-extrabold text-white hover:bg-[#00483e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving Product..."
                  : editingProduct
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  );
}
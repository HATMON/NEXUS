"use client";

import { useState } from "react";
import { FolderTree, Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon, ArrowUp, ArrowDown, Check } from "lucide-react";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image: string;
  hidden: boolean;
  order: number;
};

const initialCategories: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Solar Panels",
    slug: "solar-panels",
    description: "High efficiency Monocrystalline and Polycrystalline solar panels with 25-year performance warranty.",
    productCount: 14,
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=80",
    hidden: false,
    order: 1,
  },
  {
    id: "cat-2",
    name: "Inverters",
    slug: "inverters",
    description: "Hybrid & Off-Grid Pure Sine Wave solar inverters with smart MPPT charge controllers.",
    productCount: 9,
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&auto=format&fit=crop&q=80",
    hidden: false,
    order: 2,
  },
  {
    id: "cat-3",
    name: "Batteries",
    slug: "batteries",
    description: "Long-cycle LiFePO4 Lithium Iron Phosphate and Deep Cycle Gel batteries.",
    productCount: 11,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&auto=format&fit=crop&q=80",
    hidden: false,
    order: 3,
  },
  {
    id: "cat-4",
    name: "Solar Kits",
    slug: "solar-kits",
    description: "Complete turnkey solar system packages for homes, farms and commercial premises.",
    productCount: 6,
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&auto=format&fit=crop&q=80",
    hidden: false,
    order: 4,
  },
  {
    id: "cat-5",
    name: "Water Pumps",
    slug: "water-pumps",
    description: "Submersible & Surface solar powered water pumping systems for irrigation & domestic supply.",
    productCount: 8,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
    hidden: false,
    order: 5,
  },
  {
    id: "cat-6",
    name: "Accessories",
    slug: "accessories",
    description: "Solar cables, MC4 connectors, mounting brackets, DC breakers and surge protectors.",
    productCount: 22,
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&auto=format&fit=crop&q=80",
    hidden: false,
    order: 6,
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  function openCreateModal() {
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "", image: "" });
    setShowModal(true);
  }

  function openEditModal(cat: CategoryItem) {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!formData.name) return;
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...formData, slug } : c)),
      );
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug,
        description: formData.description,
        productCount: 0,
        image: formData.image || "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400",
        hidden: false,
        order: categories.length + 1,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setShowModal(false);
  }

  function toggleHide(id: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)),
    );
  }

  function deleteCategory(id: string) {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  }

  function moveOrder(id: string, direction: "up" | "down") {
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === categories.length - 1) return;

    const newCats = [...categories];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = newCats[index];
    newCats[index] = newCats[targetIdx];
    newCats[targetIdx] = temp;

    setCategories(newCats.map((c, idx) => ({ ...c, order: idx + 1 })));
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <FolderTree className="h-6 w-6 text-emerald-400" />
            <span>Categories Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Organize solar catalog hierarchy, custom collection banners, and visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg shadow-emerald-950"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`rounded-2xl border bg-slate-950 overflow-hidden flex flex-col justify-between transition ${
              cat.hidden ? "border-slate-800 opacity-60" : "border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="relative h-40 bg-slate-900 overflow-hidden">
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur text-[10px] font-extrabold text-slate-300 border border-slate-700">
                  #{cat.order} Sort Order
                </span>
                {cat.hidden && (
                  <span className="px-2.5 py-1 rounded-full bg-red-950/90 text-[10px] font-extrabold text-red-300 border border-red-800">
                    Hidden
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h2 className="text-lg font-black text-white">{cat.name}</h2>
                <p className="text-xs text-emerald-400 font-bold">{cat.productCount} Listed Products</p>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => moveOrder(cat.id, "up")}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveOrder(cat.id, "down")}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleHide(cat.id)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400"
                    title={cat.hidden ? "Publish Category" : "Hide Category"}
                  >
                    {cat.hidden ? <EyeOff className="h-4 w-4 text-red-400" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400"
                    title="Edit Details"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 rounded-lg bg-red-950/30 border border-red-800/50 text-red-400 hover:bg-red-900/50"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-white mb-4">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Solar Generators"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of equipment..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

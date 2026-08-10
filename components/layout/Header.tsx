"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "./TopBar";
import Navigation from "./Navigation";
import { useCart } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { formatPrice } from "@/lib/format";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [mounted, setMounted] = useState(false);

  const items = useCart((state) => state.items);
  const subtotal = useCart((state) => state.subtotal);
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const cartSubtotal = mounted ? subtotal() : 0;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (category !== "All Categories") {
      params.set("category", category);
    }

    const queryString = params.toString();

    router.push(queryString ? `/shop?${queryString}` : "/shop");
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm transition-all">
      <TopBar />

      <div className="container flex min-h-[72px] sm:min-h-[84px] items-center gap-3 sm:gap-5 py-2.5 sm:py-3">
        {/* Brand Logo */}
        <a href="/" className="shrink-0 transition hover:opacity-90" aria-label="EcoVolt Nexus home">
          <img
            src="/images/ecovolt-logo.png"
            alt="EcoVolt Nexus"
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
          />
        </a>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 items-center overflow-hidden rounded-xl border-2 border-emerald-600 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 lg:flex"
        >
          <select
            aria-label="Select product category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 border-r border-slate-200 bg-slate-50 px-3.5 text-xs lg:text-sm font-semibold text-slate-700 outline-none hover:bg-slate-100"
          >
            <option>All Categories</option>
            <option>Solar Panels</option>
            <option>Inverters</option>
            <option>Lithium Batteries</option>
            <option>Solar Kits</option>
            <option>Water Pumps</option>
            <option>Accessories</option>
          </select>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search solar panels, 5KVA inverters, lithium batteries..."
            className="h-11 min-w-0 flex-1 px-4 text-xs lg:text-sm text-slate-900 placeholder-slate-400 outline-none"
          />

          <button
            type="submit"
            aria-label="Search"
            className="flex h-11 w-14 items-center justify-center bg-[#ffc400] text-slate-900 transition hover:bg-yellow-400 active:scale-95"
          >
            <Search className="h-5 w-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Header Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4 md:gap-5">
          {/* Wishlist */}
          <a
            href="/wishlist"
            className="hidden text-center sm:flex flex-col items-center group text-slate-700 hover:text-emerald-700 transition"
          >
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold mt-0.5">Wishlist</span>
          </a>

          {/* Account */}
          <a
            href={mounted && user ? "/account" : "/login"}
            className="flex flex-col items-center group text-slate-700 hover:text-emerald-700 transition"
          >
            <User className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
            <span className="hidden text-[11px] font-bold mt-0.5 sm:block">
              {mounted && user ? user.name.split(" ")[0] : "Account"}
            </span>
          </a>

          {/* Cart Drawer Link */}
          <a
            href="/cart"
            className="relative flex items-center gap-2.5 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-950 hover:bg-emerald-100 transition border border-emerald-200/60"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-800" />
              {totalItems > 0 && (
                <span className="absolute -right-2.5 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ffc400] px-1 text-[10px] font-black text-black shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </div>

            <div className="hidden text-left text-xs leading-tight sm:block">
              <span className="block font-black text-emerald-900 text-[11px] uppercase tracking-wider">Cart</span>
              <span className="font-bold text-emerald-700 text-xs">
                {cartSubtotal > 0 ? formatPrice(cartSubtotal) : "KSh 0"}
              </span>
            </div>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      <div className="container pb-2.5 lg:hidden">
        <form
          onSubmit={handleSearch}
          className="flex overflow-hidden rounded-xl border-2 border-emerald-600 bg-white shadow-sm"
        >
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search solar panels, inverters..."
            className="h-10 min-w-0 flex-1 px-3.5 text-xs text-slate-900 outline-none"
          />

          <button
            type="submit"
            aria-label="Search"
            className="flex w-12 items-center justify-center bg-[#ffc400] text-black"
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>
      </div>

      {/* Desktop Main Category Navigation */}
      <Navigation />

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden shadow-xl animate-in slide-in-from-top duration-200">
          <div className="container space-y-1 py-4">
            {[
              ["⚡ Home", "/"],
              ["🛍 Shop All Products", "/shop"],
              ["☀️ Solar Panels", "/shop?category=Solar%20Panels"],
              ["🔋 Solar Inverters", "/shop?category=Inverters"],
              ["⚡ Lithium Batteries", "/shop?category=Lithium%20Batteries"],
              ["📦 Solar Kits", "/shop?category=Solar%20Kits"],
              ["🏢 Our Projects", "/projects"],
              ["📞 Contact Us", "/contact"],
              ["📝 Get Free Quote", "/quote"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

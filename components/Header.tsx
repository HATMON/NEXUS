"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const departments = [
  "Solar Panels",
  "Inverters",
  "Lithium Batteries",
  "Gel Batteries",
  "Solar Kits",
  "Charge Controllers",
  "Solar Water Pumps",
  "Solar Street Lights",
  "Cables",
  "Accessories",
];

export default function Header() {
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="bg-[#00483e] text-white">
        <div className="container flex min-h-8 items-center justify-between gap-4 text-[11px]">
          <p>☎ Need Help? Call us 0727 971 171</p>

          <div className="hidden items-center gap-5 md:flex">
            <Link href="/about">About Us</Link>
            <Link href="/track-order">Order Tracking</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/faq">FAQs</Link>
          </div>
        </div>
      </div>

      <div className="container flex min-h-[84px] items-center gap-5 py-3">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/ecovolt-logo.png"
            alt="EcoVolt Nexus"
            width={125}
            height={60}
            priority
            className="h-16 w-auto"
          />
        </Link>

        <div className="hidden flex-1 items-center overflow-hidden rounded-lg border border-emerald-300 lg:flex">
          <select
            aria-label="Select product category"
            className="h-11 border-r border-slate-200 bg-slate-50 px-4 text-sm outline-none"
          >
            <option>All Categories</option>
            {departments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>

          <input
            type="search"
            placeholder="Search for solar products..."
            className="h-11 min-w-0 flex-1 px-4 text-sm outline-none"
          />

          <button
            type="button"
            aria-label="Search"
            className="flex h-11 w-14 items-center justify-center bg-[#ffc400] text-xl text-black transition hover:bg-yellow-400"
          >
            ⌕
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3 md:gap-6">
          <Link href="/login" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00483e] text-white">
              ♙
            </span>

            <span className="hidden text-xs leading-tight sm:block">
              <span className="block text-slate-500">Login</span>
              <strong>My Account</strong>
            </span>
          </Link>

          <Link href="/cart" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00483e] text-white">
              🛒
            </span>

            <span className="hidden text-xs leading-tight sm:block">
              <span className="block text-slate-500">Your Cart</span>
              <strong>KSh 0</strong>
            </span>
          </Link>

          <button
            type="button"
            aria-label="Open mobile menu"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 lg:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      <div className="container pb-3 lg:hidden">
        <div className="flex overflow-hidden rounded-lg border border-emerald-300">
          <input
            type="search"
            placeholder="Search solar products..."
            className="h-11 min-w-0 flex-1 px-4 text-sm outline-none"
          />

          <button
            type="button"
            aria-label="Search"
            className="w-14 bg-[#ffc400]"
          >
            ⌕
          </button>
        </div>
      </div>

      <nav className="relative bg-[#00483e] text-white">
        <div className="container hidden min-h-[48px] items-center gap-7 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDepartmentOpen((current) => !current)}
              className="flex h-12 items-center gap-2 bg-white/10 px-4 text-sm font-bold"
            >
              ☰ SHOP BY DEPARTMENT
              <span className="text-xs">⌄</span>
            </button>

            {departmentOpen && (
              <div className="absolute left-0 top-full z-50 w-60 overflow-hidden rounded-b-lg bg-white py-2 text-slate-800 shadow-xl">
                {departments.map((department) => (
                  <Link
                    key={department}
                    href={`/shop?category=${encodeURIComponent(department)}`}
                    className="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setDepartmentOpen(false)}
                  >
                    {department}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/shop?category=Inverters" className="text-sm font-semibold">
            Solar Inverters
          </Link>

          <Link
            href="/shop?category=Solar Batteries"
            className="text-sm font-semibold"
          >
            Solar Batteries
          </Link>

          <Link
            href="/shop?category=Solar Panels"
            className="text-sm font-semibold"
          >
            Solar Panels
          </Link>

          <Link
            href="/shop?category=Solar Outdoor Lights"
            className="text-sm font-semibold"
          >
            Solar Outdoor Lights
          </Link>

          <Link
            href="/shop?category=Solar Water Pumps"
            className="text-sm font-semibold"
          >
            Solar Water Pumps
          </Link>

          <Link
            href="/shop?category=Solar Kits"
            className="text-sm font-semibold"
          >
            Solar Kits
          </Link>

          <Link
            href="/projects"
            className="ml-auto text-sm font-bold text-[#ffc400]"
          >
            Our Projects →
          </Link>
        </div>

        {mobileOpen && (
          <div className="container space-y-1 py-3 lg:hidden">
            <Link
              href="/shop"
              className="block rounded px-3 py-2 text-sm hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              Shop All Products
            </Link>

            {departments.map((department) => (
              <Link
                key={department}
                href={`/shop?category=${encodeURIComponent(department)}`}
                className="block rounded px-3 py-2 text-sm hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {department}
              </Link>
            ))}

            <Link
              href="/projects"
              className="block rounded px-3 py-2 text-sm font-bold text-[#ffc400]"
              onClick={() => setMobileOpen(false)}
            >
              Our Projects
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
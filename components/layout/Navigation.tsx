"use client";

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

export default function Navigation() {
  const [departmentOpen, setDepartmentOpen] = useState(false);

  return (
    <nav className="relative bg-[#005b4f] text-white">
      <div className="container hidden min-h-12 items-center gap-7 lg:flex">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDepartmentOpen((current) => !current)}
            className="flex h-12 items-center gap-3 bg-white/10 px-5 text-sm font-bold hover:bg-white/15"
          >
            <span>☰</span>
            <span>SHOP BY DEPARTMENT</span>
            <span className="text-xs">⌄</span>
          </button>

          {departmentOpen && (
            <div className="absolute left-0 top-full z-50 w-64 overflow-hidden rounded-b-xl bg-white py-2 text-slate-800 shadow-xl">
              {departments.map((department) => (
                <a
                  key={department}
                  href={`/shop?category=${encodeURIComponent(department)}`}
                  className="block px-4 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => setDepartmentOpen(false)}
                >
                  {department}
                </a>
              ))}
            </div>
          )}
        </div>

        <a href="/shop?category=Solar Panels" className="text-sm font-semibold">
          Solar Panels
        </a>

        <a href="/shop?category=Inverters" className="text-sm font-semibold">
          Inverters
        </a>

        <a
          href="/shop?category=Lithium Batteries"
          className="text-sm font-semibold"
        >
          Batteries
        </a>

        <a href="/shop?category=Solar Kits" className="text-sm font-semibold">
          Solar Kits
        </a>

        <a
          href="/shop?category=Solar Water Pumps"
          className="text-sm font-semibold"
        >
          Water Pumps
        </a>

        <a href="/projects" className="text-sm font-semibold">
          Projects
        </a>

        <a href="/contact" className="text-sm font-semibold">
          Contact
        </a>

        <a
          href="/quote"
          className="ml-auto rounded-lg bg-[#ffc400] px-4 py-2 text-sm font-bold text-black"
        >
          Get Free Quote
        </a>
      </div>
    </nav>
  );
}
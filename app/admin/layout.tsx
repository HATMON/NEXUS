"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Boxes,
  Users,
  CreditCard,
  Truck,
  Ticket,
  FileSpreadsheet,
  Bell,
  Star,
  Settings,
  UserCheck,
  TrendingUp,
  History,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";

const navSections = [
  {
    title: "Core Operations",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: "Live" },
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Categories", href: "/admin/categories", icon: FolderTree },
      { name: "Inventory", href: "/admin/inventory", icon: Boxes },
    ],
  },
  {
    title: "Customers & Sales",
    items: [
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Payments", href: "/admin/payments", icon: CreditCard },
      { name: "Delivery", href: "/admin/delivery", icon: Truck },
      { name: "Coupons", href: "/admin/coupons", icon: Ticket },
      { name: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Management & Intelligence",
    items: [
      { name: "Reports", href: "/admin/reports", icon: FileSpreadsheet },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
      { name: "Audit Logs", href: "/admin/logs", icon: History },
      { name: "Website Settings", href: "/admin/settings", icon: Settings },
      { name: "Staff & Roles", href: "/admin/users", icon: UserCheck },
      { name: "Security & Backups", href: "/admin/security", icon: ShieldAlert },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated, logoutAdmin, adminEmail } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // If on login page, skip check
    if (pathname === "/admin/login") return;

    if (!isAdminAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAdminAuthenticated, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header Bar */}
      <header className="lg:hidden flex items-center justify-between bg-slate-950 px-4 py-3 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
            <span className="font-black tracking-tight text-white text-base">EcoVolt Admin</span>
          </Link>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1.5 rounded-lg"
        >
          <span>Store</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                EcoVolt Management
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-1">Admin Portal</h1>
          </div>

          <Link
            href="/"
            title="Open customer storefront in new tab"
            target="_blank"
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 transition"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* System Alert Status Pill */}
        <div className="mx-4 my-3 rounded-xl bg-amber-950/40 border border-amber-800/50 p-3 text-xs flex items-center gap-2.5 text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          <div className="min-w-0">
            <p className="font-bold truncate">3 Low Stock Items</p>
            <p className="text-[10px] text-amber-400/80 truncate">Action required in Inventory</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {sec.title}
              </h3>
              <div className="mt-1 space-y-0.5">
                {sec.items.map((item) => {
                  const IconComp = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                        isActive
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComp
                          className={`h-4 w-4 shrink-0 transition ${
                            isActive ? "text-emerald-400 stroke-[2.2]" : "text-slate-400 group-hover:text-slate-200"
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Admin Footer / Profile */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
                EV
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Super Admin</p>
                <p className="text-[10px] text-slate-400 mt-1">{adminEmail || "ecovoltsolar145@gmail.com"}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logoutAdmin();
                router.push("/admin/login");
              }}
              className="p-2 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900/50 hover:text-white transition"
              title="Sign Out Admin"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

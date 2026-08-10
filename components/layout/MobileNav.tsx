"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import {
  Home,
  ShoppingBag,
  PackageCheck,
  User,
  ShoppingCart,
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const items = useCart((state) => state.items);
  const { user, openAuthModal } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  // Don't render inside admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: ShoppingBag },
    { label: "Track", href: "/track-order", icon: PackageCheck },
    {
      label: mounted && user ? "Account" : "Log In",
      href: "/account",
      icon: User,
      onClick: (e: React.MouseEvent) => {
        if (!user && pathname !== "/account") {
          // You can navigate to account or open modal
        }
      },
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      badge: totalItems,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] px-1 transition ${
                isActive
                  ? "text-[#005b4f] font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="relative">
                <IconComponent className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ffc400] px-1 text-[10px] font-black text-black shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-none font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Lock,
  ExternalLink,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pb-20 lg:pb-0 border-t border-slate-900">
      {/* Top Value Propositions Banner */}
      <div className="border-b border-slate-900 bg-slate-900/50">
        <div className="container py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005b4f]/20 border border-[#005b4f]/40 text-[#ffc400]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Countrywide Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fast shipping across all 47 Kenyan counties</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005b4f]/20 border border-[#005b4f]/40 text-[#ffc400]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Up to 10-Year Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">Genuine Tier-1 solar equipment</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005b4f]/20 border border-[#005b4f]/40 text-[#ffc400]">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Secure M-Pesa & Card</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant STK Push & Bank Wire</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005b4f]/20 border border-[#005b4f]/40 text-[#ffc400]">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Expert Engineering</h4>
              <p className="text-xs text-slate-400 mt-0.5">System sizing & professional setup</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/ecovolt-logo.png"
              alt="EcoVolt Nexus"
              width={120}
              height={50}
              className="rounded-lg bg-white p-1.5"
            />
          </div>

          <p className="text-xs leading-6 text-slate-400">
            Kenya&apos;s leading solar energy marketplace, delivering certified Tier-1 panels, hybrid inverters, lithium batteries, and complete power packages nationwide.
          </p>

          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Follow Us</p>
            <div className="flex flex-wrap gap-2">
              {["Instagram", "TikTok", "WhatsApp", "Facebook", "YouTube"].map(
                (platform) => (
                  <a
                    key={platform}
                    href="#"
                    aria-label={platform}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold transition hover:bg-[#005b4f] hover:text-white"
                  >
                    {platform.charAt(0)}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-[#ffc400]">Solar Equipment</h3>

          <ul className="space-y-2.5 text-xs font-semibold">
            {["Solar Panels", "Inverters", "Lithium Batteries", "Solar Kits", "Charge Controllers", "Accessories"].map((item) => (
              <li key={item}>
                <Link href="/shop" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition group">
                  <ChevronRight className="h-3 w-3 text-[#005b4f] group-hover:translate-x-0.5 transition" />
                  <span>{item}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-[#ffc400]">Customer Care</h3>

          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link href="/track-order" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition group">
                <ChevronRight className="h-3 w-3 text-[#005b4f] group-hover:translate-x-0.5 transition" />
                <span>Track Order Status</span>
              </Link>
            </li>
            <li>
              <Link href="/account" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition group">
                <ChevronRight className="h-3 w-3 text-[#005b4f] group-hover:translate-x-0.5 transition" />
                <span>My Account & Orders</span>
              </Link>
            </li>
            <li>
              <Link href="/cart" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition group">
                <ChevronRight className="h-3 w-3 text-[#005b4f] group-hover:translate-x-0.5 transition" />
                <span>Shopping Cart</span>
              </Link>
            </li>
            <li>
              <Link href="/projects" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition group">
                <ChevronRight className="h-3 w-3 text-[#005b4f] group-hover:translate-x-0.5 transition" />
                <span>Installation Projects</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-[#ffc400]">Contact EcoVolt</h3>

          <div className="space-y-3 text-xs text-slate-400">
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#005b4f] shrink-0" />
              <span className="font-bold text-white">+254 727 971 171</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#005b4f] shrink-0" />
              <span className="text-slate-300">ecovoltsolar145@gmail.com</span>
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#005b4f] shrink-0 mt-0.5" />
              <span>Moi Avenue, Nairobi, Kenya</span>
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Supported Payments
            </p>
            <p className="text-xs font-extrabold text-white">
              M-Pesa STK • Visa • Mastercard • Bank Transfer
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-950 py-5 text-xs text-slate-400">
        <div className="container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 EcoVolt Nexus. All rights reserved.</p>
          <p className="text-slate-400">Powering Kenya with Clean & Reliable Solar Energy.</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { Settings, Save, Store, Phone, MapPin, Truck, Clock, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("EcoVolt Solar Kenya");
  const [supportEmail, setSupportEmail] = useState("support@ecovolt.co.ke");
  const [supportPhone, setSupportPhone] = useState("+254 700 123 456");
  const [businessAddress, setBusinessAddress] = useState("EcoVolt HQ, Industrial Area, Enterprise Road, Nairobi");
  const [deliveryFeeNairobi, setDeliveryFeeNairobi] = useState(500);
  const [deliveryFeeUpcountry, setDeliveryFeeUpcountry] = useState(1500);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(150000);
  const [announcement, setAnnouncement] = useState("⚡ Free delivery across Nairobi County on orders above KES 150,000!");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  function handleSaveSettings() {
    setSavedMsg("✓ Store settings & delivery configuration updated successfully!");
    setTimeout(() => setSavedMsg(null), 5000);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Settings className="h-6 w-6 text-emerald-400" />
            <span>Storefront & Website Settings</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure business contacts, delivery pricing tiers, header announcement banners & store hours.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg shadow-emerald-950"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs font-extrabold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Identity */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-400" /> Store Profile & Contacts
          </h2>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Store Display Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Customer Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Hotline / WhatsApp Number</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">HQ Store Pick-Up Location Address</label>
              <textarea
                rows={2}
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Logistics & Delivery Tiers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-cyan-400" /> Delivery Fees & Announcement Banner
          </h2>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Nairobi Standard Delivery (KES)</label>
                <input
                  type="number"
                  value={deliveryFeeNairobi}
                  onChange={(e) => setDeliveryFeeNairobi(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Upcountry Delivery (KES)</label>
                <input
                  type="number"
                  value={deliveryFeeUpcountry}
                  onChange={(e) => setDeliveryFeeUpcountry(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Free Delivery Cart Threshold (KES)</label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-bold text-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Sun, BatteryCharging, CheckCircle, Calculator, FileText, Send } from "lucide-react";

type ApplianceItem = {
  id: string;
  name: string;
  watts: number;
  qty: number;
  hours: number;
};

export default function QuotePage() {
  const [propertyType, setPropertyType] = useState("Residential Home");
  const [county, setCounty] = useState("Nairobi");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [appliances, setAppliances] = useState<ApplianceItem[]>([
    { id: "1", name: "LED Lights (House)", watts: 10, qty: 10, hours: 8 },
    { id: "2", name: "Refrigerator / Freezer", watts: 150, qty: 1, hours: 24 },
    { id: "3", name: "Smart TV / Decoder", watts: 100, qty: 1, hours: 5 },
    { id: "4", name: "Microwave Oven", watts: 1000, qty: 1, hours: 0.5 },
  ]);

  const [customApplianceName, setCustomApplianceName] = useState("");
  const [customApplianceWatts, setCustomApplianceWatts] = useState(300);

  const [submittedQuote, setSubmittedQuote] = useState(false);

  function handleQtyChange(id: string, delta: number) {
    setAppliances((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, qty: Math.max(0, app.qty + delta) } : app
      )
    );
  }

  function handleHoursChange(id: string, hours: number) {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, hours } : app))
    );
  }

  function handleAddAppliance() {
    if (!customApplianceName.trim()) return;
    setAppliances((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: customApplianceName.trim(),
        watts: Number(customApplianceWatts) || 200,
        qty: 1,
        hours: 4,
      },
    ]);
    setCustomApplianceName("");
  }

  // Sizing Math Calculations
  const totalDailyEnergyWh = appliances.reduce(
    (acc, item) => acc + item.watts * item.qty * item.hours,
    0
  );

  const totalDailyEnergykWh = (totalDailyEnergyWh / 1000).toFixed(1);

  const peakInstantWatts = appliances.reduce(
    (acc, item) => (item.qty > 0 ? acc + item.watts * item.qty : acc),
    0
  );

  // Recommended Inverter Sizing (with 25% safety margin)
  let recommendedInverterRating = "3.2 KVA 24V Hybrid Inverter";
  let estimatedInverterPrice = 65000;
  if (peakInstantWatts > 3000 || Number(totalDailyEnergykWh) > 12) {
    recommendedInverterRating = "10 KVA 48V Three-Phase Hybrid Inverter";
    estimatedInverterPrice = 245000;
  } else if (peakInstantWatts > 1800 || Number(totalDailyEnergykWh) > 6) {
    recommendedInverterRating = "5.5 KVA 48V Hybrid MPPT Inverter";
    estimatedInverterPrice = 115000;
  }

  // Recommended Solar Panels Sizing (assuming 5.2 peak sun hours in Kenya)
  const requiredPanelWatts = (totalDailyEnergyWh / 5.2) * 1.25;
  const recommendedPanelsQty = Math.max(2, Math.ceil(requiredPanelWatts / 550));
  const estimatedPanelsPrice = recommendedPanelsQty * 16500;

  // Recommended Battery Capacity (assuming 80% Depth of Discharge for LiFePO4)
  const requiredBatterykWh = Math.max(2.5, Math.ceil((totalDailyEnergyWh / 1000) * 1.2 * 10) / 10);
  let recommendedBatteryType = "5.12 kWh 100Ah Lithium LiFePO4 Battery";
  let estimatedBatteryPrice = 145000;
  if (requiredBatterykWh > 10) {
    recommendedBatteryType = "15.3 kWh Wall-Mounted Lithium Battery";
    estimatedBatteryPrice = 380000;
  } else if (requiredBatterykWh > 6) {
    recommendedBatteryType = "10.2 kWh Rack Lithium Storage Pack";
    estimatedBatteryPrice = 260000;
  }

  const estimatedTotalPackage = estimatedInverterPrice + estimatedPanelsPrice + estimatedBatteryPrice + 35000; // includes installation & accessories

  function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    setSubmittedQuote(true);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Banner */}
      <section className="bg-[#003f36] text-white py-12">
        <div className="container text-center space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-[#ffc400] text-black text-xs font-black uppercase tracking-wider">
            Interactive Solar Calculator
          </span>
          <h1 className="text-3xl font-black">Get Free Instant Solar Sizing Quote</h1>
          <p className="text-xs text-emerald-100">
            Select your appliances to calculate recommended inverter wattage, panel count, battery bank size, and estimated cost in Kenya.
          </p>
        </div>
      </section>

      <section className="container py-10 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Appliance Sizing Calculator */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#005b4f]" />
                  <h2 className="text-base font-extrabold text-slate-900">
                    Step 1: Choose Property & Appliances
                  </h2>
                </div>

                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
                >
                  <option>Residential Home</option>
                  <option>Commercial Office</option>
                  <option>Dairy / Poultry Farm</option>
                  <option>Water Pumping</option>
                </select>
              </div>

              {/* Appliances Table */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-700">Daily Running Appliances List:</p>

                <div className="divide-y divide-slate-100">
                  {appliances.map((app) => (
                    <div key={app.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800">{app.name}</p>
                        <p className="text-[10px] text-slate-500">{app.watts} Watts each</p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity */}
                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(app.id, -1)}
                            className="px-2 py-1 font-bold text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold text-slate-900">{app.qty}</span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(app.id, 1)}
                            className="px-2 py-1 font-bold text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>

                        {/* Hours */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={24}
                            value={app.hours}
                            onChange={(e) => handleHoursChange(app.id, Number(e.target.value))}
                            className="h-8 w-12 rounded-lg border border-slate-200 px-1.5 text-center font-mono font-bold text-slate-800 outline-none"
                          />
                          <span className="text-[10px] text-slate-500">hrs/day</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Appliance */}
                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Water Pump, Iron Box, Washing Machine"
                    value={customApplianceName}
                    onChange={(e) => setCustomApplianceName(e.target.value)}
                    className="h-9 flex-1 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Watts"
                    value={customApplianceWatts}
                    onChange={(e) => setCustomApplianceWatts(Number(e.target.value))}
                    className="h-9 w-20 rounded-xl border border-slate-300 px-2 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddAppliance}
                    className="rounded-xl bg-[#005b4f] px-3.5 text-xs font-bold text-white hover:bg-[#00483e]"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Sizing Recommendation Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border-2 border-emerald-600 bg-white p-6 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                  Calculated Sizing
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {totalDailyEnergykWh} kWh / day
                </span>
              </div>

              {/* Recommended Equipment */}
              <div className="space-y-3">
                <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-3.5 flex items-start gap-3">
                  <Zap className="h-5 w-5 text-[#005b4f] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                      Recommended Hybrid Inverter
                    </p>
                    <p className="text-xs font-extrabold text-slate-900">{recommendedInverterRating}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-3.5 flex items-start gap-3">
                  <Sun className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                      Recommended Monocrystalline Solar Array
                    </p>
                    <p className="text-xs font-extrabold text-slate-900">
                      {recommendedPanelsQty}x 550W Tier-1 Panels ({(recommendedPanelsQty * 0.55).toFixed(2)} kW total)
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-50/80 border border-blue-200 p-3.5 flex items-start gap-3">
                  <BatteryCharging className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                      Recommended Lithium Storage
                    </p>
                    <p className="text-xs font-extrabold text-slate-900">{recommendedBatteryType}</p>
                  </div>
                </div>
              </div>

              {/* Price Estimate */}
              <div className="rounded-2xl bg-slate-900 text-white p-4 text-center space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Total Turnkey Investment
                </p>
                <p className="text-2xl font-black text-[#ffc400]">
                  KES {estimatedTotalPackage.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400">
                  Includes panels, inverter, battery, cables, mounting racks & installation.
                </p>
              </div>

              {/* Form to submit quote to solar engineers */}
              {submittedQuote ? (
                <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-center text-xs text-emerald-900 font-bold space-y-1">
                  <p>✓ Solar quotation request submitted successfully!</p>
                  <p className="text-[11px] font-medium">An EPRA engineer will call {customerPhone || "you"} with formal PDF proposal.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-800">
                    Step 2: Send Quote to EPRA Engineer
                  </p>

                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />

                    <input
                      type="text"
                      placeholder="County (e.g. Kiambu)"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] text-xs font-bold text-white transition hover:bg-[#00483e] active:scale-[0.99] shadow"
                  >
                    <Send className="h-4 w-4" />
                    <span>Get Formal Written Proposal</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

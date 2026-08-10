"use client";

import { useState } from "react";
import { Truck, Phone, User, Calendar, MapPin, CheckCircle, Clock, Send } from "lucide-react";

type DeliveryDispatch = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  destination: string;
  courierName: string;
  driverName: string;
  driverPhone: string;
  dispatchDate: string;
  eta: string;
  status: "Ready for Pickup" | "In Transit" | "Delivered" | "Delayed";
  notes: string;
};

const mockDeliveries: DeliveryDispatch[] = [
  {
    id: "del-1",
    orderNumber: "EVN-260730-A1B2C3",
    customerName: "Dr. Evans Kimani",
    phone: "+254 722 123 456",
    destination: "Karen, Nairobi County",
    courierName: "EcoVolt Logistics Express",
    driverName: "Joseph Mwangi",
    driverPhone: "+254 720 112 233",
    dispatchDate: "2026-07-31 08:30",
    eta: "Today 16:00",
    status: "In Transit",
    notes: "Heavy inverter & 2x 200Ah batteries; use hydraulic lift vehicle.",
  },
  {
    id: "del-2",
    orderNumber: "EVN-260728-K8J7H6",
    customerName: "Grace Wanjiku",
    phone: "+254 711 987 654",
    destination: "Naivasha, Nakuru County",
    courierName: "Wells Fargo Courier",
    driverName: "Peter Ochieng",
    driverPhone: "+254 733 998 877",
    dispatchDate: "2026-07-29 10:00",
    eta: "2026-07-30 14:00",
    status: "Delivered",
    notes: "Customer signed POD at farm gate.",
  },
  {
    id: "del-3",
    orderNumber: "EVN-260725-P5O4N3",
    customerName: "Peter Mwangi",
    phone: "+254 733 456 789",
    destination: "Riru, Kiambu County",
    courierName: "Fargo Courier Kenya",
    driverName: "Unassigned",
    driverPhone: "--",
    dispatchDate: "Pending",
    eta: "Pending",
    status: "Ready for Pickup",
    notes: "Standard solar cable & 300W panel pack.",
  },
];

export default function AdminDeliveryPage() {
  const [deliveries, setDeliveries] = useState<DeliveryDispatch[]>(mockDeliveries);
  const [selectedDel, setSelectedDel] = useState<DeliveryDispatch | null>(null);
  const [courierName, setCourierName] = useState("EcoVolt Logistics Express");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [eta, setEta] = useState("Tomorrow 12:00");

  function handleAssignCourier() {
    if (!selectedDel) return;
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === selectedDel.id
          ? {
              ...d,
              courierName,
              driverName: driverName || "Assigned Driver",
              driverPhone: driverPhone || "+254 700 000 000",
              dispatchDate: new Date().toLocaleString(),
              eta,
              status: "In Transit",
            }
          : d,
      ),
    );
    setSelectedDel(null);
  }

  function markDelivered(id: string) {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Delivered" } : d)),
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Truck className="h-6 w-6 text-emerald-400" />
            <span>Delivery & Courier Logistics</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Assign Kenya couriers, driver contacts, track ETA, and issue SMS dispatch alerts.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-400 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
          Active Shipments in Transit: <span className="text-cyan-400 font-black">{deliveries.filter((d) => d.status === "In Transit").length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deliveries.map((del) => (
          <div key={del.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-black text-emerald-400 text-sm">{del.orderNumber}</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                    del.status === "In Transit"
                      ? "bg-cyan-950 text-cyan-400 border-cyan-800"
                      : del.status === "Delivered"
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}
                >
                  {del.status}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold">Recipient</p>
                  <p className="font-bold text-white">{del.customerName} ({del.phone})</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">Destination</p>
                  <p className="font-semibold text-slate-300 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" /> {del.destination}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-slate-500">Logistics Partner</p>
                  <p className="font-extrabold text-white">{del.courierName}</p>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1">
                    <User className="h-3 w-3 text-emerald-400" /> Driver: {del.driverName} ({del.driverPhone})
                  </p>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-400" /> ETA: {del.eta}
                  </p>
                </div>

                {del.notes && (
                  <p className="text-[11px] text-slate-400 italic">"{del.notes}"</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex justify-end gap-2">
              {del.status === "Ready for Pickup" ? (
                <button
                  onClick={() => {
                    setSelectedDel(del);
                    setDriverName("");
                    setDriverPhone("");
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Assign Driver & Dispatch
                </button>
              ) : del.status === "In Transit" ? (
                <button
                  onClick={() => markDelivered(del.id)}
                  className="w-full py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-xs hover:bg-emerald-900 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Confirm Delivery POD
                </button>
              ) : (
                <span className="text-[11px] text-emerald-400 font-bold">✓ Fulfillment Complete</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assign Modal */}
      {selectedDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <h2 className="text-base font-extrabold text-white mb-1">Assign Courier & Driver</h2>
            <p className="text-xs text-slate-400 mb-4">Order: {selectedDel.orderNumber} ({selectedDel.destination})</p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Courier Service</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none"
                >
                  <option value="EcoVolt Logistics Express">EcoVolt Dedicated Fleet</option>
                  <option value="Wells Fargo Courier">Wells Fargo Courier Kenya</option>
                  <option value="Fargo Courier Kenya">Fargo Courier Kenya</option>
                  <option value="Sendy Freight">Sendy Freight Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Francis Mutua"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Driver Phone Number</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Estimated Delivery Time (ETA)</label>
                <input
                  type="text"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDel(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCourier}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Confirm Dispatch & SMS Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone, Send, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

type NotificationLog = {
  id: string;
  channel: "Email" | "SMS";
  event: string;
  recipient: string;
  status: "Sent" | "Failed";
  timestamp: string;
  content: string;
};

const mockLogs: NotificationLog[] = [
  {
    id: "not-1",
    channel: "Email",
    event: "Low Stock Alert Dispatched",
    recipient: "inventory-alerts@ecovolt.co.ke",
    status: "Sent",
    timestamp: "2026-07-31 08:30",
    content: "Automated alert for 200Ah Battery (Stock: 5, Threshold: 5)",
  },
  {
    id: "not-2",
    channel: "SMS",
    event: "Order Dispatched",
    recipient: "+254 722 123 456",
    status: "Sent",
    timestamp: "2026-07-31 08:31",
    content: "Hi Dr. Evans, your EcoVolt order EVN-260730-A1B2C3 is out for delivery with Joseph Mwangi (+254 720 112 233).",
  },
  {
    id: "not-3",
    channel: "Email",
    event: "Payment Received",
    recipient: "grace.wanjiku@farm.co.ke",
    status: "Sent",
    timestamp: "2026-07-28 09:48",
    content: "Payment of KES 195,000 confirmed for order EVN-260728-K8J7H6.",
  },
];

export default function AdminNotificationsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>(mockLogs);
  const [targetType, setTargetType] = useState<"Email" | "SMS">("SMS");
  const [recipient, setRecipient] = useState("+254 712 345 678");
  const [message, setMessage] = useState("Hi! Your EcoVolt solar order status has been updated.");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  function handleSendBroadcast() {
    setSending(true);
    setStatusMsg(null);

    setTimeout(() => {
      const newLog: NotificationLog = {
        id: `not-${Date.now()}`,
        channel: targetType,
        event: "Manual Broadcast Notification",
        recipient,
        status: "Sent",
        timestamp: new Date().toLocaleString(),
        content: message,
      };
      setLogs([newLog, ...logs]);
      setSending(false);
      setStatusMsg(`✓ ${targetType} notification sent successfully to ${recipient}`);
      setTimeout(() => setStatusMsg(null), 5000);
    }, 1000);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Bell className="h-6 w-6 text-emerald-400" />
            <span>Notifications & Customer SMS Center</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Automated SMS & Email triggers for order receipts, courier updates, payment confirmation & low stock alerts.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs font-extrabold text-emerald-300">
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispatch Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-base font-black text-white">Send Direct Alert</h2>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Communication Channel</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType("SMS")}
                  className={`py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${
                    targetType === "SMS" ? "bg-emerald-950 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <Smartphone className="h-4 w-4" /> SMS Alert
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType("Email")}
                  className={`py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${
                    targetType === "Email" ? "bg-emerald-950 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <Mail className="h-4 w-4" /> Email Message
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Recipient Phone / Email</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Message Body</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white"
              />
            </div>

            <button
              onClick={handleSendBroadcast}
              disabled={sending}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>{sending ? "Transmitting..." : `Dispatch ${targetType}`}</span>
            </button>
          </div>
        </div>

        {/* Transmission Log */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-base font-black text-white">Recent Communication Transmissions</h2>

          <div className="divide-y divide-slate-800/60">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                    {log.channel === "SMS" ? <Smartphone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="font-bold text-white">{log.event}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{log.content}</p>
                    <p className="text-slate-500 text-[10px] mt-1 font-mono">To: {log.recipient}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                    ✓ {log.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

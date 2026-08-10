"use client";

import { useState } from "react";
import { Star, CheckCircle2, EyeOff, MessageSquare, ShieldCheck, Trash2 } from "lucide-react";

type ProductReview = {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Hidden";
  featured: boolean;
  reply?: string;
};

const mockReviews: ProductReview[] = [
  {
    id: "rev-1",
    productName: "Jinko Solar 550W Panel",
    customerName: "Eng. Samuel Njuguna",
    rating: 5,
    comment: "Installed 10 units at my farm in Nyeri. Generating consistent 5.4kWh daily even during cloudy afternoons!",
    date: "2026-07-29",
    status: "Approved",
    featured: true,
    reply: "Thank you Eng. Njuguna! Glad the Jinko N-Type panels are meeting your farm generation targets.",
  },
  {
    id: "rev-2",
    productName: "Felicity Lithium 5kWh Battery",
    customerName: "David Omondi",
    rating: 5,
    comment: "Super quiet battery pack with fast BMS charging. Power outages in Kisumu are no longer a headache.",
    date: "2026-07-25",
    status: "Approved",
    featured: false,
  },
  {
    id: "rev-3",
    productName: "Must 5.5kW Hybrid Inverter",
    customerName: "Anonymous User",
    rating: 1,
    comment: "Spam link http://cheap-crypto-loans.biz visit now!",
    date: "2026-07-24",
    status: "Hidden",
    featured: false,
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>(mockReviews);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  function toggleStatus(id: string, newStatus: "Approved" | "Hidden") {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
  }

  function toggleFeatured(id: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r)),
    );
  }

  function handleSaveReply(id: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r)),
    );
    setReplyingId(null);
    setReplyText("");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <span>Customer Reviews & Moderation</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Approve verified buyer ratings, publish admin responses, and filter spam submissions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`rounded-2xl border bg-slate-950 p-5 space-y-3 transition ${
              rev.status === "Hidden"
                ? "border-red-900/40 bg-red-950/10 opacity-60"
                : "border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-xs font-black text-emerald-400">{rev.productName}</span>
                <p className="text-xs font-bold text-white mt-0.5">
                  {rev.customerName} · <span className="text-slate-400 font-normal">{rev.date}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < rev.rating ? "fill-amber-400" : "text-slate-700"}`}
                    />
                  ))}
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    rev.status === "Approved"
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : "bg-red-950 text-red-400 border-red-800"
                  }`}
                >
                  {rev.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 font-medium">"{rev.comment}"</p>

            {rev.reply && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <p className="text-[10px] font-extrabold uppercase text-emerald-400">Official Store Response</p>
                <p className="text-slate-300 italic">"{rev.reply}"</p>
              </div>
            )}

            {replyingId === rev.id && (
              <div className="pt-2 space-y-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write official store reply..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReplyingId(null)}
                    className="px-3 py-1 rounded-lg border border-slate-800 text-xs font-bold text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveReply(rev.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-xs font-bold text-white"
                  >
                    Publish Response
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex gap-2">
                {rev.status === "Approved" ? (
                  <button
                    onClick={() => toggleStatus(rev.id, "Hidden")}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 font-bold text-[11px]"
                  >
                    Hide / Mark Spam
                  </button>
                ) : (
                  <button
                    onClick={() => toggleStatus(rev.id, "Approved")}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[11px]"
                  >
                    Approve & Publish
                  </button>
                )}

                <button
                  onClick={() => toggleFeatured(rev.id)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                    rev.featured ? "bg-amber-950 text-amber-300 border-amber-800" : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  {rev.featured ? "★ Featured on Page" : "Feature on Store"}
                </button>
              </div>

              {!rev.reply && replyingId !== rev.id && (
                <button
                  onClick={() => {
                    setReplyingId(rev.id);
                    setReplyText("");
                  }}
                  className="text-emerald-400 hover:underline font-bold text-[11px] flex items-center gap-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Reply to Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

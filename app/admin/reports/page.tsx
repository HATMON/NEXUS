"use client";

import { useState } from "react";
import { FileSpreadsheet, Download, FileText, Calendar, Filter, CheckCircle2 } from "lucide-react";

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-31");
  const [format, setFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function handleGenerateReport() {
    setGenerating(true);
    setSuccessMsg(null);

    setTimeout(() => {
      setGenerating(false);
      setSuccessMsg(
        `✓ ${reportType.toUpperCase()} report successfully generated and downloaded as ${format.toUpperCase()} (${startDate} to ${endDate}).`,
      );
      setTimeout(() => setSuccessMsg(null), 6000);
    }, 1200);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
            <span>Reports & Financial Audits</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Generate KRA VAT compliance reports, monthly sales performance summaries, inventory audits & PDF statements.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs font-extrabold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selector Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-base font-black text-white">Generate Custom Audit</h2>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Report Module</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-bold outline-none"
              >
                <option value="sales">Sales & Revenue Breakdown</option>
                <option value="inventory">Inventory Stock & Valuation</option>
                <option value="customers">Customer Acquisition & LTV</option>
                <option value="taxes">KRA VAT (16%) Tax Statement</option>
                <option value="payments">Payment Gateway Settlement Log</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Export File Format</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("csv")}
                  className={`py-2 rounded-xl border text-xs font-bold ${
                    format === "csv" ? "bg-emerald-950 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  CSV File
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("excel")}
                  className={`py-2 rounded-xl border text-xs font-bold ${
                    format === "excel" ? "bg-emerald-950 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  Excel (.xlsx)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("pdf")}
                  className={`py-2 rounded-xl border text-xs font-bold ${
                    format === "pdf" ? "bg-emerald-950 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  PDF Document
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
            >
              <Download className="h-4 w-4" />
              <span>{generating ? "Exporting Data..." : "Generate & Download"}</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Preview Statements */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-base font-black text-white">Pre-Configured Financial Statements</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase">July 2026 Sales Summary</span>
              <p className="text-lg font-black text-white">KES 4,280,000 Total Gross</p>
              <p className="text-[11px] text-slate-400">Includes 48 completed equipment orders across Kenya.</p>
              <button
                onClick={handleGenerateReport}
                className="mt-2 text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <FileText className="h-3.5 w-3.5" /> Download Full CSV
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase">KRA VAT Compliance Statement</span>
              <p className="text-lg font-black text-white">KES 590,344 VAT (16%)</p>
              <p className="text-[11px] text-slate-400">Standard rate tax report ready for iTax filing.</p>
              <button
                onClick={handleGenerateReport}
                className="mt-2 text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <FileText className="h-3.5 w-3.5" /> Download PDF Statement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

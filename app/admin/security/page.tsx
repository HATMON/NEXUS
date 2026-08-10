"use client";

import { useState } from "react";
import { ShieldAlert, Database, Lock, Key, RefreshCw, CheckCircle2, Download } from "lucide-react";

type BackupFile = {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: "Automated Daily" | "Manual Snapshot";
};

const initialBackups: BackupFile[] = [
  {
    id: "bak-1",
    name: "ecovolt_full_db_2026-07-31_0000.json",
    size: "14.2 MB",
    createdAt: "2026-07-31 00:00:00",
    type: "Automated Daily",
  },
  {
    id: "bak-2",
    name: "ecovolt_full_db_2026-07-30_0000.json",
    size: "13.9 MB",
    createdAt: "2026-07-30 00:00:00",
    type: "Automated Daily",
  },
];

export default function AdminSecurityPage() {
  const [backups, setBackups] = useState<BackupFile[]>(initialBackups);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  function handleCreateBackup() {
    setCreatingBackup(true);
    setStatusMsg(null);

    setTimeout(() => {
      const newBak: BackupFile = {
        id: `bak-${Date.now()}`,
        name: `ecovolt_manual_snapshot_${new Date().toISOString().slice(0, 10)}.json`,
        size: "14.5 MB",
        createdAt: new Date().toLocaleString(),
        type: "Manual Snapshot",
      };
      setBackups([newBak, ...backups]);
      setCreatingBackup(false);
      setStatusMsg("✓ Full database snapshot generated successfully!");
      setTimeout(() => setStatusMsg(null), 5000);
    }, 1200);
  }

  function handleRestore(name: string) {
    if (confirm(`Are you sure you want to restore database from '${name}'? Current state will be archived.`)) {
      setStatusMsg(`✓ Database successfully restored from snapshot: ${name}`);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-emerald-400" />
            <span>Security Policies & Database Backups</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create on-demand system backups, restore database snapshots, enforce 2FA and manage active session timeouts.
          </p>
        </div>

        <button
          onClick={handleCreateBackup}
          disabled={creatingBackup}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg shadow-emerald-950"
        >
          <Database className="h-4 w-4" />
          <span>{creatingBackup ? "Archiving..." : "Create On-Demand Backup"}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs font-extrabold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Policy Settings */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-400" /> Administrative Security Controls
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <p className="font-extrabold text-white">Require Two-Factor Auth (2FA)</p>
                <p className="text-[11px] text-slate-400">Enforce TOTP authenticator app for staff logins.</p>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  twoFactor ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {twoFactor ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <p className="font-extrabold text-white">Inactivity Session Timeout</p>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-bold"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes (Standard)</option>
                <option value="480">8 Hours (End of Shift)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database Snapshots */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" /> Saved Database Snapshots
          </h2>

          <div className="divide-y divide-slate-800/60">
            {backups.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-mono font-bold text-white text-xs">{b.name}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    {b.size} · {b.type} · {b.createdAt}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(b.name)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 font-bold text-[11px]"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

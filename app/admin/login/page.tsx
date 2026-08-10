"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Lock, Phone, KeyRound, ShieldCheck, Mail, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, sendAdminResetOtp, verifyAdminResetOtp, adminEmail, adminResetPhone } = useAuthStore();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("0727 971171");
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const [newPasscodeInput, setNewPasscodeInput] = useState("");
  const [simulatedSms, setSimulatedSms] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsAuthenticating(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();
      setIsAuthenticating(false);

      if (data.success) {
        loginAdmin();
        router.push("/admin");
      } else {
        setError(data.message || "Incorrect admin passcode.");
      }
    } catch (err) {
      setIsAuthenticating(false);
      setError("Failed to connect to authentication server. Please try again.");
    }
  }

  async function handleSendOtp() {
    setResetError(null);
    setResetLoading(true);

    try {
      const res = await fetch("/api/admin/reset-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", phoneInput }),
      });
      const data = await res.json();
      setResetLoading(false);

      if (data.success) {
        setResetStep("otp");
        if (data.otpCode) {
          setSimulatedSms(`📱 SMS: EcoVolt Admin verification code is [${data.otpCode}]`);
          setOtpCodeInput(data.otpCode);
        }
      } else {
        setResetError(data.message);
      }
    } catch {
      setResetLoading(false);
      setResetError("Failed to dispatch OTP. Please check network connection.");
    }
  }

  async function handleVerifyAndReset() {
    setResetError(null);
    setResetLoading(true);

    try {
      const res = await fetch("/api/admin/reset-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-reset", code: otpCodeInput, newPasscode: newPasscodeInput }),
      });
      const data = await res.json();
      setResetLoading(false);

      if (data.success) {
        setShowResetModal(false);
        setPasscode(newPasscodeInput);
        setSuccessMsg(data.message);
        setSimulatedSms(null);
        setResetStep("phone");
      } else {
        setResetError(data.message);
      }
    } catch {
      setResetLoading(false);
      setResetError("Failed to verify reset code.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              EcoVolt System Security
            </span>
          </div>

          <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-400 px-2.5 py-1 rounded-full border border-slate-800">
            v2.6 Secure
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-black text-white flex items-center gap-2.5">
          <ShieldCheck className="h-7 w-7 text-emerald-400" />
          <span>Admin Portal Login</span>
        </h1>

        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate">Admin ID: <strong className="text-white">{adminEmail}</strong></span>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-800/50 bg-red-950/60 p-3 text-xs font-semibold text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Admin Security Passcode</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowResetModal(true);
                  setResetStep("phone");
                  setResetError(null);
                }}
                className="text-[11px] font-bold text-emerald-400 hover:underline"
              >
                Forgot Passcode?
              </button>
            </div>

            <input
              type="password"
              placeholder="Enter admin security passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-mono text-white placeholder-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="h-12 w-full rounded-xl bg-emerald-600 font-extrabold text-white transition hover:bg-emerald-500 active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 disabled:opacity-60"
          >
            {isAuthenticating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Authenticate Admin</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500">
          Return to <a href="/" className="underline text-slate-400 hover:text-white">Customer Storefront</a>
        </div>
      </div>

      {/* Passcode Reset OTP Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-emerald-400" />
                <span>Reset Admin Passcode via OTP</span>
              </h2>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-900"
              >
                ✕
              </button>
            </div>

            {simulatedSms && (
              <div className="p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/60 text-xs text-cyan-200 font-mono flex items-start gap-2 animate-bounce">
                <Phone className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-[11px]">Simulated SMS Notification</p>
                  <p className="mt-0.5">{simulatedSms}</p>
                </div>
              </div>
            )}

            {resetError && (
              <div className="p-3 rounded-xl border border-red-800/50 bg-red-950/60 text-xs font-semibold text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetStep === "phone" ? (
              <div className="space-y-4 text-xs">
                <p className="text-slate-300">
                  Enter the registered admin mobile phone number to receive a 6-digit verification OTP.
                </p>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Registered Admin Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="e.g. 0727 971171"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-white font-mono font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Verification OTP will be dispatched to 0727 971171.</p>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={resetLoading}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2"
                >
                  {resetLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Send SMS Verification OTP →"}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-300">
                  Enter the 6-digit OTP code sent to <strong className="text-white">0727 971171</strong> along with your new passcode.
                </p>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">6-Digit Verification OTP</label>
                  <input
                    type="text"
                    value={otpCodeInput}
                    onChange={(e) => setOtpCodeInput(e.target.value)}
                    placeholder="Enter OTP (e.g. 894215)"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-mono font-bold tracking-widest text-center text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">New Admin Passcode</label>
                  <input
                    type="password"
                    value={newPasscodeInput}
                    onChange={(e) => setNewPasscodeInput(e.target.value)}
                    placeholder="Enter new security passcode"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setResetStep("phone")}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-bold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyAndReset}
                    disabled={resetLoading}
                    className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition flex items-center justify-center gap-2"
                  >
                    {resetLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Verify & Save Passcode"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}


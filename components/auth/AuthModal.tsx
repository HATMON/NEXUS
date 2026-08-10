"use client";

import { FormEvent, useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { User, Phone, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithGoogle,
    registerUser,
    confirmRegistrationOtp,
    sendOtp,
    verifyOtp,
    pendingRegistration,
    pendingOtpTarget,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
  const [step, setStep] = useState<"form" | "otp">("form");

  // Sign Up form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Log In form state
  const [loginInput, setLoginInput] = useState("");

  // OTP state
  const [otpInput, setOtpInput] = useState("");
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith(".run.app") && !origin.includes("localhost")) {
        return;
      }
      if (event.data?.type === "OAUTH_AUTH_SUCCESS" && event.data?.user) {
        const u = event.data.user;
        loginWithGoogle({
          name: u.name || "Google User",
          email: u.email || "user@gmail.com",
          avatar: u.avatar,
        });
        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [loginWithGoogle]);

  if (!isAuthModalOpen) return null;

  async function handleGoogleClick() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/google/url");
      const data = await res.json();

      if (data.configured && data.url) {
        const popup = window.open(
          data.url,
          "google_oauth_popup",
          "width=550,height=650"
        );
        if (!popup) {
          setError("Please allow popups to complete Google Sign-In.");
          setLoading(false);
        }
      } else {
        setTimeout(() => {
          loginWithGoogle({
            name: "Google Customer",
            email: email.trim() || loginInput.trim() || "customer.google@gmail.com",
            phone: phone.trim() || "+254712345678",
          });
          setLoading(false);
        }, 400);
      }
    } catch {
      setTimeout(() => {
        loginWithGoogle({
          name: "Google Customer",
          email: email.trim() || loginInput.trim() || "customer.google@gmail.com",
        });
        setLoading(false);
      }, 400);
    }
  }

  function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter First Name and Last Name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = registerUser({
        firstName,
        lastName,
        phone,
        email,
      });

      setLoading(false);

      if (!res.success) {
        setError(res.message);
      } else {
        setStep("otp");
        setSimulatedOtpNotice(`SMS to ${phone} & Email to ${email}: Verification OTP code is [${res.otpCode}]`);
        setOtpInput(res.otpCode);
      }
    }, 400);
  }

  function handleLogIn(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!loginInput.trim()) {
      setError("Please enter your Phone Number or Email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = sendOtp(loginInput);
      setLoading(false);

      if (!res.success) {
        setError(res.message);
      } else {
        setStep("otp");
        setSimulatedOtpNotice(`SMS/Email to ${loginInput}: OTP code is [${res.otpCode || "849201"}]`);
        setOtpInput(res.otpCode || "849201");
      }
    }, 400);
  }

  function handleConfirmOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!otpInput || otpInput.trim().length < 4) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (pendingRegistration) {
        const res = confirmRegistrationOtp(otpInput);
        setLoading(false);
        if (!res.success) {
          setError(res.message);
        }
      } else {
        const u = verifyOtp(otpInput);
        setLoading(false);
        if (!u) {
          setError("Invalid OTP code. Try again.");
        }
      }
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="bg-[#00483e] px-6 py-5 text-white">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close dialog"
          >
            ✕
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ffc400]"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#ffc400]">
              EcoVolt Customer Account
            </span>
          </div>

          <h2 className="mt-1 text-xl font-extrabold">
            {step === "otp" ? "Confirm Verification Code" : "Sign Up or Log In"}
          </h2>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === "form" ? (
            <>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setError(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-extrabold transition ${
                    activeTab === "signup"
                      ? "bg-[#005b4f] text-white shadow"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Create Account
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setError(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-extrabold transition ${
                    activeTab === "login"
                      ? "bg-[#005b4f] text-white shadow"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Log In
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                  ⚠️ {error}
                </div>
              )}

              {activeTab === "signup" ? (
                /* Sign Up Form */
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Kamau"
                        className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712 345 678"
                      className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.kamau@gmail.com"
                      className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>OTP code sent to both phone & email to confirm.</span>
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] text-xs font-bold text-white transition hover:bg-[#00483e] active:scale-[0.99] disabled:opacity-60 shadow"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Register Account</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Log In Form */
                <form onSubmit={handleLogIn} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Phone Number or Email
                    </label>
                    <input
                      type="text"
                      required
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="0712 345 678 or customer@gmail.com"
                      className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] text-xs font-bold text-white transition hover:bg-[#00483e] active:scale-[0.99] disabled:opacity-60 shadow"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Get OTP Code</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Option 2 Divider */}
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Or Option 2
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google Log In Button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 transition hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99] disabled:opacity-60"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </>
          ) : (
            /* OTP Verification Screen */
            <form onSubmit={handleConfirmOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-slate-700 font-semibold">
                  OTP Code sent to{" "}
                  <strong>
                    {pendingRegistration
                      ? `${pendingRegistration.phone} & ${pendingRegistration.email}`
                      : pendingOtpTarget}
                  </strong>
                </p>
              </div>

              {simulatedOtpNotice && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] text-emerald-800 font-mono">
                  {simulatedOtpNotice}
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs font-bold text-red-700">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  className="h-12 w-full rounded-xl border-2 border-emerald-600 text-center font-mono text-xl font-extrabold text-slate-900 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] text-xs font-bold text-white transition hover:bg-[#00483e] active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm & Sign In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { User, Phone, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    registerUser,
    confirmRegistrationOtp,
    sendOtp,
    verifyOtp,
    loginWithGoogle,
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
  const [loginPassword, setLoginPassword] = useState("");

  // OTP state
  const [otpInput, setOtpInput] = useState("");
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to account
  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  // Google OAuth Popup Message Listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith(".run.app") && !origin.includes("localhost")) {
        return;
      }
      if (event.data?.type === "OAUTH_AUTH_SUCCESS" && event.data?.user) {
        const u = event.data.user;
        loginWithGoogle({
          name: u.name || "Google Customer",
          email: u.email || "user@gmail.com",
          avatar: u.avatar,
        });
        setLoading(false);
        router.push("/account");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [loginWithGoogle, router]);

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
        // Mock fallback for preview mode
        setTimeout(() => {
          loginWithGoogle({
            name: "Google Customer",
            email: email.trim() || loginInput.trim() || "customer.google@gmail.com",
            phone: phone.trim() || "+254712345678",
          });
          setLoading(false);
          router.push("/account");
        }, 500);
      }
    } catch {
      setTimeout(() => {
        loginWithGoogle({
          name: "Google Customer",
          email: email.trim() || loginInput.trim() || "customer.google@gmail.com",
        });
        setLoading(false);
        router.push("/account");
      }, 500);
    }
  }

  function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter both First Name and Last Name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setError("Please enter a valid Kenyan phone number (e.g. 0712 345 678).");
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
        setSimulatedOtpNotice(`📱 SMS to ${phone} & 📧 Email to ${email}: EcoVolt Verification OTP code is [${res.otpCode}]`);
        setOtpInput(res.otpCode); // Pre-fill for instant verification testing
      }
    }, 500);
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
        setSimulatedOtpNotice(`📱 SMS / 📧 Email notification to ${loginInput}: EcoVolt login code is [${res.otpCode || "849201"}]`);
        setOtpInput(res.otpCode || "849201");
      }
    }, 500);
  }

  function handleConfirmOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!otpInput || otpInput.trim().length < 4) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (pendingRegistration) {
        const res = confirmRegistrationOtp(otpInput);
        setLoading(false);
        if (!res.success) {
          setError(res.message);
        } else {
          setSuccessMsg("Account successfully verified and created!");
          router.push("/account");
        }
      } else {
        const userObj = verifyOtp(otpInput);
        setLoading(false);
        if (!userObj) {
          setError("Invalid verification code. Please try again.");
        } else {
          setSuccessMsg("Logged in successfully!");
          router.push("/account");
        }
      }
    }, 500);
  }

  return (
    <main className="min-h-[85vh] bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-90 transition">
            <img
              src="/images/ecovolt-logo.png"
              alt="EcoVolt Nexus"
              className="h-12 w-auto mx-auto object-contain"
            />
          </Link>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Kenya&apos;s Certified Solar Equipment Marketplace
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
          {step === "form" ? (
            <>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setError(null);
                  }}
                  className={`rounded-xl py-2.5 text-xs font-extrabold transition ${
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
                  className={`rounded-xl py-2.5 text-xs font-extrabold transition ${
                    activeTab === "login"
                      ? "bg-[#005b4f] text-white shadow"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Log In
                </button>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-bold text-red-700">
                  ⚠️ {error}
                </div>
              )}

              {/* Option 1: Main Form (Sign Up or Log In) */}
              {activeTab === "signup" ? (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Kamau"
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (SMS OTP) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0712 345 678"
                        className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.kamau@gmail.com"
                        className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password (Optional)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>An OTP code will be sent to both phone & email to confirm ownership.</span>
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] text-sm font-bold text-white transition hover:bg-[#00453b] active:scale-[0.99] disabled:opacity-60 shadow-md shadow-emerald-950/20"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Register Account</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Log In Form */
                <form onSubmit={handleLogIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number or Email
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="0712 345 678 or customer@gmail.com"
                        className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password (or leave blank for 1-click OTP)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] text-sm font-bold text-white transition hover:bg-[#00453b] active:scale-[0.99] disabled:opacity-60 shadow-md shadow-emerald-950/20"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Log In with OTP</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Or Option 2
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Option 2: Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-800 transition hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99] disabled:opacity-60 shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
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

              <p className="mt-4 text-center text-[11px] text-slate-500">
                Signing in with Google uses your registered email address to link directly to your existing account.
              </p>
            </>
          ) : (
            /* OTP Verification Screen */
            <div className="space-y-5">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 text-2xl">
                  📱
                </div>
                <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                  Enter 6-Digit OTP Code
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Verification code dispatched to{" "}
                  <strong className="text-slate-900">
                    {pendingRegistration
                      ? `${pendingRegistration.phone} & ${pendingRegistration.email}`
                      : pendingOtpTarget}
                  </strong>
                </p>
              </div>

              {simulatedOtpNotice && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-mono font-medium">
                  {simulatedOtpNotice}
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleConfirmOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="h-12 w-full rounded-xl border-2 border-emerald-600 text-center font-mono text-xl font-extrabold tracking-widest text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] text-sm font-bold text-white transition hover:bg-[#00453b] active:scale-[0.99] disabled:opacity-60"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Confirm & Access Account</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setError(null);
                  }}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 pt-2"
                >
                  ← Back to Form
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

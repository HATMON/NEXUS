"use client";

import { useState, FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("Nairobi");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <section className="bg-[#003f36] text-white py-14">
        <div className="container text-center space-y-3 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-[#ffc400] text-black text-xs font-black uppercase tracking-wider">
            We Are Here To Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Contact EcoVolt Nexus</h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            Have questions about solar panels, hybrid inverters, or battery sizing? Speak to our EPRA-certified engineers today.
          </p>
        </div>
      </section>

      <section className="container py-12 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Direct Phone / Call</h3>
              <p className="text-xs text-slate-600">Mon - Sat: 8:00 AM – 6:00 PM</p>
              <a
                href="tel:+254727971171"
                className="block text-sm font-black text-[#005b4f] hover:underline"
              >
                +254 727 971 171
              </a>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Official Email</h3>
              <p className="text-xs text-slate-600">Send inquiries or RFQs anytime</p>
              <a
                href="mailto:ecovoltsolar145@gmail.com"
                className="block text-xs font-bold text-slate-800 hover:underline break-all"
              >
                ecovoltsolar145@gmail.com
              </a>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Physical Showroom</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                EcoVolt Plaza, Moi Avenue, Nairobi City Centre, Kenya
              </p>
            </div>

            {/* WhatsApp Quick Link */}
            <a
              href="https://wa.me/254727971171?text=Hello%20EcoVolt%20Solar,%20I%20have%20an%20inquiry%20regarding%20solar%20products."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 p-4 font-bold text-white text-xs hover:bg-emerald-700 transition shadow"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat directly on WhatsApp (+254 727 971 171)</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 text-3xl">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you <strong>{name}</strong>. Our solar specialist will review your inquiry and contact you at <strong>{phone || email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl bg-[#005b4f] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#00483e]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900">Send Us A Message</h2>
                <p className="text-xs text-slate-500">
                  Fill out the form below and an engineer will respond within 1 business hour.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Kamau"
                      className="h-11 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0727 971 171"
                      className="h-11 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="h-11 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      County / Location
                    </label>
                    <input
                      type="text"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      placeholder="e.g. Nakuru, Nairobi, Kiambu"
                      className="h-11 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 px-3 text-xs outline-none focus:border-emerald-600 bg-white"
                  >
                    <option>General Product Inquiry</option>
                    <option>Solar System Sizing / Sizing Quote</option>
                    <option>Borehole Water Pumping System</option>
                    <option>Order Tracking / Delivery Support</option>
                    <option>Wholesale & Dealer Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your power requirements or questions..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#005b4f] text-xs font-bold text-white hover:bg-[#00483e] transition"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

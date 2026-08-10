import Link from "next/link";
import { ShieldCheck, Award, Truck, Zap, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us | EcoVolt Nexus Kenya",
  description: "Learn about EcoVolt Nexus, Kenya's premier certified solar supplier, Tier-1 equipment warranties, and expert engineering team.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Banner */}
      <section className="bg-[#003f36] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container relative z-10 max-w-5xl text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#ffc400] text-black text-xs font-black uppercase tracking-wider">
            Kenya&apos;s Tier-1 Solar Leader
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Powering Kenyan Homes & Businesses with Clean Energy
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            EcoVolt Nexus is a trusted renewable energy supplier in East Africa. We import and distribute certified monocrystalline panels, hybrid solar inverters, lithium iron phosphate (LiFePO4) batteries, and complete off-grid water pumping solutions.
          </p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="container -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-black text-[#005b4f]">5,200+</p>
            <p className="text-xs font-bold text-slate-600 mt-1">Solar Systems Installed</p>
          </div>

          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-black text-[#005b4f]">12.5 MW</p>
            <p className="text-xs font-bold text-slate-600 mt-1">Total Capacity Deployed</p>
          </div>

          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-black text-[#005b4f]">47</p>
            <p className="text-xs font-bold text-slate-600 mt-1">Kenyan Counties Covered</p>
          </div>

          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-black text-[#005b4f]">10 Years</p>
            <p className="text-xs font-bold text-slate-600 mt-1">Equipment Warranty</p>
          </div>
        </div>
      </section>

      {/* Core Values / Why Choose Us */}
      <section className="container py-16 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Choose EcoVolt Nexus?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            We provide genuine equipment directly from global ISO-certified manufacturers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Certified Tier-1 Quality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every solar panel, inverter, and lithium battery comes with verified batch numbers, factory testing datasheets, and manufacturer warranties.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">EPRA Certified Engineers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our engineering team is licensed by the Energy and Petroleum Regulatory Authority (EPRA) to conduct load calculations and oversee installations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-800">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Countrywide Logistics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast, insured door-to-door transit via G4S, Wells Fargo, and local rider networks across Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and all counties.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#005b4f]">
              Our Mission
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Eliminating Power Outages & High Electricity Bills Across Kenya
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kenya&apos;s national grid can suffer from voltage fluctuations and high tariffs. EcoVolt Nexus empowers homes, farms, hospitals, and commercial establishments to generate clean, reliable, free solar energy day and night.
            </p>

            <ul className="space-y-2 pt-2 text-xs font-bold text-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Zero-noise, maintenance-free lithium storage systems</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Submersible borehole solar pumps with automatic dry-run prevention</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Smart mobile app monitoring for real-time solar yield metrics</span>
              </li>
            </ul>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 p-8 text-white space-y-4">
            <div className="text-2xl font-black text-[#ffc400]">EcoVolt Guarantee</div>
            <blockquote className="text-sm italic text-slate-300">
              &quot;We don&apos;t just sell solar components; we guarantee uninterrupted electricity for your home or enterprise with expert support at every step.&quot;
            </blockquote>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">Eng. David Ochieng</p>
                <p className="text-slate-400">Head of Technical Operations</p>
              </div>
              <Link
                href="/contact"
                className="rounded-xl bg-[#005b4f] px-4 py-2 font-bold text-white hover:bg-[#00483e]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pt-16 text-center">
        <div className="bg-[#003f36] text-white rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to Switch to Clean Solar Energy?</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Browse our catalogue of solar panels, 5KVA inverters, lithium batteries, and complete solar kits or request a customized system sizing quote today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/shop"
              className="rounded-xl bg-[#ffc400] px-6 py-3 text-xs font-black text-black transition hover:bg-yellow-400"
            >
              Shop Solar Equipment
            </Link>
            <Link
              href="/quote"
              className="rounded-xl bg-white/10 border border-emerald-400/40 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/20"
            >
              Get Free Solar Quote →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

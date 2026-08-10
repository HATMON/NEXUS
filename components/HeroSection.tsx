import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[#f4f7f8] py-6">
      <div className="container grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003d35] to-[#0f765f] px-7 py-10 text-white md:px-12 md:py-14">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block rounded-full bg-[#ffc400] px-4 py-2 text-xs font-bold text-black">
              PREMIUM SOLAR SOLUTIONS
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Power Your Home With Clean Solar Energy
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-emerald-50 md:text-base">
              Shop high-quality solar panels, inverters, batteries, water pumps
              and complete solar kits for homes, businesses and institutions.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-lg bg-[#ffc400] px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
              >
                Shop Now
              </Link>

              <Link
                href="/projects"
                className="rounded-lg border border-white/50 px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#00483e]"
              >
                View Projects
              </Link>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-[#ffc400]/20" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl bg-[#ffc400] p-6 text-black">
            <p className="text-xs font-bold uppercase tracking-wide">
              Special Offer
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              Solar Kits for Every Budget
            </h2>

            <p className="mt-3 text-sm leading-6">
              Reliable systems for lighting, television, refrigeration and
              business use.
            </p>

            <Link
              href="/shop"
              className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-sm font-bold text-white"
            >
              Explore Kits
            </Link>
          </div>

          <div className="rounded-2xl bg-[#122034] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-wide text-[#ffc400]">
              Expert Support
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              Need Help Choosing a System?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Speak to our solar specialists for product advice and system
              sizing.
            </p>

            <a
              href="tel:+254727971171"
              className="mt-5 inline-block rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-white"
            >
              Call 0727 971 171
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
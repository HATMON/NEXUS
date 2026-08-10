export default function NewsletterCTA() {
  return (
    <section className="bg-[#005b4f] py-16 text-white">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#ffc400]">
              Stay Connected
            </p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              Get Solar Offers, Product Updates and Energy Tips
            </h2>

            <p className="mt-4 text-sm leading-7 text-emerald-50">
              Subscribe for new products, special offers, solar guides and
              EcoVolt Nexus installation updates.
            </p>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              required
              className="h-12 min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-4 text-sm text-slate-900 outline-none"
            />

            <button
              type="submit"
              className="h-12 rounded-xl bg-[#ffc400] px-6 text-sm font-extrabold text-black transition hover:bg-yellow-300"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-10 rounded-2xl bg-white/10 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-extrabold">
                Need a Solar System for Your Home or Business?
              </h3>

              <p className="mt-2 text-sm leading-7 text-emerald-50">
                Our team can help you choose a suitable system for your energy
                requirements and budget.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/quote"
                className="rounded-xl bg-[#ffc400] px-6 py-3 text-center text-sm font-extrabold text-black"
              >
                Get a Free Quote
              </a>

              <a
                href="https://wa.me/254727971171"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/40 px-6 py-3 text-center text-sm font-extrabold text-white"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
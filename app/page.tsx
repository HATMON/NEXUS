import FeaturedBrands from "@/components/homepage/FeaturedBrands";
import CompletedProjects from "@/components/homepage/CompletedProjects";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import Testimonials from "@/components/homepage/Testimonials";
import NewsletterCTA from "@/components/homepage/NewsletterCTA";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { products } from "@/lib/products";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
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
                Shop high-quality solar panels, inverters, batteries, water
                pumps and complete solar kits for homes, businesses and
                institutions.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/shop"
                  className="rounded-lg bg-[#ffc400] px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
                >
                  Shop Now
                </a>

                <a
                  href="/projects"
                  className="rounded-lg border border-white/50 px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#00483e]"
                >
                  View Projects
                </a>
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

              <a
                href="/shop"
                className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-sm font-bold text-white"
              >
                Explore Kits
              </a>
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

      {/* Trust Badges */}
      <section className="container py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Fast Delivery",
              text: "Reliable delivery across Kenya",
            },
            {
              title: "Genuine Products",
              text: "Quality solar products from trusted brands",
            },
            {
              title: "Warranty Support",
              text: "Manufacturer and supplier warranty",
            },
            {
              title: "Expert Assistance",
              text: "Professional advice before and after purchase",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-bold text-[#00483e]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Department */}
      <section className="bg-[#f8fafc] py-12">
        <div className="container">
          <SectionHeader
            title="Shop by Department"
            subtitle="Find the right solar products for your home, business or project."
            actionLabel="See All Categories"
            actionHref="/shop"
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[
              { name: "Solar Panels", icon: "☀" },
              { name: "Inverters", icon: "⚡" },
              { name: "Lithium Batteries", icon: "▰" },
              { name: "Gel Batteries", icon: "▱" },
              { name: "Solar Kits", icon: "◈" },
              { name: "Charge Controllers", icon: "◔" },
              { name: "Solar Water Pumps", icon: "♨" },
              { name: "Solar Street Lights", icon: "💡" },
              { name: "Cables", icon: "🔌" },
              { name: "Accessories", icon: "◇" },
            ].map((category) => (
              <a
                key={category.name}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  {category.icon}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-800">
                  {category.name}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-14">
        <div className="container">
          <SectionHeader
            title="Featured Products"
            subtitle="Explore some of our most trusted solar products for homes, businesses and institutions."
            actionLabel="View All Products"
            actionHref="/shop"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 sm:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose EcoVolt */}
      <WhyChooseUs />

      {/* Completed Projects */}
      <CompletedProjects />

      {/* Featured Brands */}
      <FeaturedBrands />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter and Quote CTA */}
      <NewsletterCTA />
    </div>
  );
}
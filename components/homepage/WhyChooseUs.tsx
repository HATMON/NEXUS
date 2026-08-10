export default function WhyChooseUs() {
  const features = [
    {
      title: "Genuine Solar Products",
      description:
        "We supply high-quality solar panels, inverters, batteries and accessories from trusted manufacturers.",
    },
    {
      title: "Professional Installation",
      description:
        "Our experienced technicians install residential, commercial and industrial solar systems.",
    },
    {
      title: "Expert Consultation",
      description:
        "We help you choose the right solar solution based on your energy requirements and budget.",
    },
    {
      title: "Warranty Support",
      description:
        "Enjoy manufacturer warranties and dependable after-sales support on selected products.",
    },
    {
      title: "Fast Delivery",
      description:
        "Reliable nationwide delivery across Kenya for all solar products and accessories.",
    },
    {
      title: "Affordable Pricing",
      description:
        "Competitive prices without compromising on quality or performance.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
            WHY CHOOSE ECOVOLT NEXUS
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
            Your Trusted Solar Energy Partner
          </h2>

          <p className="mt-4 text-slate-500">
            We provide reliable solar products, expert advice and professional
            support for homes, businesses and institutions throughout Kenya.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
                ✓
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}   
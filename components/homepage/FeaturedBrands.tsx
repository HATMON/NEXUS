export default function FeaturedBrands() {
  const brands = [
    "Jinko",
    "Canadian Solar",
    "LONGi",
    "Growatt",
    "Deye",
    "Victron",
    "Must",
    "Felicity",
    "BYD",
    "SMA",
  ];

  return (
    <section className="bg-white py-16">
      <div className="container">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
            Trusted Manufacturers
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
            Brands We Stock
          </h2>

          <p className="mt-4 text-slate-500">
            We only supply genuine products from globally recognised solar
            manufacturers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <div
              key={brand}
              className="flex h-28 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-lg font-bold text-slate-700">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
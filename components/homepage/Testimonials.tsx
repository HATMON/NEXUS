type Testimonial = {
  name: string;
  role: string;
  location: string;
  rating: number;
  message: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    name: "James Mwangi",
    role: "Homeowner",
    location: "Kiambu",
    rating: 5,
    message:
      "EcoVolt helped me choose the right solar system for my home. The products were genuine, delivery was fast, and the support team was very helpful.",
    initials: "JM",
  },
  {
    name: "Faith Njeri",
    role: "Business Owner",
    location: "Nairobi",
    rating: 5,
    message:
      "The installation was professional and completed on time. My business now has reliable backup power, and I am very satisfied with the system.",
    initials: "FN",
  },
  {
    name: "Peter Otieno",
    role: "Farm Manager",
    location: "Nakuru",
    rating: 5,
    message:
      "We purchased a solar water-pumping system from EcoVolt. The team guided us from product selection to installation, and the system is performing well.",
    initials: "PO",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-16">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
            Customer Reviews
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 md:text-base">
            Trusted by homeowners, businesses and institutions across Kenya.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 font-extrabold text-emerald-700">
                  {testimonial.initials}
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900">
                    {testimonial.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {testimonial.role} · {testimonial.location}
                  </p>
                </div>
              </div>

              <div
                className="mt-5 text-amber-400"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {"★".repeat(testimonial.rating)}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                “{testimonial.message}”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
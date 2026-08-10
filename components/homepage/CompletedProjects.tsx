type Project = {
  title: string;
  category: string;
  location: string;
  system: string;
  image: string;
};

const projects: Project[] = [
  {
    title: "5KVA Residential Solar System",
    category: "Residential",
    location: "Karen, Nairobi",
    system: "5KVA Hybrid System",
    image: "/projects/residential-solar.jpg",
  },
  {
    title: "Commercial Rooftop Solar Installation",
    category: "Commercial",
    location: "Westlands, Nairobi",
    system: "10kW Grid-Tied System",
    image: "/projects/commercial-rooftop.jpg",
  },
  {
    title: "Solar Borehole Pump Installation",
    category: "Agricultural",
    location: "Naivasha, Nakuru",
    system: "1.5HP Solar Pump",
    image: "/projects/solar-water-pump.jpg",
  },
  {
    title: "Solar Street Lights Installation",
    category: "Institutional",
    location: "Kisumu",
    system: "20 × 200W Street Lights",
    image: "/projects/solar-street-lights.jpg",
  },
];

export default function CompletedProjects() {
  return (
    <section className="bg-emerald-50/60 py-16">
      <div className="container">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Our Work
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Completed Solar Projects
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Real solar installations powering homes, businesses, farms and
              institutions across Kenya.
            </p>
          </div>

          <a
            href="/projects"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            View All Projects →
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <a href="/projects" className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-[#ffc400] px-3 py-1 text-xs font-bold text-black">
                    {project.category}
                  </span>

                  <h3 className="absolute bottom-4 left-4 right-4 text-lg font-extrabold leading-tight text-white">
                    {project.title}
                  </h3>
                </div>

                <div className="p-5">
                  <p className="text-sm text-slate-500">
                    📍 {project.location}
                  </p>

                  <p className="mt-2 text-sm font-bold text-emerald-700">
                    {project.system}
                  </p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
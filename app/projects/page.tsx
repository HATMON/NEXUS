import Link from "next/link";
import { CheckCircle, MapPin, Zap, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Projects Gallery | EcoVolt Nexus Kenya",
  description: "Explore completed solar power installation projects across Kenya including hybrid rooftops, borehole pumping systems, and commercial solar microgrids.",
};

const projectItems = [
  {
    id: "proj-1",
    title: "10 KVA Off-Grid Villa Installation",
    location: "Karen, Nairobi County",
    capacity: "10 KVA / 15.3 kWh Storage",
    components: "18x 550W Jinko Monocrystalline Panels, Deye 10kW Hybrid Inverter, Felicity 15kWh LiFePO4 Battery",
    date: "July 2026",
    category: "Residential Hybrid",
    description: "Complete power independence for a 5-bedroom villa with heavy loads including borehole pumps, water heaters, and electric gate.",
    image: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "proj-2",
    title: "7.5 HP Submersible Solar Water Pump",
    location: "Machakos Town, Machakos County",
    capacity: "7.5 HP Pump / 8.8 kW DC Field",
    components: "16x 550W Mono Solar Panels, VEICHI 7.5kW MPPT Pump Inverter, Dayliff Submersible Pump",
    date: "June 2026",
    category: "Agricultural Pumping",
    description: "Provides 45,000 liters of water daily for avocado drip irrigation with zero monthly grid power costs.",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "proj-3",
    title: "15 kW Commercial Poultry Solar Microgrid",
    location: "Naivasha, Nakuru County",
    capacity: "15 kW Continuous / 30 kWh Battery",
    components: "28x 570W Bifacial Solar Panels, Victron Quattro 15kVA Inverter, 3x Felicity 10kWh Lithium Batteries",
    date: "May 2026",
    category: "Commercial Farm",
    description: "Automated climate control and lighting for 25,000 layers with automatic generator backup integration.",
    image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "proj-4",
    title: "5 KVA Off-Grid Townhouse Power System",
    location: "Nyali, Mombasa County",
    capacity: "5 KVA / 10 kWh Storage",
    components: "10x 550W Panels, Growatt 5kW Hybrid Inverter, EcoVolt 10.2kWh Wall Lithium Pack",
    date: "April 2026",
    category: "Residential Backup",
    description: "Seamless automatic transfer switch during coastal grid blackouts, keeping air conditioners and refrigerators running.",
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "proj-5",
    title: "Community Hospital Solar Emergency Power",
    location: "Eldoret, Uasin Gishu County",
    capacity: "20 KVA Three-Phase System",
    components: "36x 550W Mono Solar Panels, Deye 20kW 3-Phase Hybrid Inverter, 2x 15kWh Rack Lithium Batteries",
    date: "March 2026",
    category: "Healthcare & Public",
    description: "Uninterrupted power supply for maternity wards, laboratory refrigerators, and emergency lighting.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <section className="bg-[#003f36] text-white py-14">
        <div className="container text-center space-y-3 max-w-3xl">
          <span className="px-3 py-1 rounded-full bg-[#ffc400] text-black text-xs font-black uppercase tracking-wider">
            Proven Track Record
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            Our Featured Solar Installation Projects
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            From residential townhouses to agricultural water pumps and commercial solar microgrids across all 47 counties in Kenya.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container py-12 space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectItems.map((proj) => (
            <div
              key={proj.id}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col"
            >
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#005b4f] px-3 py-1 text-[10px] font-bold text-white shadow">
                  {proj.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{proj.location}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-xs space-y-1.5">
                    <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-[#005b4f]" />
                      <span>Capacity: {proj.capacity}</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      <strong>Equipment:</strong> {proj.components}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar className="h-3.5 w-3.5" />
                    {proj.date}
                  </span>

                  <Link
                    href="/quote"
                    className="font-bold text-[#005b4f] hover:underline flex items-center gap-1"
                  >
                    <span>Request Similar System</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Need a Customized Solar System for Your Property?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Our EPRA-certified engineers carry out site assessments, load calculations, and turnkey installations nationwide.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/quote"
              className="rounded-xl bg-[#005b4f] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#00483e]"
            >
              Get Custom System Quote
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Speak to Solar Specialist
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

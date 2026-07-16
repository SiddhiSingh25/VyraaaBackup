import { IoArrowForward } from "react-icons/io5";
import { womenPerfume } from "../../../../assets/assets";
import { useReveal } from "../../../../hooks/gsap/useReveal";
import SectionHeader from "../../../../components/Common/Headers/SectionHeader";

interface Collection {
  index: string;
  title: string;
  image: string;
  midLift?: boolean;
}

const COLLECTIONS: Collection[] = [
  {
    index: "01",
    title: "Clothing",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&fit=crop",
  },
  {
    index: "02",
    title: "Perfumes",
    image: womenPerfume,
    midLift: true,
  },
  {
    index: "03",
    title: "Jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop",
  },
];

export default function FeaturedCollections() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-10 px-5 sm:px-10 lg:px-20 ">
    
      <SectionHeader  viewAllLink="/"
  viewAllText = "View All" tagline="Categories"
  title="New on Vyraaa"  />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {COLLECTIONS.map((c) => (
          <div
            key={c.title}
            data-reveal
            className={`group relative overflow-hidden rounded-2xl aspect-[4/5] ${
              c.midLift ? "sm:col-span-2 md:col-span-1 md:-mt-8" : ""
            }`}
          >
            <img
              src={c.image}
              alt={c.title}
              className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-heading/70 via-heading/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">
                {c.index}
              </span>
              <h3 className="font-heading text-white text-2xl sm:text-3xl font-light mb-3 sm:mb-4">
                {c.title}
              </h3>
              <a
                href="#"
                className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/70 flex items-center gap-2 hover:text-white group-hover:gap-4 transition-all duration-300"
              >
                Explore
                <span className="material-symbols-outlined text-[16px]"><IoArrowForward/></span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
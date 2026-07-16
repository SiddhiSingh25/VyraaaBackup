import { BrandStory } from "@/assets/assets";
import { useReveal } from "../../../../hooks/gsap/useReveal";

const NOTES = [
  { label: "Top", value: "Pear", position: "top-[18%] right-[-10%] sm:right-[-15%]" },
  { label: "Heart", value: "Pink Pepper", position: "top-[46%] right-[-6%] sm:right-[-10%]" },
  { label: "Base", value: "Orange Blossom", position: "top-[74%] right-[-12%] sm:right-[-18%]" },
];

export default function SignatureScent() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-10  px-5 sm:px-10 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image side */}
        <div data-reveal className="relative mx-auto w-full max-w-md">
          <div className="relative rounded-t-[200px] rounded-b-2xl border border-border overflow-hidden aspect-[3/4]">
            <img
              src={BrandStory}
              alt="MONCLair NOCTIS Eau de Parfum surrounded by florals, spices, and wood"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Note callouts */}
          {NOTES.map((note) => (
            <div
              key={note.label}
              className={`absolute ${note.position} bg-surface/95 backdrop-blur-sm border border-border rounded-md px-4 py-2 shadow-sm w-[150px]`}
            >
              <p className="text-[9px] font-medium tracking-[0.25em] uppercase text-muted mb-0.5">
                {note.label}
              </p>
              <p className="text-sm text-admin-text">{note.value}</p>
            </div>
          ))}
        </div>

        {/* Copy side */}
        <div data-reveal>
          <span className="flex items-center gap-3 text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-5">
            <span className="w-6 h-px bg-primary" />
            The Signature Scent
          </span>

          <h2 className="font-heading text-admin-text leading-tight text-[clamp(28px,4vw,48px)] font-light mb-6">
            The Essence of
            <br />
            Noctis
          </h2>

          <div className="w-10 h-px bg-border mb-6" />

          <div className="space-y-4 text-body text-sm sm:text-base leading-relaxed">
            <p>
              A bold harmony of dark gourmand richness, sensual florals, and warm woody depth.
              NOCTIS is crafted for those who command attention with quiet confidence and timeless
              sophistication.
            </p>
            <p>
              Opening with luminous Pear, sparkling Pink Pepper, and delicate Orange Blossom, it
              reveals an alluring heart of rich Coffee, Jasmine, Bitter Almond.
            </p>

            <p>
              An oriental-vanilla gourmand fragrance designed for unforgettable evenings, cooler
              nights, and refined presence beyond ordinary.
            </p>
          </div>

          <button className="mt-8 inline-flex items-center gap-2 bg-heading text-surface text-xs font-medium tracking-[0.15em] uppercase px-7 py-3.5 rounded-sm hover:opacity-90 transition-opacity">
            Shop Now
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
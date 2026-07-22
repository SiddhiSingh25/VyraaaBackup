// import { BrandStory } from "@/assets/assets";
// import { useReveal } from "../../../../hooks/gsap/useReveal";
// import { Link, useNavigate } from "react-router-dom";

// const NOTES = [
//   {
//     label: "Top",
//     value: "Pear",
//     position: "top-[18%] right-[-10%] sm:right-[-15%]",
//   },
//   {
//     label: "Heart",
//     value: "Pink Pepper",
//     position: "top-[46%] right-[-6%] sm:right-[-10%]",
//   },
//   {
//     label: "Base",
//     value: "Orange Blossom",
//     position: "top-[74%] right-[-12%] sm:right-[-18%]",
//   },
// ];

// export default function SignatureScent() {
//   const navigate = useNavigate();

//   const ref = useReveal<HTMLElement>();

//   return (
//     <section ref={ref} className="py-10  px-5 sm:px-10 ">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//         {/* Image side */}
//         <div data-reveal className="relative mx-auto w-full max-w-md">
//           <div className="relative rounded-t-[200px] rounded-b-2xl border border-border overflow-hidden aspect-[3/4]">
//             <img
//               src={BrandStory}
//               alt="MONCLair NOCTIS Eau de Parfum surrounded by florals, spices, and wood"
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Note callouts */}
//           {NOTES.map((note) => (
//             <div
//               key={note.label}
//               className={`absolute ${note.position} bg-surface/95 backdrop-blur-sm border border-border rounded-md px-4 py-2 shadow-sm w-[150px]`}
//             >
//               <p className="text-[9px] font-medium tracking-[0.25em] uppercase text-muted mb-0.5">
//                 {note.label}
//               </p>
//               <p className="text-sm text-admin-text">{note.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Copy side */}
//         <div data-reveal>
//           <span className="flex items-center gap-3 text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-5">
//             <span className="w-6 h-px bg-primary" />
//             The Signature Scent
//           </span>

//           <h2 className="font-heading text-admin-text leading-tight text-[clamp(28px,4vw,48px)] font-light mb-6">
//             The Essence of
//             <br />
//             Noctis
//           </h2>

//           <div className="w-10 h-px bg-border mb-6" />

//           <div className="space-y-4 text-body text-sm sm:text-base leading-relaxed">
//             <p>
//               A bold harmony of dark gourmand richness, sensual florals, and
//               warm woody depth. NOCTIS is crafted for those who command
//               attention with quiet confidence and timeless sophistication.
//             </p>
//             <p>
//               Opening with luminous Pear, sparkling Pink Pepper, and delicate
//               Orange Blossom, it reveals an alluring heart of rich Coffee,
//               Jasmine, Bitter Almond.
//             </p>

//             <p>
//               An oriental-vanilla gourmand fragrance designed for unforgettable
//               evenings, cooler nights, and refined presence beyond ordinary.
//             </p>
//           </div>

//           <button
//             onClick={() =>
//               navigate(`/perfume`, {
//                 state: {
//                   categoryId: "6a562a2f017a6045e6d9979b",
//                   fullCategoryData: {
//                     _id: "6a562a2f017a6045e6d9979b",
//                     image:
//                       "https://macreelinfosoft-bucket.s3.ap-south-1.amazonaws.com/Vyraaa-Admin-Images/1784031329965.jpeg",
//                     category: "Perfumes",
//                   },
//                 },
//               })
//             }
//             className="mt-8 inline-flex items-center gap-2 bg-heading text-surface text-xs font-medium tracking-[0.15em] uppercase px-7 py-3.5 rounded-sm hover:opacity-90 transition-opacity"
//           >
//             Shop Now
//             <span aria-hidden="true">→</span>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
import { BrandStory } from "@/assets/assets";
import { useNavigate } from "react-router-dom";
import { motion, useInView, easeOut } from "framer-motion";
import { useRef } from "react";

const NOTES = [
  {
    label: "Top",
    value: "Pear",
    position: "top-[18%] right-[-10%] sm:right-[-15%]",
  },
  {
    label: "Heart",
    value: "Pink Pepper",
    position: "top-[46%] right-[-6%] sm:right-[-10%]",
  },
  {
    label: "Base",
    value: "Orange Blossom",
    position: "top-[74%] right-[-12%] sm:right-[-18%]",
  },
];

const easing = easeOut;

const imageReveal = {
  hidden: { opacity: 0, scale: 1.06, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 1.1, ease: easing },
  },
};

const noteVariant = (i: number) => ({
  hidden: { opacity: 0, x: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easing, delay: 0.9 + i * 0.18 },
  },
});

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing, delay },
  },
});

export default function SignatureScent() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 px-5 sm:px-10 overflow-hidden"
    >
      {/* Ambient background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 20%, color-mix(in srgb, var(--color-primary, #b08d57) 12%, transparent), transparent 70%), radial-gradient(50% 40% at 90% 80%, color-mix(in srgb, var(--color-primary, #b08d57) 8%, transparent), transparent 70%)",
        }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-6xl mx-auto">
        {/* Image side */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={imageReveal}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative rounded-t-[200px] rounded-b-2xl border border-border overflow-hidden aspect-[3/4] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)]">
            <img
              src={BrandStory}
              alt="MONCLair NOCTIS Eau de Parfum surrounded by florals, spices, and wood"
              className="w-full h-full object-cover"
            />
            {/* subtle vignette for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>

          {/* Note callouts */}
          {NOTES.map((note, i) => (
            <motion.div
              key={note.label}
              custom={i}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={noteVariant(i)}
              whileHover={{ y: -3, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`absolute ${note.position} bg-surface/90 backdrop-blur-md border border-border/80 rounded-md px-4 py-2.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] w-[150px] cursor-default`}
            >
              <p className="text-[9px] font-medium tracking-[0.25em] uppercase text-muted mb-0.5">
                {note.label}
              </p>
              <p className="text-sm text-admin-text font-light">
                {note.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Copy side */}
        <div>
          <motion.span
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp(0.1)}
            className="flex items-center gap-3 text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-5"
          >
            <motion.span
              initial={{ width: 0 }}
              animate={inView ? { width: 24 } : { width: 0 }}
              transition={{ duration: 0.6, ease: easing, delay: 0.2 }}
              className="h-px bg-primary"
            />
            The Signature Scent
          </motion.span>

          <motion.h2
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp(0.25)}
            className="font-heading text-admin-text leading-tight text-[clamp(28px,4vw,48px)] font-light mb-6"
          >
            The Essence of
            <br />
            Noctis
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.4 }}
            className="w-10 h-px bg-border mb-6 origin-left"
          />

          <div className="space-y-4 text-body text-sm sm:text-base leading-relaxed">
            {[
              "A bold harmony of dark gourmand richness, sensual florals, and warm woody depth. NOCTIS is crafted for those who command attention with quiet confidence and timeless sophistication.",
              "Opening with luminous Pear, sparkling Pink Pepper, and delicate Orange Blossom, it reveals an alluring heart of rich Coffee, Jasmine, Bitter Almond.",
              "An oriental-vanilla gourmand fragrance designed for unforgettable evenings, cooler nights, and refined presence beyond ordinary.",
            ].map((text, i) => (
              <motion.p
                key={i}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeUp(0.5 + i * 0.12)}
              >
                {text}
              </motion.p>
            ))}
          </div>

          <motion.button
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp(0.95)}
            whileHover={{ scale: 1.03, letterSpacing: "0.2em" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onClick={() =>
              navigate(`/perfume`, {
                state: {
                  categoryId: "6a562a2f017a6045e6d9979b",
                  fullCategoryData: {
                    _id: "6a562a2f017a6045e6d9979b",
                    image:
                      "https://macreelinfosoft-bucket.s3.ap-south-1.amazonaws.com/Vyraaa-Admin-Images/1784031329965.jpeg",
                    category: "Perfumes",
                  },
                },
              })
            }
            className="mt-8 inline-flex items-center gap-2 bg-heading text-surface text-xs font-medium tracking-[0.15em] uppercase px-7 py-3.5 rounded-sm"
          >
            Shop Now
            <motion.span
              aria-hidden="true"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
import { useState, useEffect, useRef } from "react";
import { BrandStory } from "@/assets/assets";
import { useNavigate } from "react-router-dom";
import { motion, useInView, easeOut } from "framer-motion";
import { ArrowRight } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

const toSlug = (text: string) => {
  return text?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
};

const NOTES = [
  {
    label: "01 / Atelier",
    value: "Slow-Made Fashion",
    position: "top-[18%] right-[-5%] sm:right-[-12%]",
  },
  {
    label: "02 / Craft",
    value: "Artisanal Jewelry",
    position: "top-[46%] right-[-2%] sm:right-[-8%]",
  },
  {
    label: "03 / Scent",
    value: "Signature Fragrance",
    position: "top-[74%] right-[-5%] sm:right-[-12%]",
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
  hidden: { opacity: 0, x: 20, filter: "blur(4px)" },
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

  const { getQuery } = useGetQuery();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      },
      onFail: (err: any) => {
        console.error("Failed to fetch brand story categories:", err);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShopNow = () => {
    if (categories.length > 0) {
      const firstCat = categories[0];
      navigate(`/${toSlug(firstCat.category)}`, {
        state: {
          categoryId: firstCat._id,
          fullCategoryData: firstCat,
        },
      });
    } else {
      navigate("/");
    }
  };

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
              alt="VYRAAA signature collection displaying artisanal apparel and details"
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
              className={`absolute ${note.position} bg-surface/90 backdrop-blur-md border border-border/80 rounded-md px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] w-[125px] sm:w-[150px] cursor-default`}
            >
              <p className="text-[8px] sm:text-[9px] font-medium tracking-[0.25em] uppercase text-muted mb-0.5">
                {note.label}
              </p>
              <p className="text-xs sm:text-sm text-admin-text font-light truncate">
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
            The Vyraaa Story
          </motion.span>

          <motion.h2
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp(0.25)}
            className="font-heading text-admin-text leading-tight text-[clamp(28px,4vw,48px)] font-light mb-6"
          >
            The Essence of
            <br />
            Slow Luxury
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: easing, delay: 0.4 }}
            className="w-10 h-px bg-border mb-6 origin-left"
          />

          <div className="space-y-4 text-body text-sm sm:text-base leading-relaxed">
            {[
              "At Vyraaa, we believe that true elegance requires patience and purpose. We craft sophisticated silhouettes, fine jewellery, and bespoke fragrances for individuals who appreciate the harmony of craft over noise.",
              "Every fabric is handpicked with intention, every metal is forged by expert hands, and every scent note is blended for quiet impact. We focus on slow fashion that stands as an enduring reflection of your identity.",
              "Step away from transient trends and embrace a curation made for the modern connoisseur, where simplicity represents the ultimate mastery of design.",
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

          <button
            onClick={handleShopNow}
            className="
    group
    mt-8
    inline-flex
    items-center
    gap-2
    rounded-full
    bg-heading
    px-7
    py-3
    text-xs
    font-medium
    uppercase
    tracking-[0.18em]
    text-surface
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-lg
    active:translate-y-0
  "
          >
            <span>Explore Collection</span>

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
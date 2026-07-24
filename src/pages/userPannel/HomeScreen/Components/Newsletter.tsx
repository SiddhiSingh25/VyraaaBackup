import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Newsletter() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return (
    <section className="relative bg-card pt-20 sm:pt-24 pb-28 sm:pb-32 px-5 sm:px-10 text-center overflow-hidden">
      {/* soft rose-gold glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-rose-gold) 16%, transparent), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto">
        <span
          className="block font-body text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-5"
          style={{ color: "var(--color-primary)" }}
        >
          {isAuthenticated ? "Select Curation" : "Vyraaa People"}
        </span>

        <h2 className="font-heading text-admin-text font-normal text-[clamp(32px,5vw,52px)] leading-tight mb-6">
          {isAuthenticated ? (
            <>
              Explore{" "}
              <span className="italic font-light text-primary">
                our products
              </span>
            </>
          ) : (
            <>
              Step into{" "}
              <span className="italic font-light text-primary">
                your signature era
              </span>
            </>
          )}
        </h2>

        <p className="font-body text-body text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-10">
          {isAuthenticated
            ? "Explore our full range of curated designs, fine products, and original fragrances crafted for those who value authenticity."
            : "Create an exclusive account today to explore our collections, build your private wishlist, and purchase authentic products from Vyraaa."}
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate(isAuthenticated ? "/all-product" : "/auth/signup")}
            className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-sm bg-primary text-background font-body text-xs  tracking-[0.2em] uppercase transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(131,82,64,0.35)]"
          >
            {isAuthenticated ? "Shop the Collection" : "Create Your Account"}
          </button>
        </div>
      </div>

      {/* refined scalloped bottom edge, two-tone for depth */}
      <svg
        className="absolute bottom-0 left-0 w-full h-12 sm:h-16"
        viewBox="0 0 1400 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,80 L0,40
             Q35,0 70,40
             Q105,80 140,40
             Q175,0 210,40
             Q245,80 280,40
             Q315,0 350,40
             Q385,80 420,40
             Q455,0 490,40
             Q525,80 560,40
             Q595,0 630,40
             Q665,80 700,40
             Q735,0 770,40
             Q805,80 840,40
             Q875,0 910,40
             Q945,80 980,40
             Q1015,0 1050,40
             Q1085,80 1120,40
             Q1155,0 1190,40
             Q1225,80 1260,40
             Q1295,0 1330,40
             Q1365,80 1400,40
             L1400,80 Z"
          fill="var(--color-background)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      </svg>
    </section>
  );
}


import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: wire up to a real subscribe endpoint
    console.log("subscribe:", email);
    setSubmitted(true);
    setEmail("");
  };

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
          Private Client List
        </span>

        <h2 className="font-heading text-heading font-normal text-[clamp(32px,5vw,52px)] leading-tight mb-6">
          Step into{" "}
          <span className="italic font-light text-primary" >
            your new era
          </span>
        </h2>

        <p className="font-body text-body text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-10">
          Subscribe and be the first to hear about fresh collections,
          behind-the-scenes notes, and the occasional just-for-you offer
          landing straight in your inbox.
        </p>

        {submitted ? (
          <p
            className="font-bodytext-sm tracking-wide"
            style={{ color: "var(--color-heading)" }}
          >
            You're on the list. Welcome in.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row max-w-md mx-auto bg-background shadow-[0_4px_24px_-8px_rgba(81,41,26,0.18)] border border-border rounded-sm overflow-hidden focus-within:border-primary transition-colors duration-300"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent px-5 py-4 text-sm font-body text-head placeholder:text-muted focus:outline-none min-w-0"
            />
            <button
              type="submit"
              className="px-6 py-4 text-[11px] font-medium tracking-[0.18em] uppercase text-background shrink-0 border-t sm:border-t-0 sm:border-l border-border transition-colors duration-300"
              style={{ backgroundColor: "var(--color-primary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-primary-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-primary)")
              }
            >
              Request Access
            </button>
          </form>
        )}

        <p
          className="mt-6 text-[10px] tracking-[0.15em] uppercase font-body"
          style={{ color: "var(--color-muted)" }}
        >
          No spam. Unsubscribe anytime.
        </p>
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
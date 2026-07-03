import { motion } from "motion/react";
import type { CheckoutStep } from "../../types/cart";

interface StepperProps {
  current: CheckoutStep;
}

const steps: { key: CheckoutStep; label: string }[] = [
  { key: "bag", label: "Bag" },
  { key: "address", label: "Address" },
  { key: "payment", label: "Payment" },
];

const CheckoutStepper = ({ current }: StepperProps) => {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, i) => {
          const isActive = i === currentIndex;
          const isDone = i < currentIndex;

          return (
            <li key={step.key} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5">
                {/* Faceted gem marker instead of a generic dot */}
                <motion.span
                  initial={false}
                  animate={{
                    rotate: isActive ? 45 : 0,
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className={[
                    "inline-block h-2.5 w-2.5 sm:h-3 sm:w-3",
                    isActive || isDone ? "bg-primary" : "bg-border",
                  ].join(" ")}
                  style={{
                    clipPath: "polygon(50% 0%, 100% 38%, 78% 100%, 22% 100%, 0% 38%)",
                  }}
                />
                <span
                  className={[
                    "font-body text-[11px] sm:text-xs tracking-[0.2em] uppercase",
                    isActive
                      ? "text-heading font-semibold"
                      : isDone
                      ? "text-primary"
                      : "text-muted",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="h-px w-6 sm:w-12 bg-border"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutStepper;

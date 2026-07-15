import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = ["Cart", "Address", "Payment", "Review"] as const;

interface CheckoutProgressProps {
  currentStep?: number; // 0-indexed
}

export default function CheckoutProgress({ currentStep = 2 }: CheckoutProgressProps) {
  return (
    <div className="w-full border-b border-border bg-surface/60">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5">
        <ol className="flex w-full max-w-xl items-center">
          {steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isActive = index === currentStep;

            return (
              <li key={step} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isComplete || isActive ? "#835240" : "#f8f4ee",
                      borderColor: isComplete || isActive ? "#835240" : "#e6d9cf",
                      scale: isActive ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border"
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4 text-background" strokeWidth={2.5} />
                    ) : (
                      <span
                        className={`font-body text-xs font-semibold ${
                          isActive ? "text-background" : "text-muted"
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </motion.div>
                  <span
                    className={`font-body text-[11px] tracking-wide ${
                      isActive
                        ? "font-semibold text-admin-text"
                        : isComplete
                        ? "text-body"
                        : "text-muted"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className="mx-2 mb-5 h-px flex-1 bg-border">
                    <motion.div
                      className="h-px bg-primary"
                      initial={false}
                      animate={{ width: isComplete ? "100%" : "0%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

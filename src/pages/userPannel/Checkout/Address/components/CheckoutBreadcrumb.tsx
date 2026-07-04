const STEPS = ["Home", "Cart", "Address", "Payment"] as const;

interface CheckoutBreadcrumbProps {
  currentStep: (typeof STEPS)[number];
}

export function CheckoutBreadcrumb({ currentStep }: CheckoutBreadcrumbProps) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li key={step} className="flex items-center gap-2 sm:gap-4">
              <span
                className={`text-xs tracking-[0.08em] uppercase transition-colors sm:text-sm
                  ${isCurrent ? "font-semibold text-primary" : isComplete ? "text-body" : "text-muted"}`}
              >
                {step}
              </span>
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="stitch-rule w-6 sm:w-10"
                  style={{
                    opacity: isComplete ? 1 : 0.4,
                  }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

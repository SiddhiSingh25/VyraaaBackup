import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { EMIPlan } from "../types";

interface EMISectionProps {
  plans: EMIPlan[];
}

export default function EMISection({ plans }: EMISectionProps) {
  const [expandedBank, setExpandedBank] = useState<string | null>(plans[0]?.bank ?? null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const grouped = plans.reduce<Record<string, EMIPlan[]>>((acc, plan) => {
    acc[plan.bank] = acc[plan.bank] ? [...acc[plan.bank], plan] : [plan];
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([bank, bankPlans]) => {
        const isOpen = expandedBank === bank;
        return (
          <div
            key={bank}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <button
              onClick={() => setExpandedBank(isOpen ? null : bank)}
              className="flex w-full items-center justify-between px-5 py-4"
            >
              <span className="font-body text-[14px] font-semibold text-admin-text">
                {bank}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 px-5 pb-5">
                    {bankPlans.map((plan) => {
                      const selected = selectedPlan === plan.id;
                      return (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors"
                          style={{
                            borderColor: selected ? "#835240" : "#e6d9cf",
                            backgroundColor: selected ? "#f2e8dd" : "#fdf9f3",
                          }}
                        >
                          <div>
                            <p className="font-body text-[13.5px] font-semibold text-admin-text">
                              {plan.tenure} months · ₹{plan.monthlyAmount.toLocaleString("en-IN")}/mo
                            </p>
                            <p className="font-body text-[12px] text-muted">
                              Interest {plan.interestRate}% · Total ₹
                              {plan.totalAmount.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                            style={{ borderColor: selected ? "#835240" : "#e6d9cf" }}
                          >
                            {selected && (
                              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ChevronRight } from "lucide-react";

export default function GiftCardSection() {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Gift className="h-4 w-4 text-primary" strokeWidth={1.75} />
          </div>
          <span className="font-body text-[14px] font-semibold text-admin-text">
            Have a Gift Card?
          </span>
        </div>
        <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="h-4 w-4 text-muted" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter gift card code"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 font-body text-[14px] text-admin-text outline-none transition-colors focus:border-primary"
              />
              <button
                disabled={!code.trim()}
                className="rounded-xl bg-primary px-6 py-3 font-body text-[13.5px] font-semibold text-background transition-opacity disabled:opacity-40"
              >
                Apply Gift Card
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

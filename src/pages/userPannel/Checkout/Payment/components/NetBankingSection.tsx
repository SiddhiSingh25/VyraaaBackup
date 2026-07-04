import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { Bank } from "../types";

interface NetBankingSectionProps {
  banks: Bank[];
}

export default function NetBankingSection({ banks }: NetBankingSectionProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      banks.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase())),
    [banks, query]
  );

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your bank"
          className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 font-body text-[14px] text-heading outline-none transition-colors focus:border-primary"
        />
      </div>

      <div>
        <p className="mb-3 font-body text-[12px] font-semibold uppercase tracking-widest text-muted">
          Popular Banks
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((bank) => {
            const isSelected = selected === bank.id;
            return (
              <motion.button
                key={bank.id}
                onClick={() => setSelected(bank.id)}
                whileHover={{ y: -2 }}
                className="vyraaa-card-shadow flex items-center gap-3 rounded-xl border bg-card px-3.5 py-3.5 text-left"
                style={{
                  borderColor: isSelected ? "#835240" : "#e6d9cf",
                  backgroundColor: isSelected ? "#f2e8dd" : "#f8f4ee",
                }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background font-body text-[9.5px] font-bold text-primary">
                  {bank.icon}
                </div>
                <span className="font-body text-[13px] font-medium leading-tight text-body">
                  {bank.name}
                </span>
              </motion.button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full font-body text-[13px] text-muted">
              No banks match “{query}”. Try a different name.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

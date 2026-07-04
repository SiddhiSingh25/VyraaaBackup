import { useState } from "react";
import { motion } from "framer-motion";
import type { Wallet } from "../types";

interface WalletSectionProps {
  wallets: Wallet[];
}

export default function WalletSection({ wallets }: WalletSectionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {wallets.map((wallet) => {
        const isSelected = selected === wallet.id;
        return (
          <motion.button
            key={wallet.id}
            onClick={() => setSelected(wallet.id)}
            whileHover={{ y: -2 }}
            className="vyraaa-card-shadow flex items-center gap-3.5 rounded-2xl border bg-card p-4 text-left transition-colors"
            style={{
              borderColor: isSelected ? "#835240" : "#e6d9cf",
              backgroundColor: isSelected ? "#f2e8dd" : "#f8f4ee",
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background font-body text-[11px] font-bold text-primary">
              {wallet.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-[14px] font-semibold text-heading">
                {wallet.name}
              </p>
              <p className="font-body text-[12px] text-muted">
                {wallet.balance ? `Balance: ${wallet.balance}` : "Link & pay instantly"}
              </p>
            </div>
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
              style={{ borderColor: isSelected ? "#835240" : "#e6d9cf" }}
            >
              {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

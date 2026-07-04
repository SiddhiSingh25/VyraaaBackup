import { useState } from "react";
import { motion } from "motion/react";

interface DonationCardProps {
  onChange: (amount: number) => void;
}

const tiers = [10, 20, 50, 100];

const DonationCard = ({ onChange }: DonationCardProps) => {
  const [enabled, setEnabled] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    onChange(next && selected ? selected : 0);
  };

  const pick = (amount: number) => {
    setSelected(amount);
    setEnabled(true);
    onChange(amount);
  };

  return (
    <div className="border-b border-border py-4">
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggle}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="font-body text-sm text-body">
          Donate and make a difference
        </span>
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {tiers.map((amount) => {
          const active = enabled && selected === amount;
          return (
            <motion.button
              key={amount}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => pick(amount)}
              className={[
                "rounded-full border px-4 py-1.5 font-body text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-background"
                  : "border-border text-body hover:border-primary-light",
              ].join(" ")}
            >
              ₹{amount}
            </motion.button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-2 font-body text-xs font-semibold tracking-wide text-primary hover:text-primary-dark"
      >
        Know More
      </button>
    </div>
  );
};

export default DonationCard;

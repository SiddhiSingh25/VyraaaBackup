import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { UPIApp } from "../types";

interface UPISectionProps {
  apps: UPIApp[];
}

export default function UPISection({ apps }: UPISectionProps) {
  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const isValidUpi = /^[\w.-]+@[\w.-]+$/.test(upiId);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-3 font-body text-[13.5px] font-semibold text-admin-text">
          Pay via UPI ID
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-[14px] text-admin-text outline-none transition-colors focus:border-primary"
            />
            {isValidUpi && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-success" />
              </motion.span>
            )}
          </div>
          <button
            disabled={!isValidUpi}
            className="rounded-xl bg-primary px-6 py-3 font-body text-[13.5px] font-semibold text-background transition-opacity disabled:opacity-40"
          >
            Verify &amp; Pay
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-body text-[11px] font-medium uppercase tracking-widest text-muted">
          or choose an app
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {apps.map((app) => {
          const selected = selectedApp === app.id;
          return (
            <motion.button
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="vyraaa-card-shadow flex flex-col items-center gap-2 rounded-2xl border bg-card px-3 py-5 transition-colors"
              style={{
                borderColor: selected ? "#835240" : "#e6d9cf",
                backgroundColor: selected ? "#f2e8dd" : "#f8f4ee",
              }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background font-body text-[11px] font-bold text-primary">
                {app.icon}
              </div>
              <span className="font-body text-[12.5px] font-medium text-body">
                {app.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import type { CardBrand, CardFormData } from "../types";

interface CreditCardFormProps {
  brands: CardBrand[];
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectBrand(cardNumber: string): string | null {
  const digits = cardNumber.replace(/\s/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6/.test(digits)) return "rupay";
  return null;
}

export default function CreditCardForm({ brands }: CreditCardFormProps) {
  const [form, setForm] = useState<CardFormData>({
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saveCard, setSaveCard] = useState(false);

  const detectedBrand = detectBrand(form.cardNumber);

  const errors = {
    cardNumber:
      touched.cardNumber && form.cardNumber.replace(/\s/g, "").length < 16
        ? "Enter a valid 16-digit card number"
        : "",
    cardholderName:
      touched.cardholderName && form.cardholderName.trim().length < 2
        ? "Enter the name on your card"
        : "",
    expiry:
      touched.expiry && !/^\d{2}\/\d{2}$/.test(form.expiry)
        ? "Use MM/YY format"
        : "",
    cvv:
      touched.cvv && !/^\d{3,4}$/.test(form.cvv)
        ? "Enter a valid CVV"
        : "",
  };

  const field = (name: keyof CardFormData) => ({
    value: form[name],
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="mt-4 rounded-2xl border border-border bg-card p-5">
        <div className="mb-5 flex items-center gap-2">
          {brands.map((b) => (
            <span
              key={b.id}
              className={`flex h-6 items-center rounded-md border px-2 font-body text-[10px] font-bold tracking-wide transition-opacity ${
                detectedBrand === b.id
                  ? "border-primary bg-primary/10 text-primary opacity-100"
                  : "border-border bg-background text-muted opacity-70"
              }`}
            >
              {b.logo}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FloatingInput
            label="Card Number"
            className="sm:col-span-2"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            {...field("cardNumber")}
            onChange={(v) => setForm((f) => ({ ...f, cardNumber: formatCardNumber(v) }))}
            error={errors.cardNumber}
          />

          <FloatingInput
            label="Cardholder Name"
            className="sm:col-span-2"
            placeholder="As printed on card"
            {...field("cardholderName")}
            onChange={(v) => setForm((f) => ({ ...f, cardholderName: v }))}
            error={errors.cardholderName}
          />

          <FloatingInput
            label="Expiry (MM/YY)"
            inputMode="numeric"
            placeholder="MM/YY"
            {...field("expiry")}
            onChange={(v) => setForm((f) => ({ ...f, expiry: formatExpiry(v) }))}
            error={errors.expiry}
          />

          <FloatingInput
            label="CVV"
            inputMode="numeric"
            type="password"
            placeholder="•••"
            {...field("cvv")}
            onChange={(v) =>
              setForm((f) => ({ ...f, cvv: v.replace(/\D/g, "").slice(0, 4) }))
            }
            error={errors.cvv}
          />
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-[#835240]"
          />
          <span className="font-body text-[13px] text-body">
            Securely save this card for faster checkout next time
          </span>
        </label>

        <div className="mt-4 flex items-center gap-1.5 text-muted">
          <Lock className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="font-body text-[11.5px]">
            Your card details are encrypted and never stored on our servers
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  className?: string;
  placeholder?: string;
  inputMode?: "numeric" | "text";
  type?: string;
}

function FloatingInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  className = "",
  placeholder,
  inputMode,
  type = "text",
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;

  return (
    <div className={className}>
      <div className="relative">
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={focused ? placeholder : ""}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border bg-background px-4 pb-2.5 pt-5 font-body text-[14px] text-admin-text outline-none transition-colors duration-200 focus:border-primary ${
            error ? "border-error" : "border-border"
          }`}
        />
        <motion.label
          initial={false}
          animate={{
            top: floating ? 8 : 16,
            fontSize: floating ? 11 : 14,
          }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute left-4 text-muted"
        >
          {label}
        </motion.label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 font-body text-[11.5px] text-error"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

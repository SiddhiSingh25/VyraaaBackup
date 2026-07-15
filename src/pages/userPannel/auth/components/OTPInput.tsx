import { useEffect, useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * 6-digit OTP input with autofocus, auto-advance, backspace-to-previous, and paste support.
 * `value` / `onChange` hold the full OTP string — wire to react-hook-form via Controller.
 */
const OTPInput = ({ length = 6, value, onChange, error }: OTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted.padEnd(length, "").slice(0, length));
    const lastIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div>
      <div className="flex justify-between gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`h-12 w-12 rounded-xl border bg-background text-center text-lg font-semibold text-heading outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:h-14 sm:w-14 ${
              error ? "border-error" : "border-border"
            }`}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
};

export default OTPInput;

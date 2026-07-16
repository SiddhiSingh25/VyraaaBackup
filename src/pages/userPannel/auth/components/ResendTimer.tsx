import { useEffect, useState } from "react";

interface ResendTimerProps {
  seconds?: number;
  onResend: () => void;
  disabled?: boolean;
}

/**
 * 60s countdown before "Resend OTP" becomes clickable again.
 * Restarts automatically whenever `seconds` (or a remount key) changes.
 */
const ResendTimer = ({ seconds = 60, onResend, disabled = false }: ResendTimerProps) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => setRemaining((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  const handleResend = () => {
    if (remaining > 0 || disabled) return;
    onResend();
    setRemaining(seconds);
  };

  const formatted = `00:${remaining.toString().padStart(2, "0")}`;

  return (
    <p className="text-sm text-muted">
      Didn&apos;t receive the OTP?{" "}
      {remaining > 0 ? (
        <span className="font-medium text-muted">
          Resend OTP ({formatted})
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          disabled={disabled}
          className="font-medium text-primary transition-colors hover:text-primary-dark disabled:opacity-60"
        >
          Resend OTP
        </button>
      )}
    </p>
  );
};

export default ResendTimer;

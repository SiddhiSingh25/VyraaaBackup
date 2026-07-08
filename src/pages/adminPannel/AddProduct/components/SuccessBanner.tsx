import { useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";

type SuccessBannerProps = {
  message: string;
  onDismiss: () => void;
  autoDismissMs?: number;
};

/** Non-blocking success toast, auto-dismisses so it never gets in the way. */
const SuccessBanner = ({
  message,
  onDismiss,
  autoDismissMs = 4000,
}: SuccessBannerProps) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [onDismiss, autoDismissMs]);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-success/30 bg-success/10 px-5 py-3 text-sm font-medium text-success shadow-sm">
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-success/70 hover:text-success transition"
      >
        <RiCloseLine size={18} />
      </button>
    </div>
  );
};

export default SuccessBanner;

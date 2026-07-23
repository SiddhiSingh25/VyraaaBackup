import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Premium Frosted Backdrop */}
      <div
        className="absolute inset-0 bg-dark/40 backdrop-blur-[3px] transition-opacity duration-500 animate-fade-in"
        onClick={onCancel}
      />

      {/* Elevated Dialog Panel */}
      <div className="relative w-full max-w-sm rounded-xl bg-background border border-border shadow-2xl shadow-dark/10 animate-scale-in p-8">
        {/* Refined Warning Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error ring-4 ring-error/5">
          <AlertTriangle size={22} strokeWidth={2} />
        </div>

        {/* Brand Typography */}
        <h2
          id="confirm-title"
          className="mt-5 text-xl  font-bold text-heading font-admin-text tracking-wide"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted font-admin-text">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end gap-4 font-admin-text">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            // Overriding the button colors to use your exact error brand variable
            className="bg-error text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-error/50 transition-all duration-300 shadow-sm border-transparent"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};

const ICONS: Record<NonNullable<ToastMessage["variant"]>, string> = {
  success: "check_circle",
  info: "favorite",
  error: "error",
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex items-start gap-3 rounded-sm border border-border bg-background px-5 py-4 shadow-[0_8px_30px_rgba(59,48,42,0.12)]"
              role="status"
              onClick={() => dismiss(toast.id)}
            >
              <span
                className={
                  "material-symbols-outlined mt-0.5 text-[20px] " +
                  (toast.variant === "error"
                    ? "text-error"
                    : toast.variant === "info"
                    ? "text-rose-gold"
                    : "text-success")
                }
              >
                {ICONS[toast.variant ?? "success"]}
              </span>
              <div className="flex-1">
                <p className="font-heading text-[15px] leading-tight text-heading">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 font-body text-[13px] leading-snug text-muted">
                    {toast.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

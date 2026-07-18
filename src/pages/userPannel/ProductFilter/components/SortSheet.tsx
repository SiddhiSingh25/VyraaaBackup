import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { C } from "../constants";

export interface SortSheetProps {
  open: boolean;
  onClose: () => void;
  sort: string;
  setSort: (sort: string) => void;
}

export default function SortSheet({
  open,
  onClose,
  sort,
  setSort,
}: SortSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(59,48,42,0.4)" }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-6"
            style={{ background: C.bg }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: C.border }}
              />
            </div>
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <span
                className="text-[15px] font-medium"
                style={{
                  color: C.heading,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Sort By
              </span>
              <button onClick={onClose}>
                <X size={18} color={C.muted} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSort(o.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-[14px]"
                  style={{
                    color: sort === o.id ? C.primary : C.body,
                    background: sort === o.id ? C.surface : "transparent",
                  }}
                >
                  {o.label}
                  {sort === o.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

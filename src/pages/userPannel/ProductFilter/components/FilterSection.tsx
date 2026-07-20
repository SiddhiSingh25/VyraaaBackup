
import React, { useState } from "react";
import { Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Accordion from "./Accordion";
import type { FilterChangeHandler, FilterSectionConfig, FilterValue } from "../types";

export interface FilterSectionProps {
  section: FilterSectionConfig;
  value: FilterValue;
  onChange: FilterChangeHandler;
}


export default function FilterSection({
  section,
  value,
  onChange,
}: FilterSectionProps) {
  const [search, setSearch] = useState("");
  const [hoveredSwatch, setHoveredSwatch] = useState<string | null>(null);

  const val =
    value ??
    (section.type === "range"
      ? [section.min ?? 0, section.max ?? 0]
      : section.type === "radio"
        ? null
        : []);

  const selectedCount =
    section.type === "range"
      ? 0
      : section.type === "radio"
        ? val
          ? 1
          : 0
        : (val as string[]).length;

  const toggleMulti = (id: string) => {
    const list = val as string[];
    const next = list.includes(id)
      ? list.filter((v) => v !== id)
      : [...list, id];
    onChange(section.id, next);
  };

  const options = section.searchable
    ? (section.options ?? []).filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
    : (section.options ?? []);

  const rangePercent =
    section.type === "range"
      ? (((val as [number, number])[1] - (section.min ?? 0)) /
          ((section.max ?? 1) - (section.min ?? 0))) *
        100
      : 0;

  return (
    <Accordion title={section.title} count={selectedCount} defaultOpen={true}>
      {section.searchable && (
        <div className="relative mb-3.5">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${section.title.toLowerCase()}`}
            className="w-full pl-8 pr-3 py-2.5 text-[12.5px] rounded-xl outline-none
              bg-surface border border-border text-heading font-body
              transition-shadow duration-200
              focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      )}

      {section.type === "radio" && (
        <div className="flex flex-col gap-1">
          {options.map((o) => {
            const active = val === o.id;
            return (
              <label
                key={o.id}
                className={`flex items-center justify-between cursor-pointer group px-2 -mx-2 py-1.5 rounded-lg
                  transition-colors duration-150 ${active ? "bg-primary/5" : "hover:bg-card/60"}`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200
                      ${active ? "border-[1.5px] border-primary ring-4 ring-primary/10" : "border-[1.5px] border-border"}`}
                  >
                    {active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </span>
                  <span
                    className={`text-[13px] font-body transition-colors duration-150 ${
                      active ? "text-heading font-medium" : "text-body"
                    }`}
                  >
                    {o.label}
                  </span>
                </span>
                {o.count != null && (
                  <span className="text-[11px] tabular-nums text-muted">{o.count}</span>
                )}
                <input
                  type="radio"
                  className="sr-only"
                  checked={active}
                  onChange={() => onChange(section.id, o.id)}
                />
              </label>
            );
          })}
        </div>
      )}

      {section.type === "checkbox" && (
        <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1 scrollbar-premium">
          {options.map((o) => {
            const active = (val as string[]).includes(o.id);
            return (
              <label
                key={o.id}
                className={`flex items-center justify-between cursor-pointer px-2 -mx-2 py-1.5 rounded-lg
                  transition-colors duration-150 ${active ? "bg-primary/5" : "hover:bg-card/60"}`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-[5px] flex items-center justify-center transition-all duration-200
                      ${
                        active
                          ? "bg-primary border-[1.5px] border-primary ring-4 ring-primary/10"
                          : "border-[1.5px] border-border"
                      }`}
                  >
                    {active && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      >
                        <Check size={11} color="#fff" strokeWidth={3} />
                      </motion.span>
                    )}
                  </span>
                  <span
                    className={`text-[13px] font-body transition-colors duration-150 ${
                      active ? "text-heading font-medium" : "text-body"
                    }`}
                  >
                    {o.label}
                  </span>
                </span>
                {o.count != null && (
                  <span className="text-[11px] tabular-nums text-muted">{o.count}</span>
                )}
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => toggleMulti(o.id)}
                />
              </label>
            );
          })}
        </div>
      )}

      {section.type === "toggle" && (
        <div className="flex flex-col gap-3.5">
          {options.map((o) => {
            const active = (val as string[]).includes(o.id);
            return (
              <div key={o.id} className="flex items-center justify-between">
                <span
                  className={`text-[13px] font-body transition-colors duration-150 ${
                    active ? "text-heading font-medium" : "text-body"
                  }`}
                >
                  {o.label}
                </span>
                <button
                  role="switch"
                  aria-checked={active}
                  onClick={() => toggleMulti(o.id)}
                  className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                    active ? "bg-primary" : "bg-border"
                  }`}
                >
                  <motion.span
                    className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
                    animate={{ left: active ? 18 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {section.type === "size" && (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const active = (val as string[]).includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggleMulti(o.id)}
                className={`min-w-[40px] h-9 px-3 rounded-lg text-[12px] font-medium font-body
                  transition-all duration-150 ${
                    active
                      ? "bg-primary-dark text-white border border-primary-dark shadow-[0_2px_8px_-2px_var(--color-primary-dark)] -translate-y-px"
                      : "bg-transparent text-body border border-border hover:border-primary/40"
                  }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {/* {section.type === "color" && (
        <div className="flex flex-wrap gap-3.5">
          {options.map((o) => {
            const active = (val as string[]).includes(o.id);
            const isHovered = hoveredSwatch === o.id;
            return (
              <div key={o.id} className="relative flex flex-col items-center">
                <button
                  onClick={() => toggleMulti(o.id)}
                  onMouseEnter={() => setHoveredSwatch(o.id)}
                  onMouseLeave={() => setHoveredSwatch(null)}
                  aria-label={o.label}
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center
                    transition-transform duration-200 ${
                      active ? "scale-[1.08]" : isHovered ? "scale-105" : "scale-100"
                    }`}
                  style={{
                    boxShadow: active
                      ? "0 0 0 2px white, 0 0 0 3.5px var(--color-rose-gold), 0 3px 10px -2px var(--color-rose-gold)"
                      : "0 0 0 1px var(--color-border)",
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full"
                    style={{
                      background: o.swatch,
                      border: o.swatch === "#FFFFFF" ? "1px solid var(--color-border)" : "none",
                    }}
                  />
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute"
                      >
                        <Check
                          size={12}
                          strokeWidth={3}
                          className={LIGHT_SWATCH_VALUES.includes(o.value) ? "text-heading" : "text-white"}
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="absolute -bottom-5 text-[10px] whitespace-nowrap text-muted font-body"
                    >
                      {o.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )} */}

      {section.type === "color" && (
  <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1 scrollbar-premium">
    {options.map((o) => {
      const active = (val as string[]).includes(o.id);

      return (
        <label
          key={o.id}
          className={`flex items-center justify-between cursor-pointer px-2 -mx-2 py-1.5 rounded-lg transition-colors duration-150 ${
            active ? "bg-primary/5" : "hover:bg-card/60"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <span
              className={`min-w-[20px] h-5 px-2 rounded-md flex items-center justify-center text-[10px] font-medium transition-all duration-200 ${
                active
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-body"
              }`}
            >
              {active && <Check size={10} strokeWidth={3} />}
            </span>

            <span
              className={`text-[13px] transition-colors duration-150 ${
                active
                  ? "text-heading font-medium"
                  : "text-body"
              }`}
            >
              {o.label}
            </span>
          </span>

          {o.count != null && (
            <span className="text-[11px] tabular-nums text-muted">
              {o.count}
            </span>
          )}

          <input
            type="checkbox"
            className="sr-only"
            checked={active}
            onChange={() => toggleMulti(o.id)}
          />
        </label>
      );
    })}
  </div>
)}

      {section.type === "range" && (
        <div>
          <div className="flex items-center justify-between text-[12.5px] mb-3 font-medium text-heading font-body">
            <span className="px-2 py-1 rounded-md bg-surface border border-border">
              {section.unit}
              {(val as [number, number])[0].toLocaleString("en-IN")}
            </span>
            <span className="px-2 py-1 rounded-md bg-surface border border-border">
              {section.unit}
              {(val as [number, number])[1].toLocaleString("en-IN")}
              {(val as [number, number])[1] === section.max ? "+" : ""}
            </span>
          </div>

          <div className="relative flex items-center h-4">
            <div className="absolute w-full h-1 rounded-full bg-border" />
            <div
              className="absolute h-1 rounded-full transition-all duration-100"
              style={{
                width: `${rangePercent}%`,
                background:
                  "linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))",
              }}
            />
            <input
              type="range"
              min={section.min}
              max={section.max}
              step={section.step}
              value={(val as [number, number])[1]}
              onChange={(e) =>
                onChange(section.id, [
                  (val as [number, number])[0],
                  Number(e.target.value),
                ])
              }
              className="range-thumb-premium relative w-full h-4 appearance-none bg-transparent cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {(section.quickValues ?? []).map((q) => {
              const active = (val as [number, number])[0] === q;
              return (
                <button
                  key={q}
                  onClick={() => onChange(section.id, [q, section.max ?? q])}
                  className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium font-body
                    transition-all duration-150 ${
                      active
                        ? "bg-primary text-white border border-primary shadow-[0_2px_6px_-1px_var(--color-primary)]"
                        : "bg-surface text-body border border-border hover:border-primary/40"
                    }`}
                >
                  {section.unit}
                  {q}+
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Accordion>
  );
}
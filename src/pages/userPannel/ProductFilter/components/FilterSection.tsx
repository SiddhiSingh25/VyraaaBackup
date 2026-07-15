import React, { useState } from "react";
import { Search, Check } from "lucide-react";
import { motion } from "framer-motion";
import { C } from "../constants";
import Accordion from "./Accordion";
import type { FilterChangeHandler, FilterSectionConfig, FilterValue } from "../types";

export interface FilterSectionProps {
  section: FilterSectionConfig;
  value: FilterValue;
  onChange: FilterChangeHandler;
}

const LIGHT_SWATCH_VALUES = ["white", "ivory", "gold", "beige", "mustard", "pink"];

export default function FilterSection({
  section,
  value,
  onChange,
}: FilterSectionProps) {
  const [search, setSearch] = useState("");

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

  return (
    <Accordion
      title={section.title}
      count={selectedCount}
      defaultOpen={["category", "price"].includes(section.id)}
    >
      {section.searchable && (
        <div className="relative mb-3">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: C.muted }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${section.title.toLowerCase()}`}
            className="w-full pl-8 pr-3 py-2 text-[12.5px] rounded-lg outline-none"
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.heading,
            }}
          />
        </div>
      )}

      {section.type === "radio" && (
        <div className="flex flex-col gap-2.5">
          {options.map((o) => (
            <label
              key={o.id}
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    border: `1.5px solid ${val === o.id ? C.primary : C.border}`,
                  }}
                >
                  {val === o.id && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: C.primary }}
                    />
                  )}
                </span>
                <span className="text-[13px]" style={{ color: C.body }}>
                  {o.label}
                </span>
              </span>
              {o.count != null && (
                <span className="text-[11px]" style={{ color: C.muted }}>
                  {o.count}
                </span>
              )}
              <input
                type="radio"
                className="sr-only"
                checked={val === o.id}
                onChange={() => onChange(section.id, o.id)}
              />
            </label>
          ))}
        </div>
      )}

      {section.type === "checkbox" && (
        <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
          {options.map((o) => (
            <label
              key={o.id}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-[5px] flex items-center justify-center transition-colors"
                  style={{
                    background: (val as string[]).includes(o.id)
                      ? C.primary
                      : "transparent",
                    border: `1.5px solid ${
                      (val as string[]).includes(o.id) ? C.primary : C.border
                    }`,
                  }}
                >
                  {(val as string[]).includes(o.id) && (
                    <Check size={11} color="#fff" strokeWidth={3} />
                  )}
                </span>
                <span className="text-[13px]" style={{ color: C.body }}>
                  {o.label}
                </span>
              </span>
              {o.count != null && (
                <span className="text-[11px]" style={{ color: C.muted }}>
                  {o.count}
                </span>
              )}
              <input
                type="checkbox"
                className="sr-only"
                checked={(val as string[]).includes(o.id)}
                onChange={() => toggleMulti(o.id)}
              />
            </label>
          ))}
        </div>
      )}

      {section.type === "toggle" && (
        <div className="flex flex-col gap-3">
          {options.map((o) => (
            <div key={o.id} className="flex items-center justify-between">
              <span className="text-[13px]" style={{ color: C.body }}>
                {o.label}
              </span>
              <button
                role="switch"
                aria-checked={(val as string[]).includes(o.id)}
                onClick={() => toggleMulti(o.id)}
                className="w-9 h-5 rounded-full relative transition-colors"
                style={{
                  background: (val as string[]).includes(o.id)
                    ? C.primary
                    : C.border,
                }}
              >
                <motion.span
                  className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow"
                  animate={{ left: (val as string[]).includes(o.id) ? 18 : 2 }}
                  transition={{ duration: 0.18 }}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {section.type === "size" && (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => toggleMulti(o.id)}
              className="min-w-[40px] h-9 px-2 rounded-lg text-[12px] font-medium transition-colors"
              style={{
                background: (val as string[]).includes(o.id)
                  ? C.primaryDark
                  : "transparent",
                color: (val as string[]).includes(o.id) ? "#fff" : C.body,
                border: `1px solid ${
                  (val as string[]).includes(o.id) ? C.primaryDark : C.border
                }`,
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {section.type === "color" && (
        <div className="flex flex-wrap gap-3">
          {options.map((o) => {
            const active = (val as string[]).includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggleMulti(o.id)}
                aria-label={o.label}
                title={o.label}
                className="relative w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                style={{
                  boxShadow: active
                    ? `0 0 0 2px #fff, 0 0 0 3.5px ${C.rose}`
                    : `0 0 0 1px ${C.border}`,
                  transform: active ? "scale(1.06)" : "scale(1)",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: o.swatch,
                    border:
                      o.swatch === "#FFFFFF" ? `1px solid ${C.border}` : "none",
                  }}
                />
                {active && (
                  <Check
                    size={11}
                    strokeWidth={3}
                    className="absolute"
                    color={
                      LIGHT_SWATCH_VALUES.includes(o.value)
                        ? C.heading
                        : "#fff"
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {section.type === "range" && (
        <div>
          <div
            className="flex items-center justify-between text-[12.5px] mb-3"
            style={{ color: C.heading }}
          >
            <span>
              {section.unit}
              {(val as [number, number])[0].toLocaleString("en-IN")}
            </span>
            <span>
              {section.unit}
              {(val as [number, number])[1].toLocaleString("en-IN")}
              {(val as [number, number])[1] === section.max ? "+" : ""}
            </span>
          </div>
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
            className="w-full accent-current"
            style={{ accentColor: C.primary }}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {(section.quickValues ?? []).map((q) => (
              <button
                key={q}
                onClick={() => onChange(section.id, [q, section.max ?? q])}
                className="px-3 py-1.5 rounded-full text-[11.5px]"
                style={{
                  background:
                    (val as [number, number])[0] === q ? C.primary : C.surface,
                  color: (val as [number, number])[0] === q ? "#fff" : C.body,
                  border: `1px solid ${
                    (val as [number, number])[0] === q ? C.primary : C.border
                  }`,
                }}
              >
                {section.unit}
                {q}+
              </button>
            ))}
          </div>
        </div>
      )}
    </Accordion>
  );
}


// import React, { useState } from "react";
// import { Search, Check } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Accordion from "./Accordion";
// import type { FilterChangeHandler, FilterSectionConfig, FilterValue } from "../types";

// export interface FilterSectionProps {
//   section: FilterSectionConfig;
//   value: FilterValue;
//   onChange: FilterChangeHandler;
// }


// export default function FilterSection({
//   section,
//   value,
//   onChange,
// }: FilterSectionProps) {
//   const [search, setSearch] = useState("");
//   const [hoveredSwatch, setHoveredSwatch] = useState<string | null>(null);

//   const val =
//     value ??
//     (section.type === "range"
//       ? [section.min ?? 0, section.max ?? 0]
//       : null);

//   const selectedCount =
//     section.type === "range"
//       ? 0
//       : val
//         ? 1
//         : 0;

//   const toggleSingle = (id: string) => {
//     const next = val === id ? null : id;
//     onChange(section.id, next);
//   };

//   const options = section.searchable
//     ? (section.options ?? []).filter((o) =>
//       o.label.toLowerCase().includes(search.toLowerCase()),
//     )
//     : (section.options ?? []);

//   const minPercent =
//     section.type === "range"
//       ? (((val as [number, number])[0] - (section.min ?? 0)) /
//         ((section.max ?? 1) - (section.min ?? 0))) *
//       100
//       : 0;

//   const maxPercent =
//     section.type === "range"
//       ? (((val as [number, number])[1] - (section.min ?? 0)) /
//         ((section.max ?? 1) - (section.min ?? 0))) *
//       100
//       : 0;

//   return (
//     <Accordion title={section.title} count={selectedCount} defaultOpen={true}>


//       {section.type === "radio" && (
//         <div className="flex flex-col gap-1">
//           {options.map((o) => {
//             const active = val === o.id;
//             return (
//               <div
//                 key={o.id}
//                 role="radio"
//                 aria-checked={active}
//                 onClick={() => {
//                   const nextVal = active ? null : o.id;
//                   onChange(section.id, nextVal);
//                 }}
//                 className={`flex items-center justify-between cursor-pointer group px-2 -mx-2 py-1.5 rounded-lg
//                   transition-colors duration-150 ${active ? "bg-primary/5" : "hover:bg-card/60"}`}
//               >
//                 <span className="flex items-center gap-2.5">
//                   <span
//                     className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200
//                       ${active ? "border-[1.5px] border-primary ring-4 ring-primary/10" : "border-[1.5px] border-border"}`}
//                   >
//                     {active && (
//                       <motion.span
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ type: "spring", stiffness: 500, damping: 25 }}
//                         className="w-2 h-2 rounded-full bg-primary"
//                       />
//                     )}
//                   </span>
//                   <span
//                     className={`text-[13px] font-body transition-colors duration-150 ${active ? "text-heading font-medium" : "text-body"
//                       }`}
//                   >
//                     {o.label}
//                   </span>
//                 </span>
//                 {o.count != null && (
//                   <span className="text-[11px] tabular-nums text-muted">{o.count}</span>
//                 )}
//                 <input
//                   type="radio"
//                   className="sr-only"
//                   checked={active}
//                   readOnly
//                 />
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {section.type === "checkbox" && (
//         <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1 scrollbar-premium">
//           {options.map((o) => {
//             const active = val === o.id;
//             return (
//               <div
//                 key={o.id}
//                 onClick={() => toggleSingle(o.id)}
//                 className={`flex items-center justify-between cursor-pointer px-2 -mx-2 py-1.5 rounded-lg
//                   transition-colors duration-150 ${active ? "bg-primary/5" : "hover:bg-card/60"}`}
//               >
//                 <span className="flex items-center gap-2.5">
//                   <span
//                     className={`w-4 h-4 rounded-[5px] flex items-center justify-center transition-all duration-200
//                       ${active
//                         ? "bg-primary border-[1.5px] border-primary ring-4 ring-primary/10"
//                         : "border-[1.5px] border-border"
//                       }`}
//                   >
//                     {active && (
//                       <motion.span
//                         initial={{ scale: 0, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         transition={{ type: "spring", stiffness: 500, damping: 25 }}
//                       >
//                         <Check size={11} color="#fff" strokeWidth={3} />
//                       </motion.span>
//                     )}
//                   </span>
//                   <span
//                     className={`text-[13px] font-body transition-colors duration-150 ${active ? "text-heading font-medium" : "text-body"
//                       }`}
//                   >
//                     {o.label}
//                   </span>
//                 </span>
//                 {o.count != null && (
//                   <span className="text-[11px] tabular-nums text-muted">{o.count}</span>
//                 )}
//                 <input
//                   type="checkbox"
//                   className="sr-only"
//                   checked={active}
//                   readOnly
//                 />
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {section.type === "toggle" && (
//         <div className="flex flex-col gap-3.5">
//           {options.map((o) => {
//             const active = val === o.id;
//             return (
//               <div key={o.id} className="flex items-center justify-between">
//                 <span
//                   className={`text-[13px] font-body transition-colors duration-150 ${active ? "text-heading font-medium" : "text-body"
//                     }`}
//                 >
//                   {o.label}
//                 </span>
//                 <button
//                   role="switch"
//                   aria-checked={active}
//                   onClick={() => toggleSingle(o.id)}
//                   className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${active ? "bg-primary" : "bg-border"
//                     }`}
//                 >
//                   <motion.span
//                     className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
//                     animate={{ left: active ? 18 : 2 }}
//                     transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                   />
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {section.type === "size" && (
//         <div className="flex flex-wrap gap-2">
//           {options.map((o) => {
//             const active = val === o.id;
//             return (
//               <button
//                 key={o.id}
//                 onClick={() => toggleSingle(o.id)}
//                 className={`min-w-[40px] h-9 px-3 rounded-lg text-[12px] font-medium font-body
//                   transition-all duration-150 ${active
//                     ? "bg-primary-dark text-white border border-primary-dark shadow-[0_2px_8px_-2px_var(--color-primary-dark)] -translate-y-px"
//                     : "bg-transparent text-body border border-border hover:border-primary/40"
//                   }`}
//               >
//                 {o.label}
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {section.type === "color" && (
//         <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1 scrollbar-premium">
//           {options.map((o) => {
//             const active = val === o.id;

//             return (
//               <div
//                 key={o.id}
//                 onClick={() => toggleSingle(o.id)}
//                 className={`flex items-center justify-between cursor-pointer px-2 -mx-2 py-1.5 rounded-lg transition-colors duration-150 ${active ? "bg-primary/5" : "hover:bg-card/60"
//                   }`}
//               >
//                 <span className="flex items-center gap-2.5">
//                   <span
//                     className={`min-w-[20px] h-5 px-2 rounded-md flex items-center justify-center text-[10px] font-medium transition-all duration-200 ${active
//                         ? "bg-primary text-white"
//                         : "bg-surface border border-border text-body"
//                       }`}
//                   >
//                     {active && <Check size={10} strokeWidth={3} />}
//                   </span>

//                   <span
//                     className={`text-[13px] transition-colors duration-150 ${active
//                         ? "text-heading font-medium"
//                         : "text-body"
//                       }`}
//                   >
//                     {o.label}
//                   </span>
//                 </span>

//                 {o.count != null && (
//                   <span className="text-[11px] tabular-nums text-muted">
//                     {o.count}
//                   </span>
//                 )}

//                 <input
//                   type="checkbox"
//                   className="sr-only"
//                   checked={active}
//                   readOnly
//                 />
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {section.type === "range" && (
//         <div>
//           <div className="flex items-center justify-between text-[12.5px] mb-3 font-medium text-heading font-body">
//             <span className="px-2 py-1 rounded-md bg-surface border border-border">
//               {section.unit}
//               {(val as [number, number])[0].toLocaleString("en-IN")}
//             </span>
//             <span className="px-2 py-1 rounded-md bg-surface border border-border">
//               {section.unit}
//               {(val as [number, number])[1].toLocaleString("en-IN")}
//               {(val as [number, number])[1] === section.max ? "+" : ""}
//             </span>
//           </div>

//           <div className="relative flex items-center h-6 mt-2 range-slider-container">
//             <style>{`
//               .range-slider-container input[type="range"] {
//                 -webkit-appearance: none;
//                 -moz-appearance: none;
//                 appearance: none;
//                 pointer-events: none;
//               }
//               .range-slider-container input[type="range"]::-webkit-slider-thumb {
//                 -webkit-appearance: none;
//                 pointer-events: auto;
//                 width: 16px;
//                 height: 16px;
//                 border-radius: 50%;
//                 background: var(--color-primary, #6b21a8);
//                 border: 2px solid #fff;
//                 box-shadow: 0 1px 4px rgba(0,0,0,0.3);
//                 cursor: pointer;
//               }
//               .range-slider-container input[type="range"]::-moz-range-thumb {
//                 -moz-appearance: none;
//                 pointer-events: auto;
//                 width: 16px;
//                 height: 16px;
//                 border-radius: 50%;
//                 background: var(--color-primary, #6b21a8);
//                 border: 2px solid #fff;
//                 box-shadow: 0 1px 4px rgba(0,0,0,0.3);
//                 cursor: pointer;
//               }
//             `}</style>
//             <div className="absolute w-full h-1 rounded-full bg-border" />
//             <div
//               className="absolute h-1 rounded-full"
//               style={{
//                 left: `${minPercent}%`,
//                 width: `${maxPercent - minPercent}%`,
//                 background:
//                   "linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))",
//               }}
//             />
//             <input
//               type="range"
//               min={section.min}
//               max={section.max}
//               step={section.step}
//               value={(val as [number, number])[0]}
//               onChange={(e) => {
//                 const nextMin = Math.min(Number(e.target.value), (val as [number, number])[1] - (section.step ?? 1));
//                 onChange(section.id, [nextMin, (val as [number, number])[1]]);
//               }}
//               style={{
//                 position: "absolute",
//                 width: "100%",
//                 background: "transparent",
//                 zIndex: (val as [number, number])[0] > (section.max ?? 10000) / 2 ? 25 : 20
//               }}
//               className="appearance-none h-1"
//             />
//             <input
//               type="range"
//               min={section.min}
//               max={section.max}
//               step={section.step}
//               value={(val as [number, number])[1]}
//               onChange={(e) => {
//                 const nextMax = Math.max(Number(e.target.value), (val as [number, number])[0] + (section.step ?? 1));
//                 onChange(section.id, [(val as [number, number])[0], nextMax]);
//               }}
//               style={{
//                 position: "absolute",
//                 width: "100%",
//                 background: "transparent",
//                 zIndex: (val as [number, number])[0] > (section.max ?? 10000) / 2 ? 20 : 25
//               }}
//               className="appearance-none h-1"
//             />
//           </div>

//           <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto no-scrollbar">
//             {(section.quickValues ?? []).map((q) => {
//               const active = (val as [number, number])[0] === q;
//               return (
//                 <button
//                   key={q}
//                   onClick={() => onChange(section.id, [q, section.max ?? q])}
//                   className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium font-body whitespace-nowrap
//                     transition-all duration-150 ${active
//                       ? "bg-primary text-white border border-primary shadow-[0_2px_6px_-1px_var(--color-primary)]"
//                       : "bg-surface text-body border border-border hover:border-primary/40"
//                     }`}
//                 >
//                   {section.unit}
//                   {q}+
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </Accordion>
//   );
// }













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
      : null);

  const selectedCount =
    section.type === "range"
      ? 0
      : val
        ? 1
        : 0;

  const toggleSingle = (id: string) => {
    const next = val === id ? null : id;
    onChange(section.id, next);
  };

  const options = section.searchable
    ? (section.options ?? []).filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    )
    : (section.options ?? []);

  const minPercent =
    section.type === "range"
      ? (((val as [number, number])[0] - (section.min ?? 0)) /
        ((section.max ?? 1) - (section.min ?? 0))) *
      100
      : 0;

  const maxPercent =
    section.type === "range"
      ? (((val as [number, number])[1] - (section.min ?? 0)) /
        ((section.max ?? 1) - (section.min ?? 0))) *
      100
      : 0;

  return (
    <Accordion title={section.title} count={selectedCount} defaultOpen={true}>


      {section.type === "radio" && (
        <div className="flex flex-col gap-1">
          {options.map((o) => {
            const active = val === o.id;
            return (
              <div
                key={o.id}
                role="radio"
                aria-checked={active}
                onClick={() => {
                  const nextVal = active ? null : o.id;
                  onChange(section.id, nextVal);
                }}
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
                    className={`text-[13px] font-body transition-colors duration-150 ${active ? "text-heading font-medium" : "text-body"
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
                  readOnly
                />
              </div>
            );
          })}
        </div>
      )}

      {section.type === "checkbox" && (
        <div className="flex flex-col gap-1 pr-1">
          {options.map((o) => {
            const active = val === o.id;
            return (
              <div
                key={o.id}
                onClick={() => toggleSingle(o.id)}
                className={`flex items-center justify-between cursor-pointer px-2 -mx-2 py-1.5 rounded-lg
                  transition-colors duration-150 ${active ? "bg-primary/5" : "hover:bg-card/60"}`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-[5px] flex items-center justify-center transition-all duration-200
                      ${active
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
                    className={`text-[13px] font-body transition-colors duration-150 ${active ? "text-heading font-medium" : "text-body"
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
                  readOnly
                />
              </div>
            );
          })}
        </div>
      )}

      {section.type === "toggle" && (
        <div className="flex flex-col gap-3.5">
          {options.map((o) => {
            const active = val === o.id;
            return (
              <div key={o.id} className="flex items-center justify-between">
                <span
                  className={`text-[13px] font-body transition-colors duration-150 ${active ? "text-heading font-medium" : "text-body"
                    }`}
                >
                  {o.label}
                </span>
                <button
                  role="switch"
                  aria-checked={active}
                  onClick={() => toggleSingle(o.id)}
                  className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${active ? "bg-primary" : "bg-border"
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
            const active = val === o.id;
            return (
              <button
                key={o.id}
                onClick={() => toggleSingle(o.id)}
                className={`min-w-[40px] h-9 px-3 rounded-lg text-[12px] font-medium font-body
                  transition-all duration-150 ${active
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

      {section.type === "color" && (
        <div className="flex flex-col gap-1 pr-1">
          {options.map((o) => {
            const active = val === o.id;

            return (
              <div
                key={o.id}
                onClick={() => toggleSingle(o.id)}
                className={`flex items-center justify-between cursor-pointer px-2 -mx-2 py-1.5 rounded-lg transition-colors duration-150 ${active ? "bg-primary/5" : "hover:bg-card/60"
                  }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`min-w-[20px] h-5 px-2 rounded-md flex items-center justify-center text-[10px] font-medium transition-all duration-200 ${active
                      ? "bg-primary text-white"
                      : "bg-surface border border-border text-body"
                      }`}
                  >
                    {active && <Check size={10} strokeWidth={3} />}
                  </span>

                  <span
                    className={`text-[13px] transition-colors duration-150 ${active
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
                  readOnly
                />
              </div>
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

          <div className="relative flex items-center h-6 mt-2 range-slider-container">
            <style>{`
              .range-slider-container input[type="range"] {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                pointer-events: none;
              }
              .range-slider-container input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                pointer-events: auto;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--color-primary, #6b21a8);
                border: 2px solid #fff;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                cursor: pointer;
              }
              .range-slider-container input[type="range"]::-moz-range-thumb {
                -moz-appearance: none;
                pointer-events: auto;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--color-primary, #6b21a8);
                border: 2px solid #fff;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                cursor: pointer;
              }
            `}</style>
            <div className="absolute w-full h-1 rounded-full bg-border" />
            <div
              className="absolute h-1 rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
                background:
                  "linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))",
              }}
            />
            <input
              type="range"
              min={section.min}
              max={section.max}
              step={section.step}
              value={(val as [number, number])[0]}
              onChange={(e) => {
                const nextMin = Math.min(Number(e.target.value), (val as [number, number])[1] - (section.step ?? 1));
                onChange(section.id, [nextMin, (val as [number, number])[1]]);
              }}
              style={{
                position: "absolute",
                width: "100%",
                background: "transparent",
                zIndex: (val as [number, number])[0] > (section.max ?? 10000) / 2 ? 25 : 20
              }}
              className="appearance-none h-1"
            />
            <input
              type="range"
              min={section.min}
              max={section.max}
              step={section.step}
              value={(val as [number, number])[1]}
              onChange={(e) => {
                const nextMax = Math.max(Number(e.target.value), (val as [number, number])[0] + (section.step ?? 1));
                onChange(section.id, [(val as [number, number])[0], nextMax]);
              }}
              style={{
                position: "absolute",
                width: "100%",
                background: "transparent",
                zIndex: (val as [number, number])[0] > (section.max ?? 10000) / 2 ? 20 : 25
              }}
              className="appearance-none h-1"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {(section.quickValues ?? []).map((q) => {
              const active = (val as [number, number])[0] === q;
              return (
                <button
                  key={q}
                  onClick={() => onChange(section.id, [q, section.max ?? q])}
                  className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium font-body whitespace-nowrap
                    transition-all duration-150 ${active
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
// import { Button } from "../../../../components/ui/FormElements"

// type FormHeaderProps = {
//   completedSections: number;
//   totalSections: number;
//   onClear: () => void;
// };

// /**
//  * Page header: title, a lightweight "sections complete" progress hint,
//  * and the two primary actions (Clear / Publish).
//  */
// const FormHeader = ({
//   completedSections,
//   totalSections,
//   onClear,
// }: FormHeaderProps) => {
//   const handleClear = () => {
//     const confirmed = window.confirm(
//       "Clear this form? Everything you've entered so far will be lost.",
//     );
//     if (confirmed) onClear();
//   };

//   return (
//     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-surface p-6 rounded-xl border border-border shadow-sm">
//       <div>
//         <h2 className="text-3xl font-semibold text-admin-text font-heading tracking-wide">
//           Quick Add Product
//         </h2>
//         <p className="text-sm text-muted mt-1">
//           Streamlined entry for a single SKU mapping to your master taxonomy.
//         </p>
//         <div className="mt-3 flex items-center gap-2">
//           <div className="h-1.5 w-40 overflow-hidden rounded-full bg-card">
//             <div
//               className="h-full rounded-full bg-primary transition-all duration-300"
//               style={{
//                 width: `${(completedSections / totalSections) * 100}%`,
//               }}
//             />
//           </div>
//           <span className="text-xs font-medium text-muted">
//             {completedSections}/{totalSections} sections complete
//           </span>
//         </div>
//       </div>
//       <div className="flex flex-wrap gap-4">
//         <Button type="button" variant="secondary" onClick={handleClear}>
//           Clear
//         </Button>
//         <Button type="submit" variant="primary">
//           Publish SKU
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default FormHeader;


import { Button } from "../../../../components/ui/FormElements"

type FormHeaderProps = {
  completedSections: number;
  totalSections: number;
  onClear: () => void;
};

/**
 * Page header: title, a lightweight "sections complete" progress hint,
 * and the two primary actions (Clear / Publish).
 */
const FormHeader = ({
  completedSections,
  totalSections,
  onClear,
}: FormHeaderProps) => {
  const handleClear = () => {
    const confirmed = window.confirm(
      "Clear this form? Everything you've entered so far will be lost.",
    );
    if (confirmed) onClear();
  };

  const progress = totalSections > 0
    ? (completedSections / totalSections) * 100
    : 0;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        {/* Title + progress */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-admin-text font-heading tracking-tight">
            Quick Add Product
          </h2>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Streamlined entry for a single SKU mapping to your master taxonomy.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-1 w-32 overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted tabular-nums">
              {completedSections}/{totalSections} sections
            </span>
          </div>
        </div>

        {/* Divider (desktop only) */}
        <div className="hidden md:block h-10 w-px bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Button type="button" variant="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button type="submit" variant="primary">
            Publish SKU
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
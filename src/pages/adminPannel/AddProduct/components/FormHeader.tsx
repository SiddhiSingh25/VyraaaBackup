// import { RiCheckLine } from "react-icons/ri";

// type FormHeaderProps = {
//   completedSections: number;
//   totalSections: number;
// };

// const steps = ["Category", "Product", "Inventory", "Media"];

// const FormHeader = ({ completedSections, totalSections }: FormHeaderProps) => {
//   return (
//     <div className="sticky top-0 z-40  bg-background/95 backdrop-blur-md">
//       <div className="mx-auto max-w-7xl px-8 py-3">
//         <div className="grid grid-cols-[260px_1fr_170px] items-start gap-8">
//           {/* Left */}
//           <div>
//             <h1 className="text-2xl font-semibold tracking-tight">
//               Quick Add Product
//             </h1>

//             <p className="mt-1 text-sm text-muted">
//               Complete the product information.
//             </p>
//           </div>

//           {/* Middle */}
//           <div className="pt-1">
//             <div className="flex items-center">
//               {steps.map((step, index) => {
//                 const completed = index < completedSections;
//                 const active = index === completedSections;

//                 return (
//                   <div key={step} className="flex flex-1 items-center">
//                     <div className="flex flex-col items-center">
//                       <div
//                         className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all
//                         ${
//                           completed
//                             ? "bg-primary border-primary text-white"
//                             : active
//                               ? "border-primary bg-primary/10 text-primary"
//                               : "border-border bg-white text-muted"
//                         }`}
//                       >
//                         {completed ? (
//                           <RiCheckLine className="text-sm" />
//                         ) : (
//                           index + 1
//                         )}
//                       </div>

//                       <span
//                         className={`mt-2 text-[11px] font-medium whitespace-nowrap ${
//                           completed || active ? "text-foreground" : "text-muted"
//                         }`}
//                       >
//                         {step}
//                       </span>
//                     </div>

//                     {index !== steps.length - 1 && (
//                       <div className="mx-2 mb-5 h-0.5 flex-1 bg-border">
//                         <div
//                           className={`h-full transition-all duration-300 ${
//                             completed ? "bg-primary w-full" : "w-0 bg-primary"
//                           }`}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Right */}
//           <div className="flex justify-end">
//             <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
//               {completedSections} / {totalSections} Completed
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormHeader;
import { RiCheckLine } from "react-icons/ri";

type FormHeaderProps = {
  completedSections: number;
  totalSections: number;
};

const steps = ["Category", "Product", "Inventory", "Media"];

const FormHeader = ({ completedSections, totalSections }: FormHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl py-3 ">
        <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[260px_1fr_170px] lg:gap-8">
          {/* Left */}
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl lg:text-2xl">
                Quick Add Product
              </h1>

              <p className="mt-0.5 text-xs text-muted sm:text-sm lg:mt-1">
                Complete the product information.
              </p>
            </div>

        
          </div>

          {/* Middle */}
          <div className="overflow-x-auto pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-[420px] items-center sm:min-w-0">
              {steps.map((step, index) => {
                const completed = index < completedSections;
                const active = index === completedSections;

                return (
                  <div key={step} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-all sm:h-8 sm:w-8
                        ${
                          completed
                            ? "bg-primary border-primary text-white"
                            : active
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-white text-muted"
                        }`}
                      >
                        {completed ? (
                          <RiCheckLine className="text-sm" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <span
                        className={`mt-1.5 text-[10px] font-medium whitespace-nowrap sm:mt-2 sm:text-[11px] ${
                          completed || active ? "text-foreground" : "text-muted"
                        }`}
                      >
                        {step}
                      </span>
                    </div>

                    {index !== steps.length - 1 && (
                      <div className="mx-1.5 mb-5 h-0.5 flex-1 bg-border sm:mx-2">
                        <div
                          className={`h-full transition-all duration-300 ${
                            completed ? "bg-primary w-full" : "w-0 bg-primary"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right (desktop only, mobile/tablet version rendered above) */}
          <div className="hidden justify-end lg:flex">
            <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              {completedSections} / {totalSections} Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
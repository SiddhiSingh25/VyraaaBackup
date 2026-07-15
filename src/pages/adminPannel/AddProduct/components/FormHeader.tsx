import { Button } from "../../../../components/ui/FormElements";
import { RiDeleteBinLine, RiCheckLine } from "react-icons/ri";

type FormHeaderProps = {
  completedSections: number;
  totalSections: number;
};

const steps = ["Basic Info", "Category", "Pricing", "Media", "Review"];

const FormHeader = ({ completedSections, totalSections }: FormHeaderProps) => {
  const progress = Math.min((completedSections / totalSections) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-[24px] font-admin-text text-sm font-semibold tracking-tight ">
            Quick Add Product
          </h1>
          <p className=" text-sm text-muted max-w-2xl leading-relaxed">
            Complete each section to create a new product.
          </p>
        </div>
      </div>
      <div className="mt-10 mx-36 flex items-start justify-between">
        {steps.map((step, index) => {
          const completed = index < completedSections;
          const active = index === completedSections;

          return (
            <div
              key={step}
              className="relative flex flex-1 items-center top-0 z-50"
            >
              <div className="flex w-full flex-col items-center">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300",
                    completed
                      ? "bg-primary border-primary text-white"
                      : active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-white text-muted",
                  ].join(" ")}
                >
                  {completed ? <RiCheckLine className="text-sm" /> : index + 1}
                </div>

                <span
                  className={[
                    "mt-2 text-[11px] font-medium text-center leading-4",
                    completed || active ? "" : "text-muted",
                  ].join(" ")}
                >
                  {step}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={[
                    "absolute left-1/2 top-4 h-0.5 w-full",
                    completed ? "bg-primary" : "bg-border",
                  ].join(" ")}
                  style={{
                    transform: "translateX(18px)",
                    width: "calc(100% - 36px)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormHeader;

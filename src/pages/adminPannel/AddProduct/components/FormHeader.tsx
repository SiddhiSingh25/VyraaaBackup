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

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-surface p-6 rounded-xl border border-border shadow-sm">
      <div>
        <h2 className="text-3xl font-semibold text-heading font-heading tracking-wide">
          Quick Add Product
        </h2>
        <p className="text-sm text-muted mt-1">
          Streamlined entry for a single SKU mapping to your master taxonomy.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-card">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${(completedSections / totalSections) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs font-medium text-muted">
            {completedSections}/{totalSections} sections complete
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button type="button" variant="secondary" onClick={handleClear}>
          Clear
        </Button>
        <Button type="submit" variant="primary">
          Publish SKU
        </Button>
      </div>
    </div>
  );
};

export default FormHeader;

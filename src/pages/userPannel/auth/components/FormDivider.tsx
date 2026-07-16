interface FormDividerProps {
  label?: string;
}

/**
 * Horizontal divider with optional centered label (e.g. "or continue with").
 */
const FormDivider = ({ label }: FormDividerProps) => {
  if (!label) {
    return <div className="my-7 h-px w-full bg-border/60" />;
  }

  return (
    <div className="my-7 flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
};

export default FormDivider;

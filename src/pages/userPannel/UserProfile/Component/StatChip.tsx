interface StatChipProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export function StatChip({ label, value, icon }: StatChipProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border min-w-[140px]">
      <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-heading text-lg text-heading leading-none">{value}</p>
        <p className="text-xs text-muted mt-1 truncate">{label}</p>
      </div>
    </div>
  );
}

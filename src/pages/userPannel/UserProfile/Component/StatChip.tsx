import { Link } from "react-router-dom";

interface StatChipProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function StatChip({ label, value, icon, to = "#", onClick }: StatChipProps) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border min-w-[140px]"
    >
      <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-heading text-lg text-admin-text leading-none">{value}</p>
        <p className="text-xs text-muted mt-1 truncate">{label}</p>
      </div>
    </Link>
  );
}


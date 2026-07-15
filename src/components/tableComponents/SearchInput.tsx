import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-300" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 rounded-lg border border-dark-200 bg-dark-50/60 pl-10 pr-3.5 text-sm text-dark-900
          placeholder:text-dark-300 outline-none transition-shadow focus:bg-white focus:ring-4 focus:ring-dark-900/10 focus:border-dark-300"
      />
    </div>
  );
}

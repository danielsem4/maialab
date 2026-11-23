import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface YearFilterProps {
  value: number | null;
  options: number[];
  onChange: (value: number | null) => void;
}

interface YearChipProps {
  label: string;
  value: number | null;
  active: boolean;
  onChange: (value: number | null) => void;
}

function YearChip({ label, value, active, onChange }: YearChipProps) {
  const handleClick = () => {
    onChange(value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium sm:min-h-0 sm:py-1.5 tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50 hover:text-primary",
      )}
    >
      {label}
    </button>
  );
}

export function YearFilter({ value, options, onChange }: YearFilterProps) {
  const { t } = useTranslation();

  if (options.length < 2) return null;

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:p-0">
      <YearChip label={t("publications.allYears")} value={null} active={value === null} onChange={onChange} />
      {options.map((year) => (
        <YearChip key={year} label={String(year)} value={year} active={value === year} onChange={onChange} />
      ))}
    </div>
  );
}

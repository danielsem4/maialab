import { useTranslation } from "react-i18next";
import type { ProjectStatus } from "@/common/types/Project";
import { cn } from "@/lib/utils";

interface StatusFilterProps {
  value: ProjectStatus | null;
  options: ProjectStatus[];
  onChange: (value: ProjectStatus | null) => void;
}

interface FilterChipProps {
  label: string;
  value: ProjectStatus | null;
  active: boolean;
  onChange: (value: ProjectStatus | null) => void;
}

function FilterChip({ label, value, active, onChange }: FilterChipProps) {
  const handleClick = () => {
    onChange(value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium sm:min-h-0 sm:py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50 hover:text-primary",
      )}
    >
      {label}
    </button>
  );
}

export function StatusFilter({ value, options, onChange }: StatusFilterProps) {
  const { t } = useTranslation();

  if (options.length < 2) return null;

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:p-0">
      <FilterChip label={t("projects.filterAll")} value={null} active={value === null} onChange={onChange} />
      {options.map((status) => (
        <FilterChip
          key={status}
          label={t(`projects.status.${status}`)}
          value={status}
          active={value === status}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

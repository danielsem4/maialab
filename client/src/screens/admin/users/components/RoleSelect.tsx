import { useTranslation } from "react-i18next";
import { ADMIN_ROLES, type AdminRole } from "@/common/types/AdminUser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoleSelectProps {
  id?: string;
  value: AdminRole;
  onChange: (role: AdminRole) => void;
  disabled?: boolean;
  className?: string;
}

export function RoleSelect({ id, value, onChange, disabled, className }: RoleSelectProps) {
  const { t } = useTranslation();

  const handleValueChange = (next: string) => {
    onChange(next as AdminRole);
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger id={id} className={className} aria-label={t("users.fields.role")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ADMIN_ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {t(`users.roles.${role}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

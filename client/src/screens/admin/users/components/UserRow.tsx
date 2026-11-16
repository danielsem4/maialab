import { useTranslation } from "react-i18next";
import type { AdminRole, IAdminUser } from "@/common/types/AdminUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { RoleSelect } from "./RoleSelect";

interface UserRowProps {
  user: IAdminUser;
  isSelf: boolean;
  disabled: boolean;
  onRoleChange: (user: IAdminUser, role: AdminRole) => void;
  onToggleActive: (user: IAdminUser) => void;
}

export function UserRow({ user, isSelf, disabled, onRoleChange, onToggleActive }: UserRowProps) {
  const { t } = useTranslation();

  const handleRoleChange = (role: AdminRole) => {
    onRoleChange(user, role);
  };

  const handleToggleActive = () => {
    onToggleActive(user);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <span dir="auto">{user.name}</span>
        {isSelf && (
          <Badge variant="secondary" className="ms-2">
            {t("users.you")}
          </Badge>
        )}
      </TableCell>
      <TableCell dir="ltr" className="text-start">
        {user.email}
      </TableCell>
      <TableCell>
        <RoleSelect value={user.role} onChange={handleRoleChange} disabled={isSelf || disabled} className="w-36" />
      </TableCell>
      <TableCell>
        <Badge variant={user.isActive ? "outline" : "destructive"}>
          {user.isActive ? t("users.active") : t("users.inactive")}
        </Badge>
      </TableCell>
      <TableCell className="text-end">
        <Button variant="outline" size="sm" onClick={handleToggleActive} disabled={isSelf || disabled}>
          {user.isActive ? t("users.deactivate") : t("users.activate")}
        </Button>
      </TableCell>
    </TableRow>
  );
}

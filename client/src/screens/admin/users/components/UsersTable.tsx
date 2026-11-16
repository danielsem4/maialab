import { useTranslation } from "react-i18next";
import type { AdminRole, IAdminUser } from "@/common/types/AdminUser";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRow } from "./UserRow";

interface UsersTableProps {
  users: IAdminUser[];
  disabled: boolean;
  isCurrentUser: (user: IAdminUser) => boolean;
  onRoleChange: (user: IAdminUser, role: AdminRole) => void;
  onToggleActive: (user: IAdminUser) => void;
}

export function UsersTable({ users, disabled, isCurrentUser, onRoleChange, onToggleActive }: UsersTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">{t("users.fields.name")}</TableHead>
            <TableHead className="text-start">{t("users.fields.email")}</TableHead>
            <TableHead className="text-start">{t("users.fields.role")}</TableHead>
            <TableHead className="text-start">{t("users.fields.status")}</TableHead>
            <TableHead className="text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={isCurrentUser(user)}
              disabled={disabled}
              onRoleChange={onRoleChange}
              onToggleActive={onToggleActive}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

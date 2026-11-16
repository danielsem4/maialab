import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { NewUserDialog } from "./components/NewUserDialog";
import { UsersTable } from "./components/UsersTable";
import { useUsersList } from "./hooks/useUsersList";

export default function UsersList() {
  const { t } = useTranslation();
  const list = useUsersList();

  if (!list.isSuperAdmin) return <Navigate to="/admin" replace />;

  return (
    <div>
      <AdminPageHeader title={t("users.title")} actions={<NewUserDialog />} />
      <QueryState
        isLoading={list.isLoading}
        isError={list.isError}
        onRetry={list.handleRetry}
        isEmpty={list.users.length === 0}
        empty={t("users.empty")}
      >
        <UsersTable
          users={list.users}
          disabled={list.isUpdating}
          isCurrentUser={list.isCurrentUser}
          onRoleChange={list.handleRoleChange}
          onToggleActive={list.handleToggleActive}
        />
      </QueryState>
    </div>
  );
}

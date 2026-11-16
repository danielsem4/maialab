import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IMember } from "@/common/types/Member";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { SortableList } from "@/components/common/SortableList";
import { Button } from "@/components/ui/button";
import { MemberListRow } from "./components/MemberListRow";
import { useMembersList } from "./hooks/useMembersList";

const getMemberId = (member: IMember) => member.id;

export default function MembersList() {
  const { t } = useTranslation();
  const list = useMembersList();

  const renderRow = (member: IMember) => <MemberListRow member={member} onDelete={list.handleDelete} />;

  return (
    <div>
      <AdminPageHeader
        title={t("members.title")}
        actions={
          <Button asChild>
            <Link to="/admin/members/new">
              <Plus className="size-4" />
              {t("members.newMember")}
            </Link>
          </Button>
        }
      />
      <QueryState
        isLoading={list.isLoading}
        isError={list.isError}
        onRetry={list.handleRetry}
        isEmpty={list.members.length === 0}
        empty={t("members.empty")}
      >
        <SortableList items={list.members} getId={getMemberId} onReorder={list.handleReorder} renderItem={renderRow} />
      </QueryState>
    </div>
  );
}

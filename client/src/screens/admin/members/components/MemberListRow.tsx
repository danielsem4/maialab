import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IMember } from "@/common/types/Member";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { PublishedBadge } from "@/components/common/PublishedBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MemberListRowProps {
  member: IMember;
  onDelete: (id: number) => void;
}

export function MemberListRow({ member, onDelete }: MemberListRowProps) {
  const { t } = useTranslation();

  const handleDelete = () => {
    onDelete(member.id);
  };

  return (
    <div className="flex items-center gap-3">
      {member.photo ? (
        <img src={member.photo.url} alt="" className="size-12 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="size-12 shrink-0 rounded-full bg-muted" />
      )}
      <div className="min-w-0 flex-1">
        <Link to={`/admin/members/${member.id}`} className="block truncate font-medium hover:underline">
          {member.name}
        </Link>
        {member.title && <p className="truncate text-sm text-muted-foreground">{member.title}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <PublishedBadge published={member.published} offKey="common.hidden" />
          <Badge variant="secondary">{t(`members.category.${member.category}`)}</Badge>
        </div>
      </div>
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/admin/members/${member.id}`} aria-label={t("common.edit")}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <ConfirmDeleteButton name={member.name} onConfirm={handleDelete} />
    </div>
  );
}

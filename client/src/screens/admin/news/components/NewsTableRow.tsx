import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { INewsPost } from "@/common/types/NewsPost";
import { formatFullDate } from "@/common/utils/formatDate";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { PublishedBadge } from "@/components/common/PublishedBadge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface NewsTableRowProps {
  post: INewsPost;
  onDelete: (id: number) => void;
}

export function NewsTableRow({ post, onDelete }: NewsTableRowProps) {
  const { t, i18n } = useTranslation();

  const handleDelete = () => {
    onDelete(post.id);
  };

  return (
    <TableRow>
      <TableCell className="max-w-md">
        <Link to={`/admin/news/${post.id}`} className="block truncate font-medium hover:underline" dir="auto">
          {post.title}
        </Link>
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">{formatFullDate(post.date, i18n.language)}</TableCell>
      <TableCell>
        <PublishedBadge published={post.published} />
      </TableCell>
      <TableCell className="text-end">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/admin/news/${post.id}`} aria-label={t("common.edit")}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <ConfirmDeleteButton name={post.title} onConfirm={handleDelete} />
        </div>
      </TableCell>
    </TableRow>
  );
}

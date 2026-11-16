import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IPublication } from "@/common/types/Publication";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { PublishedBadge } from "@/components/common/PublishedBadge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface PublicationTableRowProps {
  publication: IPublication;
  onDelete: (id: number) => void;
}

export function PublicationTableRow({ publication, onDelete }: PublicationTableRowProps) {
  const { t } = useTranslation();
  const editPath = `/admin/publications/${publication.id}`;

  const handleDelete = () => {
    onDelete(publication.id);
  };

  return (
    <TableRow>
      <TableCell className="max-w-sm whitespace-normal">
        <Link to={editPath} className="font-medium hover:underline" dir="auto">
          {publication.title}
        </Link>
      </TableCell>
      <TableCell className="tabular-nums">{publication.year}</TableCell>
      <TableCell className="max-w-48 truncate text-muted-foreground">{publication.venue}</TableCell>
      <TableCell className="max-w-48 truncate text-muted-foreground">{publication.project?.title}</TableCell>
      <TableCell>
        <PublishedBadge published={publication.published} offKey="common.hidden" />
      </TableCell>
      <TableCell className="text-end">
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" asChild>
            <Link to={editPath} aria-label={t("common.edit")}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <ConfirmDeleteButton name={publication.title} onConfirm={handleDelete} />
        </div>
      </TableCell>
    </TableRow>
  );
}

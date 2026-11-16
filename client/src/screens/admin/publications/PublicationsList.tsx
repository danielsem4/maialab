import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PublicationTableRow } from "./components/PublicationTableRow";
import { usePublicationsList } from "./hooks/usePublicationsList";

export default function PublicationsList() {
  const { t } = useTranslation();
  const list = usePublicationsList();

  return (
    <div>
      <AdminPageHeader
        title={t("publications.title")}
        actions={
          <Button asChild>
            <Link to="/admin/publications/new">
              <Plus className="size-4" />
              {t("publications.newPublication")}
            </Link>
          </Button>
        }
      />
      <QueryState
        isLoading={list.isLoading}
        isError={list.isError}
        onRetry={list.handleRetry}
        isEmpty={list.publications.length === 0}
        empty={t("publications.empty")}
      >
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("publications.fields.title")}</TableHead>
                <TableHead>{t("publications.fields.year")}</TableHead>
                <TableHead>{t("publications.fields.venue")}</TableHead>
                <TableHead>{t("publications.fields.project")}</TableHead>
                <TableHead>{t("common.published")}</TableHead>
                <TableHead className="text-end">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.publications.map((publication) => (
                <PublicationTableRow key={publication.id} publication={publication} onDelete={list.handleDelete} />
              ))}
            </TableBody>
          </Table>
        </div>
      </QueryState>
    </div>
  );
}

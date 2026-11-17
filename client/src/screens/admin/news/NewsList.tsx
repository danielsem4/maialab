import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewsTableRow } from "./components/NewsTableRow";
import { useNewsList } from "./hooks/useNewsList";

export default function NewsList() {
  const { t } = useTranslation();
  const list = useNewsList();

  return (
    <div>
      <AdminPageHeader
        title={t("news.title")}
        actions={
          <Button asChild>
            <Link to="/admin/news/new">
              <Plus className="size-4" />
              {t("news.newPost")}
            </Link>
          </Button>
        }
      />
      <QueryState
        isLoading={list.isLoading}
        isError={list.isError}
        onRetry={list.handleRetry}
        isEmpty={list.posts.length === 0}
        empty={t("news.empty")}
      >
        <div className="rounded-xl glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("news.fields.title")}</TableHead>
                <TableHead>{t("news.fields.date")}</TableHead>
                <TableHead>{t("common.published")}</TableHead>
                <TableHead className="text-end">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.posts.map((post) => (
                <NewsTableRow key={post.id} post={post} onDelete={list.handleDelete} />
              ))}
            </TableBody>
          </Table>
        </div>
      </QueryState>
    </div>
  );
}

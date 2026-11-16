import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { BackButton } from "@/components/ui/BackButton";
import { NewsEditorActions } from "./components/NewsEditorActions";
import { NewsFormFields } from "./components/NewsFormFields";
import { useNewsEditor } from "./hooks/useNewsEditor";

export default function NewsEditor() {
  const { t } = useTranslation();
  const editor = useNewsEditor();

  return (
    <div>
      <BackButton to="/admin/news" />
      <AdminPageHeader
        title={editor.isNew ? t("news.newPost") : (editor.post?.title ?? t("news.editPost"))}
        actions={<NewsEditorActions post={editor.post} isSaving={editor.isSaving} onDelete={editor.handleDelete} />}
      />
      <QueryState isLoading={editor.isLoading} isError={editor.isError}>
        <form id="news-form" onSubmit={editor.handleSubmit} className="space-y-6" noValidate>
          <NewsFormFields form={editor.form} />
        </form>
      </QueryState>
    </div>
  );
}

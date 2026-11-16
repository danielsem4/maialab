import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { QueryState } from "@/components/common/QueryState";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { PublicationDetailsSection } from "./components/PublicationDetailsSection";
import { PublicationLinksSection } from "./components/PublicationLinksSection";
import { usePublicationEditor } from "./hooks/usePublicationEditor";

export default function PublicationEditor() {
  const { t } = useTranslation();
  const editor = usePublicationEditor();
  const title = editor.isNew
    ? t("publications.newPublication")
    : (editor.publication?.title ?? t("publications.editPublication"));

  return (
    <div>
      <BackButton to="/admin/publications" />
      <AdminPageHeader
        title={title}
        actions={
          <>
            {editor.publication && (
              <ConfirmDeleteButton name={editor.publication.title} onConfirm={editor.handleDelete} withLabel />
            )}
            <LoadingButton type="submit" form="publication-form" loading={editor.isSaving} loadingText={t("common.saving")}>
              {t("common.save")}
            </LoadingButton>
          </>
        }
      />
      <QueryState isLoading={editor.isLoading} isError={editor.isError}>
        <form id="publication-form" onSubmit={editor.handleSubmit} className="space-y-6" noValidate>
          <PublicationDetailsSection form={editor.form} />
          <PublicationLinksSection form={editor.form} />
        </form>
      </QueryState>
    </div>
  );
}

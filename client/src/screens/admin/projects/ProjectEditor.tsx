import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { BackButton } from "@/components/ui/BackButton";
import { ProjectContentSection } from "./components/ProjectContentSection";
import { ProjectDetailsSection } from "./components/ProjectDetailsSection";
import { ProjectEditorActions } from "./components/ProjectEditorActions";
import { ProjectGallerySection } from "./components/ProjectGallerySection";
import { ProjectMembersSection } from "./components/ProjectMembersSection";
import { useProjectEditor } from "./hooks/useProjectEditor";

export default function ProjectEditor() {
  const { t } = useTranslation();
  const editor = useProjectEditor();

  return (
    <div>
      <BackButton to="/admin/projects" />
      <AdminPageHeader
        title={editor.isNew ? t("projects.newProject") : (editor.project?.title ?? t("projects.editProject"))}
        actions={
          <ProjectEditorActions
            project={editor.project}
            isSaving={editor.isSaving}
            onDelete={editor.handleDelete}
          />
        }
      />
      <QueryState isLoading={editor.isLoading} isError={editor.isError}>
        <form id="project-form" onSubmit={editor.handleSubmit} className="space-y-6" noValidate>
          <ProjectDetailsSection form={editor.form} />
          <ProjectContentSection form={editor.form} />
          <ProjectGallerySection form={editor.form} />
          <ProjectMembersSection form={editor.form} />
        </form>
      </QueryState>
    </div>
  );
}

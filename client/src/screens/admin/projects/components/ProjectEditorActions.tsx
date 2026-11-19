import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IProject } from "@/common/types/Project";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface ProjectEditorActionsProps {
  project: IProject | undefined;
  isSaving: boolean;
  onDelete: () => void;
}

export function ProjectEditorActions({ project, isSaving, onDelete }: ProjectEditorActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      {project && (
        <>
          {project.published && (
            <Button variant="ghost" asChild>
              <Link to={`/projects/${project.slug}`} target="_blank">
                <ExternalLink className="size-4" />
                {t("common.viewOnSite")}
              </Link>
            </Button>
          )}
          <ConfirmDeleteButton name={project.title} onConfirm={onDelete} withLabel />
        </>
      )}
      <LoadingButton type="submit" form="project-form" loading={isSaving} loadingText={t("common.saving")}>
        {t("common.save")}
      </LoadingButton>
    </>
  );
}

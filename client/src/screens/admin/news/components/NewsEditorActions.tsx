import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { INewsPost } from "@/common/types/NewsPost";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface NewsEditorActionsProps {
  post: INewsPost | undefined;
  isSaving: boolean;
  onDelete: () => void;
}

export function NewsEditorActions({ post, isSaving, onDelete }: NewsEditorActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      {post && (
        <>
          {post.published && (
            <Button variant="ghost" asChild>
              <Link to={`/news/${post.slug}`} target="_blank">
                <ExternalLink className="size-4" />
                {t("common.viewOnSite")}
              </Link>
            </Button>
          )}
          <ConfirmDeleteButton name={post.title} onConfirm={onDelete} withLabel />
        </>
      )}
      <LoadingButton type="submit" form="news-form" loading={isSaving} loadingText={t("common.saving")}>
        {t("common.save")}
      </LoadingButton>
    </>
  );
}

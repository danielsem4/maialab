import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { IdentitySection } from "./components/IdentitySection";
import { SocialLinksSection } from "./components/SocialLinksSection";
import { useLabInfoEditor } from "./hooks/useLabInfoEditor";

export default function LabInfoEditor() {
  const { t } = useTranslation();
  const editor = useLabInfoEditor();

  return (
    <div>
      <AdminPageHeader
        title={t("labInfo.title")}
        description={t("labInfo.description")}
        actions={
          <LoadingButton type="submit" form="lab-info-form" loading={editor.isSaving} loadingText={t("common.saving")}>
            {t("common.save")}
          </LoadingButton>
        }
      />
      <QueryState isLoading={editor.isLoading} isError={editor.isError} onRetry={editor.handleRetry}>
        <form id="lab-info-form" onSubmit={editor.handleSubmit} className="space-y-6" noValidate>
          <IdentitySection form={editor.form} />
          <AboutSection form={editor.form} />
          <ContactSection form={editor.form} />
          <SocialLinksSection form={editor.form} />
        </form>
      </QueryState>
    </div>
  );
}

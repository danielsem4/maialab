import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { QueryState } from "@/components/common/QueryState";
import { BackButton } from "@/components/ui/BackButton";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { MemberDetailsSection } from "./components/MemberDetailsSection";
import { MemberLinksSection } from "./components/MemberLinksSection";
import { MemberProfileSection } from "./components/MemberProfileSection";
import { useMemberEditor } from "./hooks/useMemberEditor";

export default function MemberEditor() {
  const { t } = useTranslation();
  const editor = useMemberEditor();

  return (
    <div>
      <BackButton to="/admin/members" />
      <AdminPageHeader
        title={editor.isNew ? t("members.newMember") : (editor.member?.name ?? t("members.editMember"))}
        actions={
          <>
            {editor.member && <ConfirmDeleteButton name={editor.member.name} onConfirm={editor.handleDelete} withLabel />}
            <LoadingButton type="submit" form="member-form" loading={editor.isSaving} loadingText={t("common.saving")}>
              {t("common.save")}
            </LoadingButton>
          </>
        }
      />
      <QueryState isLoading={editor.isLoading} isError={editor.isError}>
        <form id="member-form" onSubmit={editor.handleSubmit} className="space-y-6" noValidate>
          <MemberDetailsSection form={editor.form} />
          <MemberProfileSection form={editor.form} />
          <MemberLinksSection form={editor.form} />
        </form>
      </QueryState>
    </div>
  );
}

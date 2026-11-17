import { FileText, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="quick-actions-heading">
      <h3 id="quick-actions-heading" className="mb-3 text-sm font-medium text-muted-foreground">
        {t("dashboard.quickActions")}
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/admin/projects/new">
            <Plus className="size-4" />
            {t("projects.newProject")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/members/new">
            <UserPlus className="size-4" />
            {t("members.newMember")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/presentations">
            <FileText className="size-4" />
            {t("nav.presentations")}
          </Link>
        </Button>
      </div>
    </section>
  );
}

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

interface PublishedBadgeProps {
  published: boolean;
  /** Label for the unpublished state; defaults to "Draft". */
  offKey?: string;
}

export function PublishedBadge({ published, offKey = "common.draft" }: PublishedBadgeProps) {
  const { t } = useTranslation();

  return (
    <Badge variant={published ? "default" : "outline"}>
      {published ? t("common.published") : t(offKey)}
    </Badge>
  );
}

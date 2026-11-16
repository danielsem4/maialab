import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface PublicNotFoundProps {
  backTo: string;
  backLabel: string;
}

export function PublicNotFound({ backTo, backLabel }: PublicNotFoundProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">{t("common.notFoundTitle")}</h1>
      <p className="mt-3 text-muted-foreground">{t("common.notFoundDesc")}</p>
      <Button asChild variant="outline" className="mt-8">
        <Link to={backTo}>{backLabel}</Link>
      </Button>
    </div>
  );
}

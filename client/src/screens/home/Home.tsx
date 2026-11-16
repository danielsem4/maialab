import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <p className="text-muted-foreground">{t("common.comingSoon")}</p>
    </div>
  );
}

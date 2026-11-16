import { useTranslation } from "react-i18next";
import { formatMonthYear } from "@/common/utils/formatDate";

/** "Mar 2023 – present" style period label for a project, or "" when undated. */
export function useProjectPeriod() {
  const { t, i18n } = useTranslation();

  return (startDate: string | null, endDate: string | null): string => {
    if (!startDate && !endDate) return "";
    const start = formatMonthYear(startDate, i18n.language);
    const end = endDate ? formatMonthYear(endDate, i18n.language) : t("projects.present");
    return start ? t("projects.period", { start, end }) : end;
  };
}

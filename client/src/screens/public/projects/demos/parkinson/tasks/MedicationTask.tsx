import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskLayout } from "../../components/TaskLayout";
import { MedicationCard } from "../components/MedicationCard";
import { MedicationDialog } from "../components/MedicationDialog";
import { useMedicationReport } from "../hooks/useMedicationReport";

/** The medication list: tap a medication to report taking it, changing the date and time if needed. */
export function MedicationTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const meds = useMedicationReport();

  function handleNext() {
    onComplete(true);
  }

  return (
    <TaskLayout instruction={t("demos.parkinson.tasks.medication.instruction")}>
      <div className="flex size-full flex-col gap-4 px-8 pb-10">
        <div className="relative shrink-0">
          <Input
            type="search"
            value={meds.query}
            onChange={meds.handleQueryChange}
            placeholder={t("demos.parkinson.tasks.medication.search")}
            aria-label={t("demos.parkinson.tasks.medication.search")}
            className="h-12 rounded-full ps-5 pe-12 text-lg md:text-lg"
          />
          <Search className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-1">
          {meds.medications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} reportedAt={meds.reports[medication.id]} onSelect={meds.open} />
          ))}
          {meds.medications.length === 0 && (
            <p className="py-6 text-center text-muted-foreground">{t("demos.parkinson.tasks.medication.noResults")}</p>
          )}
        </div>
        <Button size="lg" className="h-14 w-full shrink-0 text-lg" onClick={handleNext} disabled={meds.reportedCount === 0}>
          {t("demos.common.next")}
        </Button>
      </div>
      {meds.openMedication && (
        <MedicationDialog
          medication={meds.openMedication}
          doseTime={meds.doseTime}
          editing={meds.editing}
          onEdit={meds.startEditing}
          onCancelEdit={meds.stopEditing}
          onSaveTime={meds.saveDoseTime}
          onReport={meds.report}
          onClose={meds.close}
        />
      )}
    </TaskLayout>
  );
}

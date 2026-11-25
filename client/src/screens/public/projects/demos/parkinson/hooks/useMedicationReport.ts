import { useState, type ChangeEvent } from "react";
import type { MedicationReports } from "@/common/types/Parkinson";
import { filterMedications } from "@/common/utils/parkinsonUtils";
import { MEDICATIONS } from "../parkinsonData";

/** The medication screen's state: the search, the open dialog with its dose time, and what was reported. */
export function useMedicationReport() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [doseTime, setDoseTime] = useState(() => new Date());
  const [editing, setEditing] = useState(false);
  const [reports, setReports] = useState<MedicationReports>({});

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  /** Opens a medication's dialog at its reported time, or at "now" for a new report. */
  function open(id: string) {
    setDoseTime(reports[id] ?? new Date());
    setEditing(false);
    setOpenId(id);
  }

  function close() {
    setOpenId(null);
  }

  function startEditing() {
    setEditing(true);
  }

  function stopEditing() {
    setEditing(false);
  }

  function saveDoseTime(time: Date) {
    setDoseTime(time);
    setEditing(false);
  }

  function report() {
    if (openId) setReports({ ...reports, [openId]: doseTime });
    close();
  }

  return {
    query,
    handleQueryChange,
    medications: filterMedications(MEDICATIONS, query),
    openMedication: MEDICATIONS.find((medication) => medication.id === openId) ?? null,
    doseTime,
    editing,
    reports,
    reportedCount: Object.keys(reports).length,
    open,
    close,
    startEditing,
    stopEditing,
    saveDoseTime,
    report,
  };
}

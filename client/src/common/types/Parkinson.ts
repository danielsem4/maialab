export interface IMedication {
  id: string;
  /** Brand name as printed on the pack — shown as is in every language. */
  name: string;
}

/** When each reported medication was taken, by medication id. */
export type MedicationReports = Record<string, Date>;

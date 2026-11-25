import type { IMedication } from "@/common/types/Parkinson";

export const MEDICATIONS: IMedication[] = [
  { id: "stalevo", name: "STALEVO 100/25/200 MG TAB" },
  { id: "dopicar", name: "DOPICAR 250/25 MG TAB" },
  { id: "azilect", name: "AZILECT 1 MG TAB" },
  { id: "requip", name: "REQUIP 2 MG TAB" },
];

/** Answers of the state question — i18n keys under `demos.parkinson.tasks.state.options`. */
export const STATE_OPTIONS = ["on", "off", "onDyskinesia"];

/** Answers of the side-effects question — i18n keys under `demos.parkinson.tasks.sideEffects.options`. */
export const SIDE_EFFECT_OPTIONS = ["vomiting", "nausea", "hallucinations", "abdominalPain", "suddenSleep", "impulsive", "none"];

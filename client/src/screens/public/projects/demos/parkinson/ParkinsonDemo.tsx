import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { MedicationTask } from "./tasks/MedicationTask";
import { SideEffectsTask } from "./tasks/SideEffectsTask";
import { StateTask } from "./tasks/StateTask";

const TASKS: IDemoTask[] = [
  { titleKey: "demos.parkinson.tasks.medication.title", component: MedicationTask },
  { titleKey: "demos.parkinson.tasks.state.title", component: StateTask },
  { titleKey: "demos.parkinson.tasks.sideEffects.title", component: SideEffectsTask },
];

export default function ParkinsonDemo() {
  return <DemoRunner i18nPrefix="demos.parkinson" tasks={TASKS} />;
}

import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { MemoryProvider } from "./components/MemoryProvider";
import { DiaryTask } from "./tasks/DiaryTask";
import { PlaceObjectsTask } from "./tasks/PlaceObjectsTask";
import { RecallDistractorTask } from "./tasks/RecallDistractorTask";

/** Place objects in a room → plan a diary (distraction) → drag the objects back among two new ones. */
const TASKS: IDemoTask[] = [
  { titleKey: "demos.memory.tasks.place.title", component: PlaceObjectsTask },
  { titleKey: "demos.memory.tasks.diary.title", component: DiaryTask },
  { titleKey: "demos.memory.tasks.recall.title", component: RecallDistractorTask },
];

export default function MemoryDemo() {
  return (
    <MemoryProvider>
      <DemoRunner i18nPrefix="demos.memory" tasks={TASKS} />
    </MemoryProvider>
  );
}

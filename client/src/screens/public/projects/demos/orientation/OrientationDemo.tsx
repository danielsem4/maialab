import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { DragShapeTask } from "./tasks/DragShapeTask";
import { DrawAnythingTask } from "./tasks/DrawAnythingTask";
import { ScaleTask } from "./tasks/ScaleTask";

const TASKS: IDemoTask[] = [
  { titleKey: "demos.orientation.tasks.drag.title", component: DragShapeTask },
  { titleKey: "demos.orientation.tasks.draw.title", component: DrawAnythingTask },
  { titleKey: "demos.orientation.tasks.scale.title", component: ScaleTask },
];

export default function OrientationDemo() {
  return <DemoRunner i18nPrefix="demos.orientation" tasks={TASKS} />;
}

import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { DrawFaceTask } from "./tasks/DrawFaceTask";
import { LaterTimeTask } from "./tasks/LaterTimeTask";
import { SetTimeTask } from "./tasks/SetTimeTask";

const TASKS: IDemoTask[] = [
  { titleKey: "demos.clock.tasks.face.title", component: DrawFaceTask },
  { titleKey: "demos.clock.tasks.hands.title", component: SetTimeTask },
  { titleKey: "demos.clock.tasks.later.title", component: LaterTimeTask },
];

export default function ClockDemo() {
  return <DemoRunner i18nPrefix="demos.clock" tasks={TASKS} />;
}

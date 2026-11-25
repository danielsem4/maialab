import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { BodyMapTask } from "./tasks/BodyMapTask";
import { PainScaleTask } from "./tasks/PainScaleTask";
import { PainTypeTask } from "./tasks/PainTypeTask";

const TASKS: IDemoTask[] = [
  { titleKey: "demos.tens.tasks.bodyMap.title", component: BodyMapTask },
  { titleKey: "demos.tens.tasks.scale.title", component: PainScaleTask },
  { titleKey: "demos.tens.tasks.painType.title", component: PainTypeTask },
];

export default function TensDemo() {
  return <DemoRunner i18nPrefix="demos.tens" tasks={TASKS} />;
}

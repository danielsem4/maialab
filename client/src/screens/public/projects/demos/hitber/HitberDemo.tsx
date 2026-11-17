import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { CopyShapeTask } from "./tasks/CopyShapeTask";
import { FollowInstructionsTask } from "./tasks/FollowInstructionsTask";
import { PictureTask } from "./tasks/PictureTask";
import { SentenceTask } from "./tasks/SentenceTask";

const TASKS: IDemoTask[] = [
  { titleKey: "demos.hitber.tasks.copy.title", component: CopyShapeTask },
  { titleKey: "demos.hitber.tasks.sentence.title", component: SentenceTask },
  { titleKey: "demos.hitber.tasks.picture.title", component: PictureTask },
  { titleKey: "demos.hitber.tasks.follow.title", component: FollowInstructionsTask },
];

export default function HitberDemo() {
  return <DemoRunner i18nPrefix="demos.hitber" tasks={TASKS} />;
}

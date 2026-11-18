import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { LexicalDecisionTask } from "./tasks/LexicalDecisionTask";
import { PictureNamingTask } from "./tasks/PictureNamingTask";
import { WordPictureTask } from "./tasks/WordPictureTask";

const TASKS: IDemoTask[] = [
  { titleKey: "demos.palpa.tasks.wordPicture.title", component: WordPictureTask },
  { titleKey: "demos.palpa.tasks.lexical.title", component: LexicalDecisionTask },
  { titleKey: "demos.palpa.tasks.naming.title", component: PictureNamingTask },
];

export default function PalpaDemo() {
  return <DemoRunner i18nPrefix="demos.palpa" tasks={TASKS} />;
}

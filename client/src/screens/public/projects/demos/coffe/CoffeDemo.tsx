import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { CallContactTask } from "./tasks/CallContactTask";
import { DialNumberTask } from "./tasks/DialNumberTask";

const TASKS: IDemoTask[] = [
  { titleKey: "demos.coffe.tasks.contact.title", component: CallContactTask },
  { titleKey: "demos.coffe.tasks.dial.title", component: DialNumberTask },
];

export default function CoffeDemo() {
  return <DemoRunner i18nPrefix="demos.coffe" tasks={TASKS} />;
}

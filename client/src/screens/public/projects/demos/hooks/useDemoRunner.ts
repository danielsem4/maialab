import { useState } from "react";
import type { IDemoTask } from "@/common/types/Demo";

type Phase = "intro" | "task" | "result";

/** Steps through a demo: intro screen → each task in order → result screen with the score. */
export function useDemoRunner(tasks: IDemoTask[]) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  // Bumped on every (re)start so task components remount with fresh state.
  const [run, setRun] = useState(0);

  function start() {
    setResults([]);
    setIndex(0);
    setRun((r) => r + 1);
    setPhase("task");
  }

  function complete(passed: boolean) {
    setResults((all) => [...all, passed]);
    if (index + 1 < tasks.length) setIndex(index + 1);
    else setPhase("result");
  }

  function skip() {
    complete(false);
  }

  function restart() {
    setPhase("intro");
  }

  return {
    phase,
    task: tasks[index],
    taskKey: `${run}-${index}`,
    index,
    total: tasks.length,
    results,
    score: results.filter(Boolean).length,
    start,
    complete,
    skip,
    restart,
  };
}

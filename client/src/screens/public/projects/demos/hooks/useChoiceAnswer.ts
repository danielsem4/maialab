import { useState } from "react";
import { toggleInList } from "@/common/utils/listUtils";

/** The answer to a choice question: one value at a time, or any number when `multiple`. */
export function useChoiceAnswer(multiple = false) {
  const [selected, setSelected] = useState<string[]>([]);

  function select(value: string) {
    setSelected(multiple ? toggleInList(selected, value) : [value]);
  }

  return { selected, answered: selected.length > 0, select };
}

import { useState } from "react";
import type { ILexicalItem } from "@/common/types/Palpa";
import { isLexicalPassed } from "@/common/utils/palpaUtils";

/** Shows the items one at a time; after the last answer the task ends. */
export function useLexicalDecision(items: ILexicalItem[], onComplete: (passed: boolean) => void) {
  const [responses, setResponses] = useState<boolean[]>([]);
  const index = responses.length;

  function answer(isWord: boolean) {
    const next = [...responses, isWord];
    if (next.length === items.length) {
      onComplete(isLexicalPassed(items, next));
      return;
    }
    setResponses(next);
  }

  return { index, item: items[index], total: items.length, answer };
}

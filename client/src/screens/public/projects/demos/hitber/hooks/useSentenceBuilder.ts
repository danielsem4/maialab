import { useState } from "react";
import { isSentenceCorrect, scrambleOrder } from "@/common/utils/hitberUtils";

/** Build a sentence by tapping shuffled word cards; words are tracked by index so repeats work. */
export function useSentenceBuilder(sentence: string, onComplete: (passed: boolean) => void) {
  const words = sentence.split(" ").filter(Boolean);
  const pool = scrambleOrder(words.length);
  const [picked, setPicked] = useState<number[]>([]);

  function place(index: number) {
    setPicked((current) => (current.includes(index) ? current : [...current, index]));
  }

  function remove(index: number) {
    setPicked((current) => current.filter((i) => i !== index));
  }

  function handleDone() {
    onComplete(isSentenceCorrect(words, picked));
  }

  return { words, pool, picked, isComplete: picked.length === words.length, place, remove, handleDone };
}

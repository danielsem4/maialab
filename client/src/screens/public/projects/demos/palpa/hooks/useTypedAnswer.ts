import { useState, type ChangeEvent, type FormEvent } from "react";
import { matchesAnswer } from "@/common/utils/palpaUtils";

/** A free-text answer checked against pipe-separated accepted answers on submit. */
export function useTypedAnswer(accepted: string, onComplete: (passed: boolean) => void) {
  const [value, setValue] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) return;
    onComplete(matchesAnswer(value, accepted));
  }

  return { value, canSubmit: value.trim().length > 0, handleChange, handleSubmit };
}

import { useState, type ChangeEvent, type KeyboardEvent } from "react";

/**
 * Input state that is committed on blur or Enter instead of on every keystroke, so one edit of a
 * field is one change (and one undo step). Shows `value` whenever the user is not typing.
 */
export function useDraft(value: string, onCommit: (raw: string) => void) {
  const [draft, setDraft] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const handleBlur = () => {
    if (draft !== null && draft !== value) onCommit(draft);
    setDraft(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") event.currentTarget.blur();
  };

  return { value: draft ?? value, onChange: handleChange, onBlur: handleBlur, onKeyDown: handleKeyDown };
}

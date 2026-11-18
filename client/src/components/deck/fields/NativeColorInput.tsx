import { useEffect, useEffectEvent, useRef } from "react";

interface NativeColorInputProps {
  id: string;
  /** `#rrggbb`. */
  value: string;
  label: string;
  onCommit: (value: string) => void;
}

/**
 * Browser colour picker that reports once, when the picker is closed. React's onChange fires for
 * every movement inside the picker, which would flood the undo history; the native `change` event
 * does not. Remount (via `key`) to show a new outside value.
 */
export function NativeColorInput({ id, value, label, onCommit }: NativeColorInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const commit = useEffectEvent(onCommit);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    function handleChange() {
      if (input) commit(input.value);
    }
    input.addEventListener("change", handleChange);
    return () => {
      input.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <input
      ref={inputRef}
      id={id}
      type="color"
      defaultValue={value}
      aria-label={label}
      title={label}
      className="size-8 shrink-0 cursor-pointer rounded border bg-transparent p-0.5"
    />
  );
}

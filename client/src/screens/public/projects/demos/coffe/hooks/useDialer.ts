import { useState } from "react";
import { isSameNumber } from "@/common/utils/phoneUtils";
import { DIRECTORY, TARGET_DIRECTORY_ID } from "../phoneData";

const MAX_LENGTH = 13;
const TARGET = DIRECTORY.find((entry) => entry.id === TARGET_DIRECTORY_ID)!;

/** Keypad input; pressing Call ends the task — passed if the dialed number is the target's. */
export function useDialer(onComplete: (passed: boolean) => void) {
  const [digits, setDigits] = useState("");

  function press(key: string) {
    setDigits((current) => (current.length < MAX_LENGTH ? current + key : current));
  }

  function backspace() {
    setDigits((current) => current.slice(0, -1));
  }

  function call() {
    onComplete(isSameNumber(digits, TARGET.phone));
  }

  return { digits, target: TARGET, press, backspace, call };
}

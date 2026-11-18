import type { ILexicalItem, IPictureOption } from "@/common/types/Palpa";

const P = "demos.palpa.pictures";
const L = "demos.palpa.tasks.lexical.items";

/** Word–picture matching: the target, a semantic distractor, a visual distractor and an unrelated picture. */
export const PICTURE_OPTIONS: IPictureOption[] = [
  { id: "pear", emoji: "🍐", labelKey: `${P}.pear` },
  { id: "tomato", emoji: "🍅", labelKey: `${P}.tomato` },
  { id: "apple", emoji: "🍎", labelKey: `${P}.apple` },
  { id: "cup", emoji: "☕", labelKey: `${P}.cup` },
];

export const TARGET_PICTURE_ID = "apple";

/** Lexical decision: real words mixed with made-up but word-like strings (written per language). */
export const LEXICAL_ITEMS: ILexicalItem[] = [
  { id: "word1", textKey: `${L}.word1`, isWord: true },
  { id: "nonword1", textKey: `${L}.nonword1`, isWord: false },
  { id: "word2", textKey: `${L}.word2`, isWord: true },
  { id: "nonword2", textKey: `${L}.nonword2`, isWord: false },
];

export const NAMING_EMOJI = "🏠";

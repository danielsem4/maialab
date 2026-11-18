import {
  AlignCenter,
  AlignJustify,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Strikethrough,
  TextAlignEnd,
  TextAlignStart,
  Underline,
  type LucideIcon,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

export interface ITextFormatAction {
  id: string;
  labelKey: string;
  icon: LucideIcon;
  isActive: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}

const mark = (id: string, labelKey: string, icon: LucideIcon, run: ITextFormatAction["run"]): ITextFormatAction => ({
  id,
  labelKey,
  icon,
  isActive: (editor) => editor.isActive(id),
  run,
});

const align = (value: string, labelKey: string, icon: LucideIcon): ITextFormatAction => ({
  id: `align-${value}`,
  labelKey,
  icon,
  isActive: (editor) => editor.isActive({ textAlign: value }),
  run: (editor) => editor.chain().focus().setTextAlign(value).run(),
});

const heading = (level: 1 | 2, labelKey: string, icon: LucideIcon): ITextFormatAction => ({
  id: `heading-${level}`,
  labelKey,
  icon,
  isActive: (editor) => editor.isActive("heading", { level }),
  run: (editor) => editor.chain().focus().toggleHeading({ level }).run(),
});

/** Format bar buttons, in rows. */
export const TEXT_FORMAT_GROUPS: ITextFormatAction[][] = [
  [
    mark("bold", "decks.text.bold", Bold, (e) => e.chain().focus().toggleBold().run()),
    mark("italic", "decks.text.italic", Italic, (e) => e.chain().focus().toggleItalic().run()),
    mark("underline", "decks.text.underline", Underline, (e) => e.chain().focus().toggleUnderline().run()),
    mark("strike", "decks.text.strike", Strikethrough, (e) => e.chain().focus().toggleStrike().run()),
  ],
  [
    heading(1, "decks.text.heading1", Heading1),
    heading(2, "decks.text.heading2", Heading2),
    mark("paragraph", "decks.text.paragraph", Pilcrow, (e) => e.chain().focus().setParagraph().run()),
    mark("bulletList", "decks.text.bulletList", List, (e) => e.chain().focus().toggleBulletList().run()),
    mark("orderedList", "decks.text.numberedList", ListOrdered, (e) => e.chain().focus().toggleOrderedList().run()),
  ],
  [
    align("start", "decks.text.alignStart", TextAlignStart),
    align("center", "decks.text.alignCenter", AlignCenter),
    align("end", "decks.text.alignEnd", TextAlignEnd),
    align("justify", "decks.text.justify", AlignJustify),
  ],
];

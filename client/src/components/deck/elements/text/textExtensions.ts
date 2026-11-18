import type { Extensions } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { StarterKit } from "@tiptap/starter-kit";

/**
 * The single extension list for deck text: the editor and the static renderer must agree on it, or
 * text would look different once you click away. Links never open while editing and only safe
 * protocols are allowed; anything else is rendered with an empty href.
 */
export const textExtensions: Extensions = [
  StarterKit.configure({
    link: { openOnClick: false, protocols: ["http", "https", "mailto"] },
    heading: { levels: [1, 2, 3] },
    code: false,
    codeBlock: false,
    horizontalRule: false,
  }),
  TextStyle,
  Color,
  // Logical values, so "start" follows each paragraph's own direction.
  TextAlign.configure({ types: ["heading", "paragraph"], alignments: ["start", "center", "end", "justify"] }),
];

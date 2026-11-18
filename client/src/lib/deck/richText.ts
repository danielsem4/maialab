import { generateHTML, type JSONContent } from "@tiptap/core";
import { textExtensions } from "@/components/deck/elements/text/textExtensions";

/** A document with one paragraph holding `placeholder`. */
export function emptyTextContent(placeholder: string): JSONContent {
  return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: placeholder }] }] };
}

function isDoc(content: unknown): content is JSONContent {
  return typeof content === "object" && content !== null && (content as JSONContent).type === "doc";
}

function collectText(node: JSONContent): string {
  const own = typeof node.text === "string" ? node.text : "";
  const children = Array.isArray(node.content) ? node.content.map(collectText).join("") : "";
  return own + children;
}

/** All text in a document, without formatting. Empty for anything that is not a document. */
export function plainText(content: unknown): string {
  return isDoc(content) ? collectText(content) : "";
}

export function isEmptyTextContent(content: unknown): boolean {
  return plainText(content).trim() === "";
}

/**
 * Static HTML for a stored document. Only nodes and marks the extension list knows are emitted and
 * all text is escaped, so the result is safe to inject. Never throws: an unreadable document renders
 * as nothing.
 */
export function renderTextHtml(content: unknown): string {
  if (!isDoc(content)) return "";
  try {
    return generateHTML(content, textExtensions);
  } catch {
    return "";
  }
}

/** Strips common Markdown syntax so the text reads as plain prose. */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>+|[-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__|\*|_|~~|`)/g, "")
    .replace(/^\s*([-*_]\s*){3,}$/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Plain-text excerpt of Markdown, cut at a word boundary and suffixed with an ellipsis when shortened. */
export function excerpt(markdown: string, maxLength = 200): string {
  const text = stripMarkdown(markdown);
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.replace(/[\s.,;:!?-]+$/, "")}…`;
}

/** The first non-empty line of Markdown as plain text, capped at maxLength. */
export function firstLine(markdown: string, maxLength = 140): string {
  const line = markdown.split("\n").find((l) => stripMarkdown(l) !== "") ?? "";
  return excerpt(line, maxLength);
}

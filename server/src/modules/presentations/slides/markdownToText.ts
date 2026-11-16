/**
 * Turns Markdown into plain text suitable for a slide.
 * Headings, emphasis, code and link syntax are stripped; list markers become bullets.
 */
export function markdownToText(markdown: string): string {
  return markdown
    .replace(/\r\n?/g, '\n')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .split('\n')
    .map(convertLine)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function convertLine(line: string): string {
  let out = line
    .replace(/^\s{0,3}#{1,6}\s+/, '')
    .replace(/^\s{0,3}>\s?/, '')
    .replace(/^\s{0,3}([-*_])(\s*\1){2,}\s*$/, '');
  out = out.replace(/^(\s*)[-*+]\s+/, '$1• ').replace(/^(\s*)\d+[.)]\s+/, '$1• ');
  return out
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[^\w*])[*_]([^*_\n]+)[*_](?=[^\w*]|$)/g, '$1$2')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trimEnd();
}

/**
 * Shortens text to at most `max` characters, preferring to cut at a paragraph,
 * sentence or word boundary, and appends an ellipsis when anything was removed.
 */
export function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const minCut = Math.floor(max * 0.6);
  const paragraph = slice.lastIndexOf('\n\n');
  if (paragraph >= minCut) return `${slice.slice(0, paragraph).trimEnd()}\n…`;
  const sentence = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('.\n'));
  if (sentence >= minCut) return `${slice.slice(0, sentence + 1)} …`;
  const word = slice.lastIndexOf(' ');
  const cut = word >= minCut ? slice.slice(0, word) : slice;
  return `${cut.trimEnd()}…`;
}

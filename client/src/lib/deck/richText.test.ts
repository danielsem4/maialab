import { describe, expect, it } from "vitest";
import { emptyTextContent, isEmptyTextContent, plainText, renderTextHtml } from "./richText";

function docWithLink(href: string) {
  return {
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "click", marks: [{ type: "link", attrs: { href } }] }] },
    ],
  };
}

describe("isEmptyTextContent", () => {
  it("is true for missing, malformed and whitespace-only content", () => {
    expect(isEmptyTextContent(null)).toBe(true);
    expect(isEmptyTextContent(undefined)).toBe(true);
    expect(isEmptyTextContent("text")).toBe(true);
    expect(isEmptyTextContent({ type: "doc", content: [{ type: "paragraph" }] })).toBe(true);
    expect(
      isEmptyTextContent({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "  \n" }] }] }),
    ).toBe(true);
  });

  it("is false once there is text", () => {
    expect(isEmptyTextContent(emptyTextContent("Hi"))).toBe(false);
  });
});

describe("plainText", () => {
  it("joins the text of every node", () => {
    expect(plainText(emptyTextContent("Hi"))).toBe("Hi");
    expect(plainText({ nonsense: true })).toBe("");
  });
});

describe("renderTextHtml", () => {
  it("renders a document", () => {
    expect(renderTextHtml(emptyTextContent("Hi"))).toContain("<p>Hi</p>");
  });

  it("escapes text instead of treating it as markup", () => {
    const html = renderTextHtml(emptyTextContent('<img src=x onerror="alert(1)">'));
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("returns an empty string for anything that is not a valid document", () => {
    expect(renderTextHtml({ nonsense: true })).toBe("");
    expect(renderTextHtml("<script>")).toBe("");
    expect(renderTextHtml(null)).toBe("");
    expect(renderTextHtml({ type: "doc", content: [{ type: "hologram" }] })).toBe("");
  });

  it("never emits a javascript: link", () => {
    expect(renderTextHtml(docWithLink("javascript:alert(1)"))).not.toContain("javascript:");
    expect(renderTextHtml(docWithLink("JaVaScRiPt:alert(1)")).toLowerCase()).not.toContain("javascript:");
    expect(renderTextHtml(docWithLink("data:text/html,<script>alert(1)</script>"))).not.toContain("data:");
  });

  it("keeps ordinary links", () => {
    const html = renderTextHtml(docWithLink("https://example.org/a"));
    expect(html).toContain('href="https://example.org/a"');
    expect(html).toContain("noopener");
  });

  it("keeps formatting marks and alignment", () => {
    const html = renderTextHtml({
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { textAlign: "center" },
          content: [
            { type: "text", text: "b", marks: [{ type: "bold" }] },
            { type: "text", text: "c", marks: [{ type: "textStyle", attrs: { color: "var(--deck-accent)" } }] },
          ],
        },
      ],
    });
    expect(html).toContain("<strong>b</strong>");
    expect(html).toContain("text-align: center");
    expect(html).toContain("color: var(--deck-accent)");
  });
});

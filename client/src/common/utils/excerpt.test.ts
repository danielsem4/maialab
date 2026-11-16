import { describe, expect, it } from "vitest";
import { excerpt, firstLine, stripMarkdown } from "./excerpt";

describe("stripMarkdown", () => {
  it("removes headings, emphasis and code markers", () => {
    expect(stripMarkdown("# Title\n\nSome **bold** and _italic_ `code`")).toBe("Title Some bold and italic code");
  });

  it("keeps link and image text but drops urls", () => {
    expect(stripMarkdown("See [our site](https://x.org) ![a robot](/r.png)")).toBe("See our site a robot");
  });

  it("removes list and quote markers", () => {
    expect(stripMarkdown("- one\n* two\n1. three\n> quote")).toBe("one two three quote");
  });

  it("drops fenced code blocks", () => {
    expect(stripMarkdown("before\n```js\nconst a = 1;\n```\nafter")).toBe("before after");
  });

  it("keeps non-Latin text", () => {
    expect(stripMarkdown("## שלום **עולם**")).toBe("שלום עולם");
  });
});

describe("excerpt", () => {
  it("returns short text unchanged", () => {
    expect(excerpt("Short *text*.")).toBe("Short text.");
  });

  it("cuts long text at a word boundary with an ellipsis", () => {
    const result = excerpt("word ".repeat(100), 50);
    expect(result.length).toBeLessThanOrEqual(51);
    expect(result.endsWith("word…")).toBe(true);
  });

  it("returns an empty string for empty input", () => {
    expect(excerpt("")).toBe("");
  });
});

describe("firstLine", () => {
  it("returns the first non-empty line as plain text", () => {
    expect(firstLine("\n\n## Big news\nMore details")).toBe("Big news");
  });

  it("returns an empty string when there is no text", () => {
    expect(firstLine("\n  \n")).toBe("");
  });
});

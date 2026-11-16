import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadBlob, filenameFromDisposition } from "./downloadBlob";

describe("filenameFromDisposition", () => {
  it("reads a quoted filename", () => {
    expect(filenameFromDisposition('attachment; filename="deck.pptx"', "x")).toBe("deck.pptx");
  });

  it("prefers the UTF-8 encoded filename", () => {
    const header = "attachment; filename=\"a.pptx\"; filename*=UTF-8''%D7%9E%D7%97%D7%A7%D7%A8.pptx";
    expect(filenameFromDisposition(header, "x")).toBe("מחקר.pptx");
  });

  it("falls back when the header is missing", () => {
    expect(filenameFromDisposition(undefined, "fallback.pptx")).toBe("fallback.pptx");
  });
});

describe("downloadBlob", () => {
  afterEach(() => vi.restoreAllMocks());

  it("clicks a temporary link and revokes the object URL", () => {
    const createUrl = vi.fn(() => "blob:test");
    const revokeUrl = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL: createUrl, revokeObjectURL: revokeUrl });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    downloadBlob(new Blob(["x"]), "file.pptx");

    expect(createUrl).toHaveBeenCalled();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeUrl).toHaveBeenCalledWith("blob:test");
    expect(document.querySelector("a[download]")).toBeNull();
    vi.unstubAllGlobals();
  });
});

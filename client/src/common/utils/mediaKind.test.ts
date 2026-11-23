import { describe, expect, it } from "vitest";
import { getMediaKind, videoPosterUrl } from "./mediaKind";

describe("getMediaKind", () => {
  it("recognises images and videos", () => {
    expect(getMediaKind("image/png")).toBe("image");
    expect(getMediaKind("video/mp4")).toBe("video");
    expect(getMediaKind("video/webm")).toBe("video");
  });

  it("treats everything else as a file", () => {
    expect(getMediaKind("application/pdf")).toBe("file");
    expect(getMediaKind("")).toBe("file");
  });
});

describe("videoPosterUrl", () => {
  it("adds a media fragment pointing at the first frame", () => {
    expect(videoPosterUrl("/uploads/a.mp4")).toBe("/uploads/a.mp4#t=0.1");
  });

  it("leaves a URL that already has a fragment alone", () => {
    expect(videoPosterUrl("/uploads/a.mp4#t=5")).toBe("/uploads/a.mp4#t=5");
  });
});

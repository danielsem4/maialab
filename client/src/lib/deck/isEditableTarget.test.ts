import { describe, expect, it } from "vitest";
import { isEditableTarget } from "./isEditableTarget";

describe("isEditableTarget", () => {
  it("is true for form fields", () => {
    expect(isEditableTarget(document.createElement("input"))).toBe(true);
    expect(isEditableTarget(document.createElement("textarea"))).toBe(true);
    expect(isEditableTarget(document.createElement("select"))).toBe(true);
  });

  it("is true anywhere inside a contenteditable region", () => {
    const editor = document.createElement("div");
    editor.setAttribute("contenteditable", "true");
    const span = document.createElement("span");
    editor.appendChild(span);
    expect(isEditableTarget(span)).toBe(true);
    expect(isEditableTarget(editor)).toBe(true);
  });

  it("is false for everything else", () => {
    expect(isEditableTarget(document.createElement("div"))).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(window)).toBe(false);
  });
});

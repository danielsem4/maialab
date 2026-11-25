import { describe, expect, it } from "vitest";
import { toggleInList } from "./listUtils";

describe("toggleInList", () => {
  it("adds a missing item at the end", () => {
    expect(toggleInList(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes an item that is already there", () => {
    expect(toggleInList(["a", "b"], "a")).toEqual(["b"]);
  });

  it("does not mutate the list", () => {
    const list = ["a"];
    toggleInList(list, "b");
    expect(list).toEqual(["a"]);
  });
});

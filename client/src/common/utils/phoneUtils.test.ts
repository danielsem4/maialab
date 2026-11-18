import { describe, expect, it } from "vitest";
import { filterContacts, formatPhone, isSameNumber, normalizeNumber } from "./phoneUtils";

describe("normalizeNumber", () => {
  it("strips spaces and dashes but keeps digits, * and #", () => {
    expect(normalizeNumber(" 052-258 1194 ")).toBe("0522581194");
    expect(normalizeNumber("*31#")).toBe("*31#");
  });
});

describe("formatPhone", () => {
  it("groups a full number 3-3-4", () => {
    expect(formatPhone("0522581194")).toBe("052-258-1194");
  });

  it("formats partial input without trailing dashes", () => {
    expect(formatPhone("")).toBe("");
    expect(formatPhone("05")).toBe("05");
    expect(formatPhone("052")).toBe("052");
    expect(formatPhone("05225")).toBe("052-25");
  });

  it("re-formats an already formatted number", () => {
    expect(formatPhone("052-258-1194")).toBe("052-258-1194");
  });
});

describe("isSameNumber", () => {
  it("matches regardless of separators", () => {
    expect(isSameNumber("0522581194", "052-258-1194")).toBe(true);
  });

  it("rejects a different, partial or empty number", () => {
    expect(isSameNumber("0522581195", "052-258-1194")).toBe(false);
    expect(isSameNumber("052258119", "052-258-1194")).toBe(false);
    expect(isSameNumber("", "")).toBe(false);
  });

  it("does not ignore * or #", () => {
    expect(isSameNumber("*0522581194", "052-258-1194")).toBe(false);
  });
});

describe("filterContacts", () => {
  const names: Record<string, string> = { a: "Dana Levi", b: "Dan Levi", c: "avi Cohen" };
  const contacts = [{ nameKey: "a" }, { nameKey: "b" }, { nameKey: "c" }];
  const translate = (key: string) => names[key];

  it("returns everyone, sorted alphabetically, for an empty query", () => {
    expect(filterContacts(contacts, "  ", translate, "en").map((c) => c.nameKey)).toEqual(["c", "b", "a"]);
  });

  it("matches case-insensitively anywhere in the name", () => {
    expect(filterContacts(contacts, "LEVI", translate, "en").map((c) => c.nameKey)).toEqual(["b", "a"]);
    expect(filterContacts(contacts, "dana", translate, "en").map((c) => c.nameKey)).toEqual(["a"]);
  });

  it("does not mutate the input", () => {
    filterContacts(contacts, "", translate, "en");
    expect(contacts.map((c) => c.nameKey)).toEqual(["a", "b", "c"]);
  });
});

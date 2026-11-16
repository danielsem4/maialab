import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { getApiErrorMessage, getApiErrorStatus } from "./apiError";

function axiosError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("fail", "ERR", config, null, {
    status,
    statusText: "",
    headers: {},
    config,
    data,
  });
}

describe("getApiErrorMessage", () => {
  it("returns the server message", () => {
    expect(getApiErrorMessage(axiosError(409, { message: "Slug taken" }))).toBe("Slug taken");
  });

  it("returns null when there is no usable message", () => {
    expect(getApiErrorMessage(axiosError(500, {}))).toBeNull();
    expect(getApiErrorMessage(new Error("plain"))).toBeNull();
  });
});

describe("getApiErrorStatus", () => {
  it("returns the HTTP status", () => {
    expect(getApiErrorStatus(axiosError(404, {}))).toBe(404);
  });

  it("returns null for non-axios errors", () => {
    expect(getApiErrorStatus("nope")).toBeNull();
  });
});

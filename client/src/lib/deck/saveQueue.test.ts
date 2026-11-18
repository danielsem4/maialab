import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IDeckDoc } from "@/common/types/Deck";
import { createSaveQueue, type ISaveSnapshot, type SaveState } from "./saveQueue";

const doc: IDeckDoc = {
  version: 1,
  theme: { colors: {}, fontHeading: "Inter", fontBody: "Inter" },
  slides: [{ id: "s1", transition: "none", elements: [] }],
};

const snap = (title: string): ISaveSnapshot => ({ title, doc });

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function setup(save: (snapshot: ISaveSnapshot, updatedAt: string) => Promise<{ updatedAt: string }>) {
  const states: SaveState[] = [];
  const saveSpy = vi.fn(save);
  const queue = createSaveQueue({
    delayMs: 1500,
    initialUpdatedAt: "A",
    save: saveSpy,
    onState: (state) => states.push(state),
  });
  return { queue, saveSpy, states };
}

describe("createSaveQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces", async () => {
    const { queue, saveSpy, states } = setup(async () => ({ updatedAt: "B" }));
    queue.schedule(snap("1"));
    await vi.advanceTimersByTimeAsync(500);
    queue.schedule(snap("2"));
    await vi.advanceTimersByTimeAsync(500);
    queue.schedule(snap("3"));
    await vi.advanceTimersByTimeAsync(1499);
    expect(saveSpy).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(snap("3"), "A");
    expect(states).toEqual(["dirty", "dirty", "dirty", "saving", "saved"]);
  });

  it("uses the returned updatedAt", async () => {
    const { queue, saveSpy } = setup(async () => ({ updatedAt: "B" }));
    queue.schedule(snap("1"));
    await vi.advanceTimersByTimeAsync(1500);
    queue.schedule(snap("2"));
    await vi.advanceTimersByTimeAsync(1500);
    expect(saveSpy).toHaveBeenLastCalledWith(snap("2"), "B");
  });

  it("does not overlap", async () => {
    const first = deferred<{ updatedAt: string }>();
    const second = deferred<{ updatedAt: string }>();
    const results = [first.promise, second.promise];
    const { queue, saveSpy, states } = setup(() => results.shift()!);
    queue.schedule(snap("1"));
    await vi.advanceTimersByTimeAsync(1500);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    queue.schedule(snap("2"));
    await vi.advanceTimersByTimeAsync(5000);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    first.resolve({ updatedAt: "B" });
    await vi.advanceTimersByTimeAsync(0);
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(saveSpy).toHaveBeenLastCalledWith(snap("2"), "B");
    second.resolve({ updatedAt: "C" });
    await vi.advanceTimersByTimeAsync(0);
    expect(states.at(-1)).toBe("saved");
  });

  it("stops after a conflict", async () => {
    const { queue, saveSpy, states } = setup(async () => {
      throw { status: 409 };
    });
    queue.schedule(snap("1"));
    await vi.advanceTimersByTimeAsync(1500);
    expect(states.at(-1)).toBe("conflict");
    queue.schedule(snap("2"));
    await vi.advanceTimersByTimeAsync(5000);
    await queue.flush();
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(states.at(-1)).toBe("conflict");
  });

  it("retries after an error", async () => {
    const results: (() => Promise<{ updatedAt: string }>)[] = [
      async () => {
        throw { status: 500 };
      },
      async () => ({ updatedAt: "B" }),
    ];
    const { queue, saveSpy, states } = setup(() => results.shift()!());
    queue.schedule(snap("1"));
    await vi.advanceTimersByTimeAsync(1500);
    expect(states.at(-1)).toBe("error");
    await vi.advanceTimersByTimeAsync(10000);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    queue.schedule(snap("2"));
    await vi.advanceTimersByTimeAsync(1500);
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(saveSpy).toHaveBeenLastCalledWith(snap("2"), "A");
    expect(states.at(-1)).toBe("saved");
  });

  it("keeps a failed snapshot for the next flush", async () => {
    const results: (() => Promise<{ updatedAt: string }>)[] = [
      async () => {
        throw { status: 500 };
      },
      async () => ({ updatedAt: "B" }),
    ];
    const { queue, saveSpy } = setup(() => results.shift()!());
    queue.schedule(snap("1"));
    await vi.advanceTimersByTimeAsync(1500);
    await queue.flush();
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(saveSpy).toHaveBeenLastCalledWith(snap("1"), "A");
  });

  it("flush", async () => {
    const { queue, saveSpy, states } = setup(async () => ({ updatedAt: "B" }));
    queue.schedule(snap("1"));
    await queue.flush();
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(states.at(-1)).toBe("saved");
    await vi.advanceTimersByTimeAsync(5000);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it("flush waits for an in-flight save, then sends what is pending", async () => {
    const first = deferred<{ updatedAt: string }>();
    const results = [first.promise, Promise.resolve({ updatedAt: "C" })];
    const { queue, saveSpy } = setup(() => results.shift()!);
    queue.schedule(snap("1"));
    await vi.advanceTimersByTimeAsync(1500);
    queue.schedule(snap("2"));
    const flushed = queue.flush();
    first.resolve({ updatedAt: "B" });
    await flushed;
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(saveSpy).toHaveBeenLastCalledWith(snap("2"), "B");
  });

  it("does nothing after dispose", async () => {
    const { queue, saveSpy } = setup(async () => ({ updatedAt: "B" }));
    queue.schedule(snap("1"));
    queue.dispose();
    await vi.advanceTimersByTimeAsync(5000);
    queue.schedule(snap("2"));
    await queue.flush();
    expect(saveSpy).not.toHaveBeenCalled();
  });
});

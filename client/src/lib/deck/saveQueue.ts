import type { IDeckDoc } from "@/common/types/Deck";

export type SaveState = "saved" | "dirty" | "saving" | "conflict" | "error";

export interface ISaveSnapshot {
  title: string;
  doc: IDeckDoc;
}

interface ISaveQueueOptions {
  delayMs: number;
  initialUpdatedAt: string;
  /** Rejects with `{ status: 409 }` when the deck was changed elsewhere. */
  save: (snapshot: ISaveSnapshot, updatedAt: string) => Promise<{ updatedAt: string }>;
  onState: (state: SaveState) => void;
}

function isConflict(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { status?: unknown }).status === 409;
}

/**
 * Debounced, never-overlapping saves of the latest snapshot. Each save sends the `updatedAt` returned
 * by the previous one. A conflict stops the queue for good so a stale tab cannot overwrite newer work;
 * any other failure keeps the snapshot and waits for the next change (or flush) before trying again.
 */
export function createSaveQueue(opts: ISaveQueueOptions) {
  let updatedAt = opts.initialUpdatedAt;
  let pending: ISaveSnapshot | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inFlight: Promise<void> | null = null;
  let stopped = false;

  function clearTimer() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }

  function startTimer() {
    clearTimer();
    timer = setTimeout(() => {
      timer = null;
      void run();
    }, opts.delayMs);
  }

  function callSave(snapshot: ISaveSnapshot): Promise<{ updatedAt: string }> {
    try {
      return opts.save(snapshot, updatedAt);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function run(): Promise<void> {
    if (inFlight) return inFlight;
    if (!pending || stopped) return Promise.resolve();
    const snapshot = pending;
    pending = null;
    opts.onState("saving");
    inFlight = callSave(snapshot).then(
      (result) => {
        inFlight = null;
        updatedAt = result.updatedAt;
        if (stopped) return;
        if (!pending) return opts.onState("saved");
        opts.onState("dirty");
        // A change arrived mid-save and its timer already fired: send it now.
        if (timer === null) return run();
      },
      (error: unknown) => {
        inFlight = null;
        if (stopped) return;
        if (isConflict(error)) {
          stopped = true;
          pending = null;
          clearTimer();
          return opts.onState("conflict");
        }
        const hasNewer = pending !== null;
        pending = pending ?? snapshot;
        opts.onState("error");
        if (hasNewer && timer === null) startTimer();
      },
    );
    return inFlight;
  }

  return {
    schedule(snapshot: ISaveSnapshot): void {
      if (stopped) return;
      pending = snapshot;
      if (!inFlight) opts.onState("dirty");
      startTimer();
    },

    /** Saves whatever is pending right away and resolves once nothing is in flight. */
    async flush(): Promise<void> {
      clearTimer();
      if (inFlight) await inFlight;
      await run();
    },

    dispose(): void {
      stopped = true;
      pending = null;
      clearTimer();
    },
  };
}

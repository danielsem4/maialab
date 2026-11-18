import type { ReactNode } from "react";

/** The simulated phone's screen, as the real test draws it on the tablet. */
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-full justify-center px-10 pb-6">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-2 bg-emerald-50 shadow-sm dark:bg-emerald-950/40">
        {children}
      </div>
    </div>
  );
}

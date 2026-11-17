import type { ReactNode } from "react";

interface TaskLayoutProps {
  instruction: string;
  children: ReactNode;
}

/** Large, plain instruction at the top and the interactive area below — kept simple for older adults. */
export function TaskLayout({ instruction, children }: TaskLayoutProps) {
  return (
    <div className="flex size-full flex-col">
      <p className="px-8 pt-6 pb-4 text-center text-2xl leading-snug font-medium text-balance">{instruction}</p>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

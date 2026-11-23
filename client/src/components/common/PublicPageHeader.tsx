import type { ReactNode } from "react";

interface PublicPageHeaderProps {
  title: string;
  intro?: string;
  children?: ReactNode;
}

export function PublicPageHeader({ title, intro, children }: PublicPageHeaderProps) {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-20 sm:pb-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-balance break-words sm:text-5xl">{title}</h1>
      {intro && <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:mt-4 sm:text-lg">{intro}</p>}
      {children && <div className="mt-5 sm:mt-8">{children}</div>}
    </header>
  );
}

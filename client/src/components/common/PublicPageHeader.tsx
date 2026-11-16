import type { ReactNode } from "react";

interface PublicPageHeaderProps {
  title: string;
  intro?: string;
  children?: ReactNode;
}

export function PublicPageHeader({ title, intro, children }: PublicPageHeaderProps) {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
      <h1 className="font-display text-5xl font-bold tracking-tight text-balance sm:text-7xl">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
      {children && <div className="mt-8">{children}</div>}
    </header>
  );
}

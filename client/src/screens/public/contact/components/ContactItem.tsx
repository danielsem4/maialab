import type { ReactNode } from "react";

interface ContactItemProps {
  label: string;
  children: ReactNode;
}

/** One labelled row of the contact page: small label, large value. */
export function ContactItem({ label, children }: ContactItemProps) {
  return (
    <div className="grid gap-2 border-t py-8 md:grid-cols-[12rem_1fr] md:gap-8">
      <dt className="text-sm text-muted-foreground md:pt-2">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

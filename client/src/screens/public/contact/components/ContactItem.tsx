import type { ReactNode } from "react";

interface ContactItemProps {
  label: string;
  children: ReactNode;
}

/** One labelled row of the contact page: small label, large value. */
export function ContactItem({ label, children }: ContactItemProps) {
  return (
    <div className="grid gap-2 border-t py-6 md:grid-cols-[10rem_1fr] md:gap-8">
      <dt className="text-sm text-muted-foreground md:pt-0.5">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

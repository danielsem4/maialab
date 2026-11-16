import type { IYearGroup } from "../hooks/usePublicationsPage";
import { PublicationEntry } from "./PublicationEntry";

interface YearGroupProps {
  group: IYearGroup;
}

export function YearGroup({ group }: YearGroupProps) {
  const headingId = `year-${group.year}`;

  return (
    <section aria-labelledby={headingId} className="grid gap-4 border-t pt-8 md:grid-cols-[10rem_1fr] md:gap-10">
      <h2
        id={headingId}
        className="self-start font-display text-5xl font-bold tracking-tight text-primary tabular-nums md:sticky md:top-24 md:text-6xl"
      >
        {group.year}
      </h2>
      <ul className="space-y-7">
        {group.publications.map((publication) => (
          <PublicationEntry key={publication.id} publication={publication} />
        ))}
      </ul>
    </section>
  );
}

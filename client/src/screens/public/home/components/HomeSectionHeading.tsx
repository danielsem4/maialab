import { Link } from "react-router-dom";

interface HomeSectionHeadingProps {
  id: string;
  title: string;
  linkTo?: string;
  linkLabel?: string;
}

/** Section title with an optional "see all" link aligned to the end. */
export function HomeSectionHeading({ id, title, linkTo, linkLabel }: HomeSectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <h2 id={id} className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="rounded-sm text-base font-medium text-primary underline decoration-primary/30 underline-offset-[6px] transition-colors hover:decoration-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

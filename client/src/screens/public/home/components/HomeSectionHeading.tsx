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
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 sm:mb-8 sm:gap-y-2">
      <h2 id={id} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="inline-flex min-h-10 items-center rounded-sm text-base font-medium sm:min-h-0 text-primary underline decoration-primary/30 underline-offset-[6px] transition-colors hover:decoration-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IPublication } from "@/common/types/Publication";
import { safeHref } from "@/common/utils/safeHref";

const LINK_CLASS =
  "font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

interface PublicationEntryProps {
  publication: IPublication;
}

export function PublicationEntry({ publication }: PublicationEntryProps) {
  const { t } = useTranslation();
  const { pdf, project } = publication;
  const url = safeHref(publication.url);
  const hasLinks = Boolean(url || pdf || project);

  return (
    <li className="border-b pb-7 last:border-b-0" dir="auto">
      <h3 className="font-display text-lg leading-snug font-semibold text-balance sm:text-xl">
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline">
            {publication.title}
          </a>
        ) : (
          publication.title
        )}
      </h3>
      <p className="mt-2 text-muted-foreground">{publication.authors}</p>
      {publication.venue && <p className="mt-1 italic">{publication.venue}</p>}
      {hasLinks && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className={LINK_CLASS}>
              {t("publications.readPaper")}
            </a>
          )}
          {pdf && (
            <a href={pdf.url} target="_blank" rel="noreferrer" className={LINK_CLASS}>
              {t("publications.downloadPdf")}
            </a>
          )}
          {project && (
            <Link to={`/projects/${project.slug}`} className={LINK_CLASS}>
              {project.title}
            </Link>
          )}
        </div>
      )}
    </li>
  );
}

import { useTranslation } from "react-i18next";
import type { IProject } from "@/common/types/Project";
import { safeHref } from "@/common/utils/safeHref";

interface ProjectPublicationsProps {
  publications: IProject["publications"];
}

export function ProjectPublications({ publications }: ProjectPublicationsProps) {
  const { t } = useTranslation();

  if (publications.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-semibold">{t("projects.relatedPublications")}</h2>
      <ul className="mt-6 space-y-5">
        {publications.map((pub) => (
          <li key={pub.id}>
            {safeHref(pub.url) ? (
              <a href={safeHref(pub.url)} target="_blank" rel="noreferrer" className="font-medium hover:text-primary hover:underline">
                {pub.title}
              </a>
            ) : (
              <span className="font-medium">{pub.title}</span>
            )}
            <p className="text-sm text-muted-foreground">
              {pub.authors}
              {pub.venue && `. ${pub.venue}`}, {pub.year}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

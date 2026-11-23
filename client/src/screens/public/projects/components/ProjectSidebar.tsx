import { useTranslation } from "react-i18next";
import type { IProject } from "@/common/types/Project";
import { useProjectPeriod } from "@/hooks/common/useProjectPeriod";

interface ProjectSidebarProps {
  project: IProject;
}

/** Project facts: a compact strip above the description on small screens, a side column from `lg` up. */
export function ProjectSidebar({ project }: ProjectSidebarProps) {
  const { t } = useTranslation();
  const period = useProjectPeriod()(project.startDate, project.endDate);

  return (
    <aside className="order-first space-y-5 border-y py-5 text-sm lg:order-none lg:space-y-8 lg:border-0 lg:py-0">
      <dl className="flex flex-wrap gap-x-8 gap-y-4 lg:block lg:space-y-4">
        <div>
          <dt className="text-muted-foreground">{t("projects.fields.status")}</dt>
          <dd className="mt-1 font-medium text-primary">{t(`projects.status.${project.status}`)}</dd>
          {period && <dd className="mt-0.5">{period}</dd>}
        </div>
        {project.tags.length > 0 && (
          <div className="min-w-0">
            <dt className="text-muted-foreground">{t("projects.fields.tags")}</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-accent px-2.5 py-0.5 text-accent-foreground">
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
      {project.members.length > 0 && (
        <div>
          <h2 className="mb-3 text-muted-foreground">{t("projects.people")}</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:block lg:space-y-3">
            {project.members.map((member) => (
              <li key={member.memberId} className="flex items-center gap-3">
                {member.photo ? (
                  <img src={member.photo.url} alt="" className="size-10 rounded-full object-cover" />
                ) : (
                  <span className="size-10 rounded-full bg-muted" />
                )}
                <span>
                  <span className="block font-medium">{member.name}</span>
                  <span className="block text-muted-foreground">{member.role || member.title}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

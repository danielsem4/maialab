import { Github, Globe, GraduationCap, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IMember } from "@/common/types/Member";
import { safeHref } from "@/common/utils/safeHref";

const LINK_ICONS = { website: Globe, scholar: GraduationCap, linkedin: Linkedin, github: Github } as const;
type LinkKey = keyof typeof LINK_ICONS;
const LINK_KEYS = Object.keys(LINK_ICONS) as LinkKey[];

const ICON_LINK_CLASS =
  "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

interface MemberLinksProps {
  member: IMember;
}

/** Icon links (email, website, Scholar, LinkedIn, GitHub) for a member. */
export function MemberLinks({ member }: MemberLinksProps) {
  const { t } = useTranslation();
  const keys = LINK_KEYS.filter((key) => safeHref(member.links[key]));

  if (!member.email && keys.length === 0) return null;

  return (
    <ul className="-ms-2 flex flex-wrap items-center gap-0.5">
      {member.email && (
        <li>
          <a href={`mailto:${member.email}`} aria-label={`${t("members.fields.email")}: ${member.email}`} className={ICON_LINK_CLASS}>
            <Mail className="size-4" />
          </a>
        </li>
      )}
      {keys.map((key) => {
        const Icon = LINK_ICONS[key];
        return (
          <li key={key}>
            <a
              href={safeHref(member.links[key])}
              target="_blank"
              rel="noreferrer"
              aria-label={t(`members.fields.${key}`)}
              className={ICON_LINK_CLASS}
            >
              <Icon className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
